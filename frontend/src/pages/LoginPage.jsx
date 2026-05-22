import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../styles/LoginPage.css'
import logo from '../assets/logo.png'

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
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
        setError(data.error || 'Erro no login')
        return
      }

      const token = data.token

      navigate('/dashboard', {
        state: { token },
      })
    } catch (err) {
      setError('Não foi possível ligar à API')
    }
  }

  return (
    <div className="login-page">
      <img src={logo} alt="MyLibrary logo" className="login-logo" />

      <div className="login-card">
        <h1 className="login-title">Entrar</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Palavra-Passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>

        {error && <p className="login-error">{error}</p>}

        <p className="login-footer">
          Ainda não tens conta? <Link to="/register">Criar conta</Link>
        </p>
      </div>
    </div>
  )
}