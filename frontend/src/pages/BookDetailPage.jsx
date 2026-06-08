import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getToken } from '../utils/auth'
import '../styles/BookDetailPage.css'

export default function BookDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const token = getToken()

  const [book, setBook] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const getImageSrc = (coverUrl) => {
    if (!coverUrl) return 'https://via.placeholder.com/220x320?text=Sem+Capa'

    if (coverUrl.startsWith('/uploads')) {
      return `http://localhost:3000${coverUrl}`
    }

    return coverUrl
  }

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:3000/books/${id}`, {
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
          throw new Error(data.error || 'Erro ao buscar livro')
        }

        setBook(data)
        setStatus(data.status)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (!token) {
      setLoading(false)
      navigate('/login', { replace: true })
      return
    }

    fetchBook()
  }, [id, token, navigate])

  const handleStatusUpdate = async (newStatus) => {
    setError('')

    if (newStatus === 'READ' && (!book.rating || Number(book.rating) < 1)) {
      setError('Para marcar como lido, tens de dar um rating primeiro.')
      setStatus(book.status)

      navigate(`/books/${book.id}/edit`, {
        state: {
          forceRatingMessage: 'Para marcar este livro como lido, tens de atribuir um rating.',
        },
      })
      return
    }

    setStatus(newStatus)
    setSaving(true)

    try {
      const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (response.status === 401) {
        navigate('/login', { replace: true })
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar estado')
      }

      setBook(data)
      setStatus(data.status)
    } catch (err) {
      setError(err.message)
      setStatus(book.status)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bookdetail-page">
        <Navbar />
        <main className="bookdetail-main">
          <p>A carregar livro...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (error && !book) {
    return (
      <div className="bookdetail-page">
        <Navbar />
        <main className="bookdetail-main">
          <p className="bookdetail-error">{error}</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bookdetail-page">
      <Navbar />

      <main className="bookdetail-main">
        {error && <p className="bookdetail-error">{error}</p>}

        <div className="bookdetail-card">
          <div className="bookdetail-left">
            <img
              src={getImageSrc(book.coverUrl)}
              alt={book.title}
              className="bookdetail-cover"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src =
                  'https://via.placeholder.com/220x320?text=Sem+Capa'
              }}
            />

            <div className="bookdetail-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="bookdetail-star">
                  {book.rating >= star ? '★' : '☆'}
                </span>
              ))}
            </div>
          </div>

          <div className="bookdetail-right">
            <div className="bookdetail-top">
              <div>
                <h1 className="bookdetail-title">{book.title}</h1>
                <p className="bookdetail-author">{book.author}</p>
              </div>

              <button
                className="bookdetail-edit-btn"
                onClick={() => navigate(`/books/${book.id}/edit`)}
              >
                ✎
              </button>
            </div>

            <div className="bookdetail-meta">
              <p><strong>Género:</strong> {book.genre || '—'}</p>
              <p><strong>Ano:</strong> {book.year || '—'}</p>
            </div>

            <div className="bookdetail-section">
              <h3 className="bookdetail-section-title">Descrição</h3>
              <p className="bookdetail-description">
                {book.description || 'Sem descrição.'}
              </p>
            </div>

            <div className="bookdetail-section">
              <h3 className="bookdetail-section-title">Apontamentos</h3>
              <p className="bookdetail-note">
                {book.personalNote || 'Sem apontamentos.'}
              </p>
            </div>

            <div className="bookdetail-status-group">
              <label className="bookdetail-status-label">Estado</label>
              <select
                className="bookdetail-status"
                value={status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                disabled={saving}
              >
                <option value="TO_READ">Por ler</option>
                <option value="READING">A ler</option>
                <option value="READ">Lido</option>
              </select>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}