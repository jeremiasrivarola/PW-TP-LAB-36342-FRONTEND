import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken } from '../utils/auth'
import './Navbar.css'
import logo from '../assets/logo.png'

const carreira =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://pw-tp-36342-api.vercel.app'

export default function Navbar() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const handleSearch = async () => {
    const token = getToken()
    const query = search.trim().toLowerCase()

    if (!query) return

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    try {
      const response = await fetch(`${carreira}/books`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        navigate('/login', { replace: true })
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao pesquisar livros')
      }

      const foundBook = data.find((book) =>
        book.title?.toLowerCase().includes(query)
      )

      if (foundBook) {
        setSearch('')
        navigate(`/books/${foundBook.id}`)
      } else {
        alert('Livro não encontrado.')
      }
    } catch (err) {
      alert(err.message)
    }
  }

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
        />
      </div>

      <Link to="/profile" className="navbar-user-button">
        <span className="navbar-user-icon">👤</span>
      </Link>
    </header>
  )
}