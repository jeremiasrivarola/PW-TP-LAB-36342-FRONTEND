import { Link } from 'react-router-dom'
import 'HomePage.css'
import logo from '../assets/logo.png'

export default function HomePage() {
  return (
    <div className="home-page">
      <img src={logo} alt="Logo MyLibrary" className="home-logo" />

      <div className="home-buttons">
        <Link to="/login" className="home-button">
          Entrar
        </Link>

        <Link to="/register" className="home-button">
          Registar
        </Link>
      </div>
    </div>
  )
}