import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import SwiperCore,{Navigation, Pagination,Scrollbar,A11y} from 'swiper'
import {Swiper,SwiperSlide} from 'swiper/react'
import 'swiper/swiper-bundle.css'

import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
//import { list } from 'firebase/storage'

SwiperCore.use([Navigation,Pagination,Scrollbar,A11y])

function Listing() {

    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)

    const navigate = useNavigate()
    const params = useParams()

    const auth = getAuth()
    // console.log(params.listingId)
    useEffect(() => {
        const fecthListing = async () => {
            // console.log(params.listingId)
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)



            if (docSnap.exists()) {
                console.log(docSnap.data())
                setListing(docSnap.data())

                setLoading(false)
            }
        }
        fecthListing()
    }, [navigate, params.listingId])
    if (loading) {
        return <Spinner />
    }
    return (
        <main>
            <Swiper slidesPerView={1}
            pagination={{clickakle:true}}>
                {listing.imgUrls.map((url,index)=>(
                    <SwiperSlide key={index}>
                        <div 
                        style ={{background:`url(${listing.imgUrls[index]}) center no-repeat`,backgroundSize:'cover'}}
                        className="swiperSlideDiv">

                        </div>
                    </SwiperSlide>
                ))}

            </Swiper>


            <div className="shareIconDiv" onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setShareLinkCopied(true)
                setTimeout(() => {
                    setShareLinkCopied(false)
                }, 2000)

            }} >
                <img src={shareIcon} alt='compartir' />
            </div>
            {shareLinkCopied && <p className='linkCopied'>Vinculo Copiado</p>}
            <div className="listingDetails">
                <p className="listingName">
                    {listing.name} - $
                    {listing.offer ?
                        listing.discountedPrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',') :
                        listing.regularPrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                </p>
                <p className="listingLocation">
                    {listing.location}
                </p>
                <p className="listingType">
                    Para {listing.type === 'rent' ? 'Arriendo' : 'Venta'}
                </p>
                {listing.offer && (
                    <p className="discountPrice">
                        $ {(listing.regularPrice - listing.discountedPrice)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        } de descuento
                    </p>
                )}
                <ul className="listingDetailsList">
                    <li>
                        {listing.bedrooms > 1 ? `${listing.bedrooms} dormitorios` : 'un dormitorio'}
                    </li>
                    <li>
                        {listing.bathrooms > 1 ? `${listing.bathrooms} baños` : 'un baño'}
                    </li>
                    <li>
                        {listing.parking && 'Estacionamiento'}
                    </li>
                    <li>{listing.furnished && 'Amboblado'}</li>
                </ul>
                <p className="listingLocationTitle">
                    Ubicación
                </p>

                <div className="leafletContainer">
                    <MapContainer
                        style={{ height: '100%', width: '100%' }}
                        center={[listing.geolocation.lat, listing.geolocation.lng]}
                        zoom={15}
                        scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                        />
                        <Marker
                            position={[listing.geolocation.lat, listing.geolocation.lng]}
                        >
                            <Popup>{listing.location}</Popup>
                        </Marker>
                    </MapContainer>



                </div>
                {auth.currentUser?.uid !== listing.userRef && (
                    <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`}
                        className='primaryButton' >
                        Contactar al Dueño
                    </Link>
                )}
            </div>
        </main>
    )
}

export default Listing

// https://stackoverflow.com/questions/67552020/how-to-fix-error-failed-to-compile-node-modules-react-leaflet-core-esm-pat