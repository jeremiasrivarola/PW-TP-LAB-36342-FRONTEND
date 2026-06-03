import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/EditBookPage.css'

export default function EditBookPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const token = location.state?.token

  const genreOptions = [
    { value: 'ACTION', label: 'ACTION' },
    { value: 'ADVENTURE', label: 'ADVENTURE' },
    { value: 'BIOGRAPHY', label: 'BIOGRAPHY' },
    { value: 'COMEDY', label: 'COMEDY' },
    { value: 'DRAMA', label: 'DRAMA' },
    { value: 'FANTASY', label: 'FANTASY' },
    { value: 'FICTION', label: 'FICTION' },
    { value: 'HISTORY', label: 'HISTORY' },
    { value: 'HORROR', label: 'HORROR' },
    { value: 'MYSTERY', label: 'MYSTERY' },
    { value: 'POETRY', label: 'POETRY' },
    { value: 'ROMANCE', label: 'ROMANCE' },
    { value: 'SCIENCE', label: 'SCIENCE' },
    { value: 'SCIENCE_FICTION', label: 'SCIENCE_FICTION' },
    { value: 'SUSPENSE', label: 'SUSPENSE' },
    { value: 'TECHNOLOGY', label: 'TECHNOLOGY' },
    { value: 'THRILLER', label: 'THRILLER' },
  ]

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    year: '',
    description: '',
    personalNote: '',
    rating: 0,
    status: 'TO_READ',
    coverUrl: '',
  })

  const [hoverRating, setHoverRating] = useState(0)
  const [previewImage, setPreviewImage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const getImageSrc = () => {
    if (previewImage) return previewImage

    if (!formData.coverUrl) {
      return 'https://via.placeholder.com/220x320?text=Sem+Capa'
    }

    if (formData.coverUrl.startsWith('/uploads')) {
      return `http://localhost:3000${formData.coverUrl}`
    }

    return formData.coverUrl
  }

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:3000/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao carregar livro')
        }

        setFormData({
          title: data.title || '',
          author: data.author || '',
          genre: data.genre || '',
          year: data.year || '',
          description: data.description || '',
          personalNote: data.personalNote || '',
          rating: data.rating || 0,
          status: data.status || 'TO_READ',
          coverUrl: data.coverUrl || '',
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (!token) {
      setError('Sem token. Faz login novamente.')
      setLoading(false)
      return
    }

    fetchBook()
  }, [id, token])

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === 'coverUrl') {
      setSelectedFile(null)
      if (previewImage) {
        URL.revokeObjectURL(previewImage)
      }
      setPreviewImage('')
    }
  }

  const handleRatingClick = (value) => {
    setFormData((prev) => ({
      ...prev,
      rating: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (previewImage) {
      URL.revokeObjectURL(previewImage)
    }

    const objectUrl = URL.createObjectURL(file)
    setSelectedFile(file)
    setPreviewImage(objectUrl)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const bodyData = new FormData()
      bodyData.append('title', formData.title)
      bodyData.append('author', formData.author)
      bodyData.append('genre', formData.genre)
      bodyData.append('year', formData.year)
      bodyData.append('description', formData.description)
      bodyData.append('personalNote', formData.personalNote)
      bodyData.append('rating', formData.rating)
      bodyData.append('status', formData.status)
      bodyData.append('coverUrl', formData.coverUrl)

      if (selectedFile) {
        bodyData.append('cover', selectedFile)
      }

      const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: bodyData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar livro')
      }

      navigate(`/books/${id}`, { state: { token } })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Tens a certeza que queres apagar este livro?'
    )

    if (!confirmed) return

    setDeleting(true)
    setError('')

    try {
      const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao apagar livro')
      }

      navigate('/dashboard', {
        replace: true,
        state: { token },
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const handleCancel = () => {
    navigate(`/books/${id}`, { state: { token } })
  }

  if (loading) {
    return (
      <div className="editbook-page">
        <Navbar />
        <main className="editbook-main">
          <p>A carregar...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="editbook-page">
      <Navbar />

      <main className="editbook-main">
        <div className="editbook-card">
          {error && <p className="editbook-error">{error}</p>}

          <form className="editbook-form" onSubmit={handleSubmit}>
            <div className="editbook-sidebar">
              <div className="editbook-cover-box">
                <img
                  src={getImageSrc()}
                  alt={formData.title || 'Capa do livro'}
                  className="editbook-cover-image"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src =
                      'https://via.placeholder.com/220x320?text=Sem+Capa'
                  }}
                />
              </div>

              <label className="editbook-label">
                URL da capa
                <input
                  type="text"
                  name="coverUrl"
                  value={formData.coverUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </label>

              <label className="editbook-label">
                Ou carregar capa
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="editbook-file-input"
                />
              </label>

              <div className="editbook-rating-block">
                <span className="editbook-rating-label">Rating</span>

                <div
                  className="editbook-stars"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((value) => {
                    const activeValue = hoverRating || formData.rating

                    return (
                      <button
                        key={value}
                        type="button"
                        className="editbook-star-btn"
                        onClick={() => handleRatingClick(value)}
                        onMouseEnter={() => setHoverRating(value)}
                      >
                        <span className="editbook-star">
                          {value <= activeValue ? '★' : '☆'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="editbook-fields">
              <label className="editbook-label">
                Título
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="editbook-label">
                Autor
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="editbook-row">
                <label className="editbook-label">
                  Género
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleciona um género</option>
                    {genreOptions.map((genre) => (
                      <option key={genre.value} value={genre.value}>
                        {genre.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="editbook-label">
                  Ano
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <label className="editbook-label">
                Descrição
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                />
              </label>

              <label className="editbook-label">
                Nota pessoal
                <textarea
                  name="personalNote"
                  value={formData.personalNote}
                  onChange={handleChange}
                  rows="5"
                />
              </label>

              <label className="editbook-label">
                Estado
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="TO_READ">Por ler</option>
                  <option value="READING">A ler</option>
                  <option value="READ">Lido</option>
                </select>
              </label>

              <div className="editbook-actions">
                <button
                  type="submit"
                  className="editbook-save-btn"
                  disabled={saving || deleting}
                >
                  {saving ? 'A guardar...' : 'Guardar alterações'}
                </button>

                <button
                  type="button"
                  className="editbook-cancel-btn"
                  onClick={handleCancel}
                  disabled={saving || deleting}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="editbook-delete-btn"
                  onClick={handleDelete}
                  disabled={saving || deleting}
                >
                  {deleting ? 'A apagar...' : 'Apagar livro'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}