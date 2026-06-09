import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-nordeste-marrom text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">🌵</span>
        <div>
          <p className="text-nordeste-amarelo font-extrabold text-lg leading-tight">Raízes do Nordeste</p>
          <p className="text-xs text-nordeste-creme opacity-70 leading-tight">Sabor e tradição</p>
        </div>
      </Link>
      <div className="flex gap-4 items-center text-sm">
        <Link to="/cardapio" className="hover:text-nordeste-amarelo transition font-medium">Cardápio</Link>
        {!usuario && (
          <Link to="/login" className="bg-nordeste-laranja px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition">
            Entrar
          </Link>
        )}
        {usuario?.role === 'CLIENTE' && (
          <Link to="/perfil" className="hover:text-nordeste-amarelo transition font-medium">Meu Perfil</Link>
        )}
        {usuario?.role === 'GERENTE' && (
          <Link to="/admin/produtos" className="bg-nordeste-amarelo text-nordeste-marrom px-4 py-2 rounded-lg font-bold hover:opacity-90 transition">
            Painel Admin
          </Link>
        )}
        {usuario && (
          <div className="flex items-center gap-3 border-l border-white border-opacity-20 pl-4">
            <span className="text-xs text-nordeste-creme opacity-70">Olá, {usuario.nome.split(' ')[0]}</span>
            <button onClick={handleLogout} className="text-xs hover:text-red-400 transition">Sair</button>
          </div>
        )}
      </div>
    </nav>
  )
}
