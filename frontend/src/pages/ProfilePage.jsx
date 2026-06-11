import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getToken, removeToken } from '../utils/auth'
import '../styles/ProfilePage.css'

const carreira =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://pw-tp-36342-api.vercel.app'

export default function ProfilePage() {
  const navigate = useNavigate()
  const token = getToken()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalByStatus: {
      READ: 0,
      READING: 0,
      TO_READ: 0,
    },
    mostReadGenre: null,
    averageRating: null,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userResponse, statsResponse] = await Promise.all([
          fetch(`${carreira}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${carreira}/stats`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ])

        const userData = await userResponse.json()
        const statsData = await statsResponse.json()

        if (!userResponse.ok) {
          throw new Error(userData.error || 'Erro ao carregar utilizador')
        }

        if (!statsResponse.ok) {
          throw new Error(statsData.error || 'Erro ao carregar estatísticas')
        }

        setFormData((prev) => ({
          ...prev,
          username: userData.username || '',
          email: userData.email || '',
        }))

        setStats({
          totalBooks: statsData.totalBooks || 0,
          totalByStatus: statsData.totalByStatus || {
            READ: 0,
            READING: 0,
            TO_READ: 0,
          },
          mostReadGenre: statsData.mostReadGenre || null,
          averageRating: statsData.averageRating ?? null,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    fetchProfileData()
  }, [token, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.username.trim()) {
      setError('O username é obrigatório.')
      return
    }

    if (!formData.email.trim()) {
      setError('O email é obrigatório.')
      return
    }

    if (formData.password && formData.password.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As palavras-passe não coincidem.')
      return
    }

    setSaving(true)

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
      }

      if (formData.password.trim()) {
        payload.password = formData.password
      }

      const response = await fetch(`${carreira}/users/me`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar perfil')
      }

      setSuccess('Perfil atualizado com sucesso!')
      setFormData((prev) => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    removeToken()
    navigate('/login', { replace: true })
  }

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <main className="profile-main">
          <p>A carregar perfil...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-main">
        <h1 className="profile-title">O meu perfil</h1>

        {error && <p className="profile-error">{error}</p>}
        {success && <p className="profile-success">{success}</p>}

        <div className="profile-layout">
          <section className="profile-card">
            <h2 className="profile-section-title">Dados da conta</h2>

            <form className="profile-form" onSubmit={handleSubmit}>
              <label className="profile-label">
                Username
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="profile-input"
                />
              </label>

              <label className="profile-label">
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="profile-input"
                />
              </label>

              <label className="profile-label">
                Nova palavra-passe
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="profile-input"
                  placeholder="Deixa vazio para não alterar"
                />
              </label>

              <label className="profile-label">
                Confirmar palavra-passe
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="profile-input"
                />
              </label>

              <div className="profile-actions">
                <button
                  type="submit"
                  className="profile-primary-btn"
                  disabled={saving}
                >
                  {saving ? 'A guardar...' : 'Guardar alterações'}
                </button>

                <button
                  type="button"
                  className="profile-logout-btn"
                  onClick={handleLogout}
                >
                  Terminar sessão
                </button>
              </div>
            </form>
          </section>

          <section className="profile-stats-card">
            <h2 className="profile-section-title">Estatísticas</h2>

            <div className="profile-stats-grid">
              <div className="profile-stat-box">
                <span className="profile-stat-label">Total de livros</span>
                <strong className="profile-stat-value">{stats.totalBooks}</strong>
              </div>

              <div className="profile-stat-box">
                <span className="profile-stat-label">Por ler</span>
                <strong className="profile-stat-value">{stats.totalByStatus.TO_READ}</strong>
              </div>

              <div className="profile-stat-box">
                <span className="profile-stat-label">A ler</span>
                <strong className="profile-stat-value">{stats.totalByStatus.READING}</strong>
              </div>

              <div className="profile-stat-box">
                <span className="profile-stat-label">Lidos</span>
                <strong className="profile-stat-value">{stats.totalByStatus.READ}</strong>
              </div>

              <div className="profile-stat-box">
                <span className="profile-stat-label">Género mais lido</span>
                <strong className="profile-stat-value">
                  {stats.mostReadGenre?.genre || '—'}
                </strong>
              </div>

              <div className="profile-stat-box">
                <span className="profile-stat-label">Média de avaliações</span>
                <strong className="profile-stat-value">
                  {stats.averageRating ?? '—'}
                </strong>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}