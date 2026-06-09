import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Cadastro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', email: '', cpf: '', telefone: '', senha: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await api.post('/usuarios/', form)
      navigate('/login')
    } catch (err) {
      setErro(err.response?.data?.detail || 'Erro ao cadastrar.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-nordeste-creme">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-nordeste-marrom mb-6 text-center">Cadastro</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { name: 'nome', placeholder: 'Nome completo', type: 'text' },
            { name: 'email', placeholder: 'E-mail', type: 'email' },
            { name: 'cpf', placeholder: 'CPF (só números)', type: 'text' },
            { name: 'telefone', placeholder: 'Telefone', type: 'text' },
            { name: 'senha', placeholder: 'Senha', type: 'password' },
          ].map(field => (
            <input key={field.name} name={field.name} type={field.type}
              placeholder={field.placeholder} value={form[field.name]}
              onChange={handleChange} required={field.name !== 'telefone'}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nordeste-laranja" />
          ))}
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <button type="submit" disabled={carregando}
            className="bg-nordeste-laranja text-white py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50">
            {carregando ? 'Cadastrando...' : 'Criar conta'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Já tem conta?{' '}
          <a href="/login" className="text-nordeste-laranja font-medium hover:underline">Entrar</a>
        </p>
      </div>
    </div>
  )
}
