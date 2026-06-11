import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getToken } from '../utils/auth'
import '../styles/AddBookPage.css'

const carreira =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://pw-tp-36342-api.vercel.app'

export default function AddBookPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const token = getToken()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [year, setYear] = useState('')
  const [description, setDescription] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [coverFile, setCoverFile] = useState(null)
  const [rating, setRating] = useState(0)
  const [personalNote, setPersonalNote] = useState('')
  const [status, setStatus] = useState(location.state?.defaultStatus || 'TO_READ')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [coverPreview, setCoverPreview] = useState('')

  const genres = [
    'ACTION',
    'ADVENTURE',
    'BIOGRAPHY',
    'COMEDY',
    'DRAMA',
    'FANTASY',
    'FICTION',
    'HISTORY',
    'HORROR',
    'MYSTERY',
    'POETRY',
    'ROMANCE',
    'SCIENCE',
    'SCIENCE_FICTION',
    'SUSPENSE',
    'TECHNOLOGY',
    'THRILLER',
  ]

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview(coverUrl.trim())
      return
    }

    const objectUrl = URL.createObjectURL(coverFile)
    setCoverPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [coverFile, coverUrl])

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true })
    }
  }, [token, navigate])

  function validateForm() {
    if (!token) {
      return 'Sem token. Faz login novamente.'
    }

    if (!title.trim()) {
      return 'O título é obrigatório.'
    }

    if (!author.trim()) {
      return 'O autor é obrigatório.'
    }

    if (!genre.trim()) {
      return 'O género é obrigatório.'
    }

    if (!year.trim()) {
      return 'O ano é obrigatório.'
    }

    if (!description.trim()) {
      return 'A descrição é obrigatória.'
    }

    const yearNumber = Number(year)
    const currentYear = new Date().getFullYear()

    if (Number.isNaN(yearNumber) || yearNumber < 0 || yearNumber > currentYear) {
      return 'O ano é inválido.'
    }

    if (status === 'READ') {
      if (rating < 1 || rating > 5) {
        return 'Se o livro estiver como lido, o rating é obrigatório entre 1 e 5.'
      }
    } else {
      if (rating < 0 || rating > 5) {
        return 'O rating é inválido.'
      }
    }

    if (coverFile) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
      const maxSize = 5 * 1024 * 1024

      if (!allowedTypes.includes(coverFile.type)) {
        return 'A imagem tem de ser PNG ou JPG.'
      }

      if (coverFile.size > maxSize) {
        return 'A imagem não pode ter mais de 5MB.'
      }
    }

    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('author', author.trim())
      formData.append('genre', genre)
      formData.append('year', year)
      formData.append('description', description.trim())
      formData.append('personalNote', personalNote.trim())
      formData.append('status', status)

      if (status === 'READ') {
        formData.append('rating', String(rating))
      } else {
        formData.append('rating', '0')
      }

      if (coverFile) {
        formData.append('cover', coverFile)
      } else if (coverUrl.trim()) {
        formData.append('coverUrl', coverUrl.trim())
      }

      const response = await fetch(`${carreira}/books`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.status === 401) {
        navigate('/login', { replace: true })
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Erro ao adicionar livro')
      }

      setSuccess('Livro adicionado com sucesso!')

      setTimeout(() => {
        navigate('/dashboard')
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
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt={title || 'Capa do livro'}
                  className="addbook-cover-image"
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
              onChange={(e) => {
                const value = e.target.value
                setCoverUrl(value)
                if (value.trim()) {
                  setCoverFile(null)
                }
              }}
              placeholder="https://..."
            />

            <label className="addbook-label">Ou carregar capa</label>
            <input
              type="file"
              className="addbook-input"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setCoverFile(file)
                if (file) {
                  setCoverUrl('')
                }
              }}
            />

            <label className="addbook-label">Rating</label>
            <div className="addbook-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="addbook-star"
                  onClick={() => setRating(star)}
                >
                  {rating >= star ? '★' : '☆'}
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
                onClick={() => navigate('/dashboard')}
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