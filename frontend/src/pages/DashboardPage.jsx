import { useLocation } from 'react-router-dom'

export default function DashboardPage() {
  const location = useLocation()
  const token = location.state?.token

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#ccd5ae',
        padding: '40px',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <h1>Próxima Página</h1>
      <p>Token recebido:</p>
      <p style={{ wordBreak: 'break-all' }}>
        {token || 'Sem token'}
      </p>
    </div>
  )
}