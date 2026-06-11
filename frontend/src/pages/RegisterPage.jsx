import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/RegisterPage.css'
import logo from '../assets/logo.png'

const carreira =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://pw-tp-36342-api.vercel.app'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${carreira}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Erro ao criar conta')
      }

      navigate('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <img src={logo} alt="MyLibrary logo" className="register-logo" />

      <div className="register-card">
        <h1 className="register-title">Criar Conta</h1>

        {error && <p className="register-error">{error}</p>}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-field">
            <label htmlFor="username">Nome de utilizador</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="register-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="register-field">
            <label htmlFor="password">Palavra-Passe</label>
            <div className="register-password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="register-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Esconder password' : 'Mostrar password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? 'A criar...' : 'Criar Conta'}
          </button>
        </form>

        <p className="register-footer">
          Já tens conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}