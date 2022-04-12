import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Categories() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchListing, setLastFetchListing] = useState(null)
    const params = useParams()

    useEffect(() => {
        const fetchListings = async () => {

            try {
                //Set reference
                const listingsRef = collection(db, 'listings')
                //Create Query
                const q = query(listingsRef,
                    where('type', '==', params.categoryName),
                    orderBy('timestamp', 'desc'),
                    limit(10))

                //Execute Qry
                const querySnap = await getDocs(q)

                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchListing(lastVisible)

                const listings = []

                querySnap.forEach((doc) => {
                    // console.log(doc.data())
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setListings(listings)
                setLoading(false)

            } catch (error) {

                toast.error('No se pududo obtener la información')

            }
        }
        fetchListings()
    }, [params.categoryName])

    //Paginacion
    const onFetchMoreListings = async () => {

        try {
            //Set reference
            const listingsRef = collection(db, 'listings')
            //Create Query
            const q = query(listingsRef,
                where('type', '==', params.categoryName),
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchListing),
                limit(10))

            //Execute Qry
            const querySnap = await getDocs(q)

            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchListing(lastVisible)

            const listings = []

            querySnap.forEach((doc) => {
                // console.log(doc.data())
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setListings((prevState) => [...prevState,...listings])
            setLoading(false)

        } catch (error) {

            toast.error('No se pududo obtener la información')

        }
    }

    return (
        <div className="category">
            <header className="pageHeader">
                {params.categoryName === 'rent' ?
                    'Arriendo' :
                    'Venta'}
            </header>
            {loading ? <Spinner /> : listings && listings.length > 0 ?
                <>
                    <main>
                        <ul className="categoryListings">

                            {listings.map((listing) => (

                                <ListingItem
                                    listing={listing.data}
                                    id={listing.id}
                                    key={listing.id}
                                />

                            ))}
                        </ul>
                    </main>
                    <br />
                    <br />
                    {lastFetchListing && (
                        <p className="loadMore" onClick={onFetchMoreListings}>Cargar más</p>
                    )}
                </> :
                <p>No hay propiedades para {params.categoryName === 'rent' ? 'Arriendo' : 'Venta'}</p>}

        </div>
    )
}

export default Categories