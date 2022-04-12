import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {getAuth,createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'

import {db} from '../firebase.config'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import OAuth from '../components/OAuth'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import {doc, serverTimestamp, setDoc } from 'firebase/firestore'

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const { name, email, password } = formData
  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try{
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth,email,password)
      const user = userCredential.user

      updateProfile(auth.currentUser,{
        displayName:name
      })
      
      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()

      await setDoc(doc(db,'users',user.uid),formDataCopy)

      navigate('/')

    }catch(error){
      toast.error('Problemas al registrar usuario')
    }
  }


  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Bienvenido de vuelta!</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <input 
            type="text" 
            className="nameInput" 
            placeholder='Nombre'
            id="name" 
            value={name} 
            onChange={onChange} />
            
            <input 
            type="email" 
            className="emailInput" 
            placeholder='correo electrónico'
            id="email" 
            value={email} 
            onChange={onChange} />
            <div className="passwordInputDiv">
              <input type={showPassword ? 'text' : 'password'}
                className="passwordInput" placeholder='contraseña'
                id="password"
                value={password}
                onChange={onChange} />
              <img src={visibilityIcon} alt='Mostrar' className='showPassword'
                onClick={() => setShowPassword((prevState) => !prevState)} />
            </div>
            <Link to='/forgot' className='forgotPasswordLink'>Olvidé mi contraseña</Link>
            <div className="signUpBar">
              <p className="signUpText">Registrate</p>
              <button type ='submit' className="signUpButton">
                <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
              </button>
            </div>
          </form>
          <OAuth />
          <Link to='/sign-in' className='registerLink'> Inicia Sesión </Link>
        </main>
      </div>
    </>
  )
}

export default SignUp