import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/AllBooksPage.css'

export default function AllBooksPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const token = location.state?.token
  const initialStatus = location.state?.filterStatus || ''

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState(initialStatus)
  const [genreFilter, setGenreFilter] = useState('')

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

  const statusTitleMap = {
    TO_READ: 'Por ler',
    READING: 'A ler',
    READ: 'Lidos',
  }

  const getImageSrc = (coverUrl) => {
    if (!coverUrl) return 'https://via.placeholder.com/90x130?text=Sem+Capa'

    if (coverUrl.startsWith('/uploads')) {
      return `http://localhost:3000${coverUrl}`
    }

    return coverUrl
  }

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3000/books', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao buscar livros')
        }

        setBooks(data)
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

    fetchBooks()
  }, [token])

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchStatus = statusFilter ? book.status === statusFilter : true
      const matchGenre = genreFilter ? book.genre === genreFilter : true
      return matchStatus && matchGenre
    })
  }, [books, statusFilter, genreFilter])

  const pageTitle = statusFilter ? statusTitleMap[statusFilter] : 'Todos os livros'

  return (
    <div className="allbooks-page">
      <Navbar />

      <main className="allbooks-main">
        <div className="allbooks-layout">
          <aside className="allbooks-filter">
            <h2 className="allbooks-filter-title">Filtro</h2>

            <label className="allbooks-label">Estado</label>
            <select
              className="allbooks-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="TO_READ">Por ler</option>
              <option value="READING">A ler</option>
              <option value="READ">Lidos</option>
            </select>

            <label className="allbooks-label">Género</label>
            <select
              className="allbooks-select"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
            >
              <option value="">Todos</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>

            <button
              className="allbooks-clear-btn"
              onClick={() => {
                setStatusFilter(initialStatus || '')
                setGenreFilter('')
              }}
            >
              Limpar filtros
            </button>
          </aside>

          <section className="allbooks-content">
            <div className="allbooks-header">
              <h1 className="allbooks-title">{pageTitle}</h1>

              <button
                className="allbooks-add-btn"
                onClick={() =>
                  navigate('/add-book', {
                    state: { token, defaultStatus: statusFilter || 'TO_READ' },
                  })
                }
              >
                +
              </button>
            </div>

            {loading && <p className="allbooks-message">A carregar livros...</p>}
            {error && <p className="allbooks-error">{error}</p>}

            {!loading && !error && filteredBooks.length === 0 && (
              <p className="allbooks-message">Nenhum livro encontrado.</p>
            )}

            {!loading && !error && filteredBooks.length > 0 && (
  <div className="allbooks-list-box">
    {filteredBooks.map((book, index) => (
      <div
        key={book.id}
        className={`allbooks-row ${
          index !== filteredBooks.length - 1 ? 'with-divider' : ''
        }`}
        onClick={() =>
          navigate(`/books/${book.id}`, { state: { token } })
        }
      >
        <img
          src={getImageSrc(book.coverUrl)}
          alt={book.title}
          className="allbooks-cover"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src =
              'https://via.placeholder.com/90x130?text=Sem+Capa'
          }}
        />

        <div className="allbooks-info">
          <h3 className="allbooks-book-title">{book.title}</h3>
          <p className="allbooks-author">{book.author}</p>

          <div className="allbooks-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="allbooks-star">
                {book.rating >= star ? '★' : '☆'}
              </span>
            ))}
          </div>
        </div>

        <button
          className="allbooks-edit-btn"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/books/${book.id}/edit`, { state: { token } })
          }}
        >
          ✎
        </button>
      </div>
    ))}
  </div>
)}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}