import { Link } from 'react-router-dom'
import '../styles/RegisterPage.css'
import logo from '../assets/logo.png'

export default function RegisterPage() {
  return (
    <div className="register-page">
      <img src={logo} alt="MyLibrary logo" className="register-logo" />

      <div className="register-card">
        <h1 className="register-title">Criar Conta</h1>

        <form className="register-form">
          <div className="register-field">
            <label htmlFor="name">Nome</label>
            <input id="name" type="text" />
          </div>

          <div className="register-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" />
          </div>

          <div className="register-field">
            <label htmlFor="password">Palavra-Passe</label>
            <input id="password" type="password" />
          </div>

          <button type="submit" className="register-button">
            Criar Conta
          </button>
        </form>

        <p className="register-footer">
          Já tens conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}