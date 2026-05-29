import { Link } from 'react-router-dom'
import './Navbar.css'
import logo from '../assets/logo.png'

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/dashboard" className="navbar-logo-link">
        <img src={logo} alt="MyLibrary logo" className="navbar-logo" />
      </Link>

      <div className="navbar-search">
        <span className="navbar-search-icon">⌕</span>
        <input
          type="text"
          placeholder="Pesquise o seu livro"
          className="navbar-search-input"
        />
      </div>

      <button className="navbar-user-button">
        <span className="navbar-user-icon">👤</span>
      </button>
    </header>
  )
}