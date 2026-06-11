import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getToken } from '../utils/auth'
import '../styles/EditBookPage.css'

const carreira =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://pw-tp-36342-api.vercel.app'

export default function EditBookPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const token = getToken()
  const forceRatingMessage = location.state?.forceRatingMessage || ''

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
  const [imageError, setImageError] = useState(false)

  const getImageSrc = () => {
    if (previewImage) return previewImage
    if (formData.coverUrl) return formData.coverUrl
    return ''
  }

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`${carreira}/books/${id}`, {
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

        setImageError(false)

        if (forceRatingMessage) {
          setError(forceRatingMessage)
        }
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
  }, [id, token, forceRatingMessage, navigate])

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

    if (name === 'status' && value !== 'READ') {
      setError('')
    }

    if (name === 'coverUrl') {
      setSelectedFile(null)
      setImageError(false)

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

    if (formData.status === 'READ' && value >= 1) {
      setError('')
    }
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
    setImageError(false)

    setFormData((prev) => ({
      ...prev,
      coverUrl: '',
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (formData.status === 'READ' && Number(formData.rating) < 1) {
      setError('Se o estado for Lido, tens de atribuir um rating.')
      setSaving(false)
      return
    }

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

      const response = await fetch(`${carreira}/books/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: bodyData,
      })

      if (response.status === 401) {
        navigate('/login', { replace: true })
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar livro')
      }

      navigate(`/books/${id}`)
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
      const response = await fetch(`${carreira}/books/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        navigate('/login', { replace: true })
        return
      }

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao apagar livro')
      }

      navigate('/dashboard', {
        replace: true,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const handleCancel = () => {
    navigate(`/books/${id}`)
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

  const imageSrc = getImageSrc()
  const showImage = imageSrc && !imageError

  return (
    <div className="editbook-page">
      <Navbar />

      <main className="editbook-main">
        <div className="editbook-card">
          {error && <p className="editbook-error">{error}</p>}

          <form className="editbook-form" onSubmit={handleSubmit}>
            <div className="editbook-sidebar">
              <div className="editbook-cover-box">
                {showImage ? (
                  <img
                    src={imageSrc}
                    alt={formData.title || 'Capa do livro'}
                    className="editbook-cover-image"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="editbook-cover-image editbook-cover-placeholder">
                    Sem capa
                  </div>
                )}
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

                {formData.status === 'READ' && Number(formData.rating) < 1 && (
                  <p className="editbook-rating-warning">
                    Se o estado for Lido, tens de escolher um rating.
                  </p>
                )}
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