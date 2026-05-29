import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/AddBookPage.css'

export default function AddBookPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const token = location.state?.token

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [year, setYear] = useState('')
  const [description, setDescription] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [rating, setRating] = useState(0)
  const [personalNote, setPersonalNote] = useState('')
  const [status, setStatus] = useState('TO_READ')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const genres = [
    'Fantasy',
    'Romance',
    'Drama',
    'Dystopia',
    'Thriller',
    'Mystery',
    'Horror',
    'Adventure',
    'Sci-Fi',
    'Biography',
    'History',
    'Poetry',
    'Young Adult',
    'Classic',
    'Other',
  ]

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!token) {
      setError('Sem token. Faz login novamente.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          author,
          genre,
          year: Number(year),
          description,
          coverUrl,
          rating,
          personalNote,
          status,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Erro ao adicionar livro')
      }

      setSuccess('Livro adicionado com sucesso!')

      setTimeout(() => {
        navigate('/dashboard', { state: { token } })
      }, 1000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="addbook-page">
      <Navbar />

      <main className="addbook-main">
        <h1 className="addbook-title">Adicionar livro</h1>

        {error && <p className="addbook-error">{error}</p>}
        {success && <p className="addbook-success">{success}</p>}

        <form className="addbook-card" onSubmit={handleSubmit}>
          <div className="addbook-left">
            <div className="addbook-cover-box">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={title || 'Capa do livro'}
                  className="addbook-cover-image"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src =
                      'https://via.placeholder.com/220x320?text=Sem+Capa'
                  }}
                />
              ) : (
                <div className="addbook-cover-placeholder">Sem capa</div>
              )}
            </div>

            <label className="addbook-label">URL da capa</label>
            <input
              type="text"
              className="addbook-input"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
            />

            <label className="addbook-label">Rating</label>
            <div className="addbook-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`addbook-star ${rating >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="addbook-right">
            <label className="addbook-label">Título</label>
            <input
              type="text"
              className="addbook-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label className="addbook-label">Autor</label>
            <input
              type="text"
              className="addbook-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />

            <div className="addbook-row">
              <div className="addbook-col">
                <label className="addbook-label">Género</label>
                <select
                  className="addbook-input"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                >
                  <option value="">Seleciona um género</option>
                  {genres.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="addbook-col">
                <label className="addbook-label">Ano</label>
                <input
                  type="number"
                  className="addbook-input"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>
            </div>

            <label className="addbook-label">Descrição</label>
            <textarea
              className="addbook-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              required
            />

            <label className="addbook-label">Nota pessoal</label>
            <textarea
              className="addbook-textarea"
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              rows="4"
            />

            <label className="addbook-label">Estado</label>
            <select
              className="addbook-input addbook-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="TO_READ">Por ler</option>
              <option value="READING">A ler</option>
              <option value="READ">Lido</option>
            </select>

            <div className="addbook-actions">
              <button
                type="button"
                className="addbook-secondary-btn"
                onClick={() => navigate('/dashboard', { state: { token } })}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="addbook-primary-btn"
                disabled={loading}
              >
                {loading ? 'A guardar...' : 'Adicionar livro'}
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}