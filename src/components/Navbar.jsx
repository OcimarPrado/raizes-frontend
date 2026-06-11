import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
    setMenuAberto(false)
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <span style={{fontSize: 24}}>🌵</span>
        <div>
          <p style={styles.logoNome}>Raízes do Nordeste</p>
          <p style={styles.logoSub}>Sabor e tradição</p>
        </div>
      </Link>

      {/* Botão hamburguer mobile */}
      <button style={styles.hamburguer} onClick={() => setMenuAberto(!menuAberto)}>
        {menuAberto ? '✕' : '☰'}
      </button>

      {/* Menu */}
      <div style={{...styles.menu, ...(menuAberto ? styles.menuAberto : {})}}>
        <Link to="/cardapio" style={styles.link} onClick={() => setMenuAberto(false)}>Cardápio</Link>

        {!usuario && (
          <Link to="/login" style={styles.btnEntrar} onClick={() => setMenuAberto(false)}>Entrar</Link>
        )}

        {usuario && (
          <>
            <Link to="/carrinho" style={styles.link} onClick={() => setMenuAberto(false)}>🛒 Pedido</Link>
            <Link to="/meus-pedidos" style={styles.link} onClick={() => setMenuAberto(false)}>📋 Meus Pedidos</Link>
          </>
        )}

        {usuario?.role === 'GERENTE' && (
          <>
            <Link to="/admin/pedidos" style={styles.btnAdmin} onClick={() => setMenuAberto(false)}>Pedidos</Link>
            <Link to="/admin/estoque" style={styles.btnAdmin} onClick={() => setMenuAberto(false)}>Estoque</Link>
            <Link to="/admin/produtos" style={styles.btnAdmin} onClick={() => setMenuAberto(false)}>Produtos</Link>
          </>
        )}

        {usuario && (
          <div style={styles.usuario}>
            <span style={styles.nomeUsuario}>Olá, {usuario.nome.split(' ')[0]}</span>
            <button onClick={handleLogout} style={styles.btnSair}>Sair</button>
          </div>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    background: '#3d1f0a',
    color: '#fff',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    position: 'relative',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
  },
  logoNome: { color: '#f0a500', fontWeight: 800, fontSize: 16, margin: 0 },
  logoSub: { color: '#e8d5b0', fontSize: 11, margin: 0, opacity: 0.7 },
  hamburguer: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: 24,
    cursor: 'pointer',
    display: 'block',
  },
  menu: {
    display: 'none',
    flexDirection: 'column',
    width: '100%',
    gap: 8,
    paddingTop: 12,
  },
  menuAberto: {
    display: 'flex',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 4px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    fontSize: 15,
  },
  btnEntrar: {
    background: '#e67e22',
    color: '#fff',
    textDecoration: 'none',
    padding: '10px 16px',
    borderRadius: 8,
    fontWeight: 600,
    textAlign: 'center',
  },
  btnAdmin: {
    background: '#f0a500',
    color: '#3d1f0a',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: 8,
    fontWeight: 700,
    textAlign: 'center',
    fontSize: 14,
  },
  usuario: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTop: '1px solid rgba(255,255,255,0.2)',
    marginTop: 4,
  },
  nomeUsuario: { color: '#e8d5b0', fontSize: 13 },
  btnSair: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
  },
}
