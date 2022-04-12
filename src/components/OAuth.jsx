
import {useLocation,useNavigate} from 'react-router-dom'
import {getAuth,signInWithPopup,GoogleAuthProvider} from 'firebase/auth'
import {doc,setDoc,getDoc,serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'

function OAuth() {
    const navigate = useNavigate()
    const location = useLocation()

    const onGoogleClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth,provider)
            const user = result.user

            //Check for user
            const docRef = doc(db,'users',user.uid)

            const docSnap = await getDoc(docRef)
            console.log(docRef)
            //Si el usurio no existe , se crea
            if(!docSnap.exists()){
                console.log('crea')
                await setDoc(doc(db,'users',user.uid),{
                    name: user.displayName,
                    email: user.email,
                    timestamp:serverTimestamp()
                })

            }
            navigate('/')


        } catch (error) {
            console.log(error)
            toast.error('No se pudo autorizar con Google')
        }

    }
    
  return (
    <div className='socialLogin'>
        <p>{location.pathname === '/sign-up' ? 'Crea una cuenta': 'Iniciar Sesión'} con </p>
        <button className="socialIconDiv" onClick={onGoogleClick}>
            <img src={googleIcon} className='socialIconImg' alt='google' onClick={onGoogleClick} />
        </button>
    </div>
  )
}

export default OAuth