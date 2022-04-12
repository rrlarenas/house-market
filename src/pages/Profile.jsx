import { useEffect, useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { updateDoc, doc, serverTimestamp, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate, Link } from 'react-router-dom'
import ListingItem from '../components/ListingItem'
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

function Profile() {

  const auth = getAuth()
  const [changeDetails, setChangeDetails] = useState(false)
  const [loading, setLoading] = useState(true)
  const [listings,setListings] = useState(null)
  // const [changeDetails, setChangeDetails] = useState(false)

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const { name, email } = formData
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserListings = async () => {
      setLoading(true)
      const listingsRef = collection(db,'listings')
      const q= query(listingsRef,where('userRef','==',auth.currentUser.uid),orderBy('timestamp','desc'))
      const qrySnap =  await getDocs(q)

      const listings = []

      qrySnap.forEach((doc)=>{
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setListings(listings)  


    }

    fetchUserListings()
    setLoading(false)
  },[auth.currentUser.uid])


  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name: name,
          timestamp: serverTimestamp()
        })
      }
    } catch (error) {
      console.log(error)
      toast.error('No se pudo actualizar la información')
    }

  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value

    }))
  }

  const onDelete = async (listingId) => {
      if(window.confirm('Seguro de borrar la publicación?')){
        
        await deleteDoc(doc(db,'listings',listingId))
        const updatedListings = listings.filter((listing) => listing.id !== listingId)
        setListings(updatedListings)
        toast.success('Publicación eliminada con éxito')
      }
  }
  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

  return <div className="profile">
    <header className="profileHeader">
      <p className="pageHeader">Mi Perfíl</p>
      <button className="logOut" type='button' onClick={onLogout}>
        Logout
      </button>

    </header>
    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">Información Personal</p>
        <p className="changePersonalDetails" onClick={() => {
          changeDetails && onSubmit()
          setChangeDetails((prevState) => !prevState)
        }}>
          {changeDetails ? 'done' : 'change'}

        </p>
      </div>
      <div className="profileCard">
        <form onSubmit={onSubmit}>
          <input type="text" id="name" className={!changeDetails ? 'profileName' : 'profileNameActive'}
            disabled={!changeDetails}
            value={name}
            onChange={onChange} />
          <input type="text" id="email" className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
            disabled={!changeDetails}
            value={email}
            onChange={onChange} />
        </form>
      </div>
      <Link to='/create-listing' className='createListing'>
        <img src={homeIcon} alt='home' />
        <p>Vende o arrienda tu casa</p>
        <img src={arrowRight} alt='volver' />
      </Link>

{!loading && listings?.length > 0 && (
  <>
  <p className="listingText">Tus publicaciones</p>
  <ul className="listingList">
    {listings.map((listing)=>(
      <ListingItem key={listing.id} listing={listing.data} 
         id={listing.id} 
         onDelete={() => onDelete(listing.id)} 
         onEdit={() => onEdit(listing.id)} 
         />
    ))}
  </ul>
  </>
)}

    </main>
  </div>
}

export default Profile