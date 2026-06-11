import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getToken } from '../utils/auth'
import '../styles/Dashboard.css'

const carreira =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://pw-tp-36342-api.vercel.app'

export default function DashboardPage() {
  const navigate = useNavigate()
  const token = getToken()

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [imageErrors, setImageErrors] = useState({})

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${carreira}/books`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 401) {
          navigate('/login', { replace: true })
          return
        }

        if (!response.ok) {
          throw new Error('Erro ao buscar os livros')
        }

        const data = await response.json()
        setBooks(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchBooks()
    } else {
      setLoading(false)
      navigate('/login', { replace: true })
    }
  }, [token, navigate])

  const limit = 4

  const toReadBooks = books.filter((book) => book.status === 'TO_READ').slice(0, limit)
  const readingBooks = books.filter((book) => book.status === 'READING').slice(0, limit)
  const readBooks = books.filter((book) => book.status === 'READ').slice(0, limit)

  const renderBookCover = (book) => {
    const hasImage = book.coverUrl && !imageErrors[book.id]

    if (hasImage) {
      return (
        <img
          src={book.coverUrl}
          alt={book.title}
          className="dashboard-book-image"
          loading="lazy"
          onError={() =>
            setImageErrors((prev) => ({
              ...prev,
              [book.id]: true,
            }))
          }
        />
      )
    }

    return (
      <div className="dashboard-book-image dashboard-book-placeholder">
        Sem capa
      </div>
    )
  }

  const renderSection = (title, sectionBooks, status) => {
    return (
      <section className="dashboard-section">
        <h2 className="dashboard-section-title">{title}</h2>

        <div className="dashboard-row">
          {sectionBooks.map((book) => (
            <figure
              key={book.id}
              className="dashboard-book-card"
              onClick={() => navigate(`/books/${book.id}`)}
            >
              {renderBookCover(book)}
              <figcaption className="dashboard-book-title">
                {book.title}
              </figcaption>
            </figure>
          ))}

          <div
            className="dashboard-book-card"
            onClick={() =>
              navigate('/add-book', { state: { defaultStatus: status } })
            }
          >
            <div className="dashboard-action-card">
              <div className="dashboard-circle dashboard-circle-plus">+</div>
            </div>
            <p className="dashboard-action-text">Adicionar livro</p>
          </div>

          <div
            className="dashboard-book-card"
            onClick={() =>
              navigate('/all-books', { state: { filterStatus: status } })
            }
          >
            <div className="dashboard-action-card">
              <div className="dashboard-circle dashboard-circle-list"></div>
            </div>
            <p className="dashboard-action-text">Ver todos</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        <h1 className="dashboard-title">Dashboard</h1>

        {loading && <p className="dashboard-message">A carregar livros...</p>}
        {error && <p className="dashboard-error">{error}</p>}

        {!loading && !error && (
          <>
            {renderSection('Por Ler', toReadBooks, 'TO_READ')}
            {renderSection('A ler', readingBooks, 'READING')}
            {renderSection('Lidos', readBooks, 'READ')}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}