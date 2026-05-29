import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/Dashboard.css'

export default function DashboardPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const token = location.state?.token

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3000/books', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

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
      setError('Sem token')
    }
  }, [token])

  const limit = 2

  const toReadBooks = books.filter((b) => b.status === 'TO_READ').slice(0, limit)
  const readingBooks = books.filter((b) => b.status === 'READING').slice(0, limit)
  const readBooks = books.filter((b) => b.status === 'READ').slice(0, limit)

  const renderSection = (title, sectionBooks, status) => {
    return (
      <section className="dashboard-section">
        <h2 className="dashboard-section-title">{title}</h2>

        <div className="dashboard-row">
          {sectionBooks.map((book) => (
            <div
              key={book.id}
              className="dashboard-book-card"
              onClick={() => navigate(`/books/${book.id}`, { state: { token } })}
            >
              <img
                src={book.coverUrl}
                alt={book.title}
                className="dashboard-book-image"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src =
                    'https://via.placeholder.com/120x180?text=Sem+Capa'
                }}
              />
            </div>
          ))}

          {/* Botão + Adicionar livro — passa o status da secção */}
          <div
            className="dashboard-book-card"
            onClick={() =>
              navigate('/add-book', { state: { token, defaultStatus: status } })
            }
          >
            <div className="dashboard-action-card">
              <div className="dashboard-circle dashboard-circle-plus">+</div>
            </div>
            <p className="dashboard-action-text">Adicionar livro</p>
          </div>

          {/* Botão Ver todos — passa o status para filtrar */}
          <div
            className="dashboard-book-card"
            onClick={() =>
              navigate('/all-books', { state: { token, filterStatus: status } })
            }
          >
            <div className="dashboard-action-card">
              <div className="dashboard-circle dashboard-circle-list">≡</div>
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