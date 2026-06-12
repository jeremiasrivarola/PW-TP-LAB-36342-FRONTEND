import { useNavigate } from 'react-router-dom'

export default function ErroPage() {
  const navigate = useNavigate()

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Poppins, sans-serif' }}>
      <h1 style={{ fontSize: '80px', margin: 0 }}>404</h1>
      <p style={{ fontSize: '20px' }}>Página não encontrada.</p>
      <button
        onClick={() => navigate('/')}
        style={{ marginTop: '20px', padding: '10px 24px', cursor: 'pointer' }}
      >
        Voltar ao início
      </button>
    </div>
  )
}