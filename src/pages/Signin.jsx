import { useState } from 'react'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import OAuth from '../components/OAuth'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function Signin() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const { email, password } = formData
  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()

      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      if (userCredential.user) {
        navigate('/')
      }
    } catch (error) {
      toast.error('Credenciales incorrectas')
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
            <input type="email"
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
            <Link to='/forgot' className='forgotPasswordLink'>Olvide mi contraseña</Link>
            <div className="signInBar">
              <p className="signInText">Ingresa</p>
              <button type='submit' className="signInButton">
                <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
              </button>
            </div>
          </form>
          <OAuth />
          <Link to='/sign-up' className='registerLink'> Crea una cuenta </Link>
        </main>
      </div>
    </>
  )
}

export default Signin