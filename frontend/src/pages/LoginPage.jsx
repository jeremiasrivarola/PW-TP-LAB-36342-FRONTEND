import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { saveToken } from '../utils/auth'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import logo from '../assets/logo.png'
import '../styles/LoginPage.css'

const carreira =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://pw-tp-36342-api.vercel.app'

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${carreira}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Erro no login')
      }

      saveToken(data.token)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <img src={logo} alt="Logo" className="login-logo" />

      <div className="login-card">
        <h1 className="login-title">Entrar</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label>Palavra-passe</label>

            <div className="login-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Palavra-passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <p className="login-footer">
          Não tens conta? <Link to="/register">Criar conta</Link>
        </p>
      </div>
    </div>
  )
}