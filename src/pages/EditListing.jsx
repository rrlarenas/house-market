/* eslint-disable default-case */
import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from '../firebase.config'
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate, useParams } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'

function EditListing() {
    //eslint-disable-next-line
    const [geolocationEnabled, setgeolocationEnabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [listing, setListing] = useState(false)
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0,


    })
    //Deestructurar
    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        offer,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude,
    } = formData

    const auth = getAuth()
    const navigate = useNavigate()
    const params = useParams()
    const isMounted = useRef(true)

    //Redirect if listing is not user's
    useEffect(() => {
        if (listing && listing.userRef !== auth.currentUser.uid) {
            toast.error('No puede editar publicacion')
            navigate('/')
        }
    })

    //Fetch Listing to Edit
    useEffect(() => {
        setLoading(true)
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId)

            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setListing(docSnap.data())
                setFormData({ ...docSnap.data(), address: docSnap.data().location })
                setLoading(false)

            } else {
                navigate('/')
                toast.error('Publicacion no existe')
            }
        }

        fetchListing()

    }, [params.listingId, navigate])
    //Sets userRef to loggedIn User
    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData({
                        ...formData, userRef: user.uid
                    })
                } else {
                    navigate('/sign-in')
                }
            })

        }
        return () => {
            isMounted.current = false
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted])

    if (loading) {
        return <Spinner />
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (discountedPrice >= regularPrice) {
            toast.error('Precio oferta debe ser menor que precio regular')
            setLoading(false)
        }

        if (images.length > 6) {
            setLoading(false)
            toast.error('Máximo de 6 imágnes')
        }

        let geolocation = {}
        let location

        if (geolocationEnabled) {
            const API_KEY = process.env.REACT_APP_GEOCODE_API_KEY
            // console.log(process.env.REACT_APP_GEOCODE_API_KEY)
            // console.log(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`)
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`
            )

            const data = await response.json()
            // console.log(data)             ! ? significar chequear si no no tiene resultados
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0

            location = data.status === 'ZERO_RESULTS'
                ? undefined
                : data.results[0]?.formatted_address

            if (location === undefined || location.includes('undefined')) {
                setLoading(false)
                toast.error('Dirección incorrecta, por favor corrijala')
                return
            }
            console.log(location, geolocation)
            setFormData({
                ...formData, address: location
            })
            console.log(formData)


        } else {
            geolocation.lat = latitude
            geolocation.lng = longitude
            //location = address
        }


        //Alamacenar las imágenes en Fire Base

        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

                const storageRef = ref(storage, 'images/' + fileName)

                const uploadTask = uploadBytesResumable(storageRef, image)

                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                            default:
                                break;
                        }
                    },
                    (error) => {
                        reject(error)
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            // console.log('File available at', downloadURL);
                            resolve(downloadURL)
                        });
                    }
                );



            })
        }


        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch(() => {
            setLoading(false)
            toast.error('No fue posible cargar las imágenes')
        })

        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp()
        }

        formDataCopy.location = address
        delete formDataCopy.images
        delete formDataCopy.address
        //location && (formDataCopy.location = location)

        !formDataCopy.offer && delete formDataCopy.discountedPrice
        //Update Listing
        const docRef = doc(db, 'listings', params.listingId)
        await updateDoc(docRef, formDataCopy)

        setLoading(false)
        toast.success('Publicación cargada con éxito')
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }

    const onMutate = (e) => {
        let boolean = null

        if (e.target.value === 'true') {
            boolean = true
        }
        if (e.target.value === 'false') {
            boolean = false
        }
        //Archivos
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        }

        //Texto, booleanos,numeros
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value

            }))
        }


    }

    return <div className="profile">
        <header>
            <p className="pageHeader">Editar publicación</p>
        </header>
        <main>
            <form onSubmit={onSubmit}>
                <label htmlFor="" className="formLabel">Vender / Arrendar</label>
                <div className="formButtons">
                    <button
                        type='button'
                        className={type === 'sell' ? 'formButtonActive' : 'formButton'}
                        id='type'
                        value='sell'
                        onClick={onMutate}
                    >
                        Vender
                    </button>
                    <button
                        type='button'
                        className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                        id='type'
                        value='rent'
                        onClick={onMutate}
                    >
                        Arrendar
                    </button>
                </div>

                <label className='formLabel'>Name</label>
                <input
                    className='formInputName'
                    type='text'
                    id='name'
                    value={name}
                    onChange={onMutate}
                    maxLength='32'
                    minLength='10'
                    required
                />

                <div className='formRooms flex'>
                    <div>
                        <label className='formLabel'>Habitaciones</label>
                        <input
                            className='formInputSmall'
                            type='number'
                            id='bedrooms'
                            value={bedrooms}
                            onChange={onMutate}
                            min='1'
                            max='50'
                            required
                        />
                    </div>
                    <div>
                        <label className='formLabel'>Baños</label>
                        <input
                            className='formInputSmall'
                            type='number'
                            id='bathrooms'
                            value={bathrooms}
                            onChange={onMutate}
                            min='1'
                            max='50'
                            required
                        />
                    </div>
                </div>
                <label className='formLabel'>Estacionamiento</label>
                <div className='formButtons'>
                    <button
                        className={parking ? 'formButtonActive' : 'formButton'}
                        type='button'
                        id='parking'
                        value={true}
                        onClick={onMutate}
                        min='1'
                        max='50'
                    >
                        Si
                    </button>
                    <button
                        className={
                            !parking && parking !== null ? 'formButtonActive' : 'formButton'
                        }
                        type='button'
                        id='parking'
                        value={false}
                        onClick={onMutate}
                    >
                        No
                    </button>
                </div>
                <label className='formLabel'>Amoblado</label>
                <div className='formButtons'>
                    <button
                        className={furnished ? 'formButtonActive' : 'formButton'}
                        type='button'
                        id='furnished'
                        value={true}
                        onClick={onMutate}
                    >
                        Si
                    </button>
                    <button
                        className={
                            !furnished && furnished !== null
                                ? 'formButtonActive'
                                : 'formButton'
                        }
                        type='button'
                        id='furnished'
                        value={false}
                        onClick={onMutate}
                    >
                        No
                    </button>
                </div>

                <label className='formLabel'>Dirección</label>
                <textarea
                    className='formInputAddress'
                    type='text'
                    id='address'
                    value={address}
                    onChange={onMutate}
                    required
                />

                {!geolocationEnabled && (
                    <div className='formLatLng flex'>
                        <div>
                            <label className='formLabel'>Latitud</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='latitude'
                                value={latitude}
                                onChange={onMutate}
                                required
                            />
                        </div>
                        <div>
                            <label className='formLabel'>Longitud</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='longitude'
                                value={longitude}
                                onChange={onMutate}
                                required
                            />
                        </div>
                    </div>
                )}
                <label className='formLabel'>Oferta</label>
                <div className='formButtons'>
                    <button
                        className={offer ? 'formButtonActive' : 'formButton'}
                        type='button'
                        id='offer'
                        value={true}
                        onClick={onMutate}
                    >
                        Si
                    </button>
                    <button
                        className={
                            !offer && offer !== null ? 'formButtonActive' : 'formButton'
                        }
                        type='button'
                        id='offer'
                        value={false}
                        onClick={onMutate}
                    >
                        No
                    </button>
                </div>

                <label className='formLabel'>Precio</label>
                <div className='formPriceDiv'>
                    <input
                        className='formInputSmall'
                        type='number'
                        id='regularPrice'
                        value={regularPrice}
                        onChange={onMutate}
                        min='50'
                        max='750000000'
                        required
                    />
                    {type === 'rent' && <p className='formPriceText'>$ / Mes</p>}
                </div>

                {offer && (
                    <>
                        <label className='formLabel'>Precio Oferta</label>
                        <input
                            className='formInputSmall'
                            type='number'
                            id='discountedPrice'
                            value={discountedPrice}
                            onChange={onMutate}
                            min='50'
                            max='750000000'
                            required={offer}
                        />
                    </>
                )}
                <label className='formLabel'>Imágenes</label>
                <p className='imagesInfo'>
                    La primera imágen será la portada (max 6).
                </p>
                <input
                    className='formInputFile'
                    type='file'
                    id='images'
                    onChange={onMutate}
                    max='6'
                    accept='.jpg,.png,.jpeg'
                    multiple
                    required
                />
                <button type='submit' className='primaryButton createListingButton'>
                    Editar publicación
                </button>


            </form>
        </main>
    </div>
}

export default EditListing