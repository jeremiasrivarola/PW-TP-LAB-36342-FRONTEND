import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import AddBookPage from './pages/AddBookPage.jsx'
import BookDetailPage from './pages/BookDetailPage.jsx'
import AllBooksPage from './pages/AllBooksPage'
import EditBookPage from './pages/EditBookPage.jsx'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/add-book" element={<AddBookPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/all-books" element={<AllBooksPage />} />
        <Route path="/books/:id/edit" element={<EditBookPage />} />
      </Routes>
    </BrowserRouter>
  )
}