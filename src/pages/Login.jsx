import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const user = await login(email, senha)
      if (user.role === 'GERENTE') navigate('/admin/produtos')
      else navigate('/cardapio')
    } catch {
      setErro('E-mail ou senha inválidos.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-nordeste-creme">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-nordeste-marrom mb-6 text-center">🌵 Entrar</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" placeholder="E-mail" value={email}
            onChange={e => setEmail(e.target.value)} required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nordeste-laranja" />
          <input type="password" placeholder="Senha" value={senha}
            onChange={e => setSenha(e.target.value)} required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nordeste-laranja" />
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <button type="submit" disabled={carregando}
            className="bg-nordeste-laranja text-white py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50">
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Não tem conta?{' '}
          <a href="/cadastro" className="text-nordeste-laranja font-medium hover:underline">Cadastre-se</a>
        </p>
      </div>
    </div>
  )
}
