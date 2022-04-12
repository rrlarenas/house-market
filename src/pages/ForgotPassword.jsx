import {useState} from 'react'
import {Link} from 'react-router-dom'
import {getAuth,sendPasswordResetEmail} from 'firebase/auth'
import {toast} from 'react-toastify'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'

function ForgotPassword() {
  const [email,setEmail] = useState('')
  const onChange = (e)=>{
    setEmail(e.target.value)

  }
  const onSubmit = async (e) =>{
    e.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth,email)
      toast.success('Correo electrónico enviado')
    } catch (error) {
      toast.error('No se pudo enviar el link para reiniciar')
      
    }
  }
  return (
    <div className='pageContainer'>
      <header>
        <p className="pageHeader">Olvidé mi constraseña</p>
        <main>
          <form onSubmit={onSubmit}>
          <input type="email" 
          className="emailInput" 
          placeholder='Correo electrónico'
          id='email'
          value={email}
          onChange={onChange}
          />
          <Link className='forgotPasswordLink' to='/sign-in'>Ingresar</Link>
          <div className="signInBar">
            <div className="signInText">Envíame link para reiniciar</div>
            <button className="signInButton"><ArrowRightIcon 
            fill='#ffffff'
            width='34px'
            height='34px'

             /></button>
          </div>
          </form>
        </main>
      </header>
    </div>
  )
}

export default ForgotPassword
