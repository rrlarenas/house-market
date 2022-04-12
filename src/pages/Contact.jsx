import {useEffect,useState} from 'react'
import {useParams,useSearchParams} from 'react-router-dom'
import {doc, getDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'


function Contact() {

    const [message,setMessage] = useState('')
    const [landlord,setLandlord] = useState(null)
    //eslint-disable-next-line
    const [searchParams,setSearchParams] = useSearchParams()

    const params = useParams()


    useEffect(()=> {

        const getLandlord = async () =>{

            const docRef =  doc(db,'users',params.landlordId)
            const docSnap = await getDoc(docRef)
            console.log(params.landlordId)
            if(docSnap.exists){
                setLandlord(docSnap.data())
            }
            else{
                toast.error('No se pudo obtener la información del dueño')
            }
        }

        getLandlord()

    },[params.landlordId])

    const onChange = e=> setMessage(e.target.value)
  return (
    <div className="pageContainer">
        <header className="pageHeader">
            Contacte al dueño 
        </header>
        {landlord !== null && (
            <main>
                    <div className="contactLandlord">
                        <p className="landlordName">Contacto: {landlord?.name}
                        </p>
                    </div>
                    <form className="messageForm">
                        <div className="messageDiv">
                            <label htmlFor="message" className="messageLabel">Mensaje</label>
                            <textarea name="message" id="message" className='textarea' value ={message} onChange={onChange}></textarea>
                        </div>
                        <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
                            <button type='button' className="primaryButton">Enviar Mensaje</button>
                        </a>
                    </form>
            </main>
        )}
    </div>
  )
}

export default Contact