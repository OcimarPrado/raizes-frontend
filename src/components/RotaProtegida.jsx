import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RotaProtegida({ children, roles }) {
  const { usuario, carregando } = useAuth()
  if (carregando) return <p className="text-center mt-10 text-gray-400">Carregando...</p>
  if (!usuario) return <Navigate to="/login" />
  if (roles && !roles.includes(usuario.role)) return <Navigate to="/" />
  return children
}
