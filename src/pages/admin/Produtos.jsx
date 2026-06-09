import { useEffect, useState } from 'react'
import api from '../../services/api'

const CATEGORIAS = ['PRATOS_PRINCIPAIS','FRITOS','COZIDOS','PETISCOS','FRUTOS_DO_MAR','BEBIDAS','SOBREMESAS','LANCHES']
const vazio = { nome: '', descricao: '', preco: '', categoria: 'PRATOS_PRINCIPAIS', imagem_url: '', ativo: true }

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState([])
  const [form, setForm] = useState(vazio)
  const [editandoId, setEditandoId] = useState(null)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    const res = await api.get('/produtos/')
    setProdutos(res.data)
  }

  function handleChange(e) {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: val })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(''); setSucesso('')
    try {
      if (editandoId) { await api.put(`/produtos/${editandoId}`, form); setSucesso('Produto atualizado.') }
      else { await api.post('/produtos/', form); setSucesso('Produto cadastrado.') }
      setForm(vazio); setEditandoId(null); carregar()
    } catch (err) { setErro(err.response?.data?.detail || 'Erro ao salvar.') }
  }

  function editar(p) {
    setForm({ nome: p.nome, descricao: p.descricao || '', preco: p.preco, categoria: p.categoria, imagem_url: p.imagem_url || '', ativo: p.ativo })
    setEditandoId(p.id); setSucesso(''); setErro('')
  }

  async function deletar(id) {
    if (!confirm('Excluir produto?')) return
    await api.delete(`/produtos/${id}`); carregar()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-nordeste-marrom mb-6">Gerenciar Produtos</h1>
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="font-semibold text-nordeste-marrom mb-4">{editandoId ? 'Editar Produto' : 'Novo Produto'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nordeste-laranja" />
          <select name="categoria" value={form.categoria} onChange={handleChange} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nordeste-laranja">
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input name="preco" type="number" step="0.01" placeholder="Preço" value={form.preco} onChange={handleChange} required className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nordeste-laranja" />
          <input name="imagem_url" placeholder="URL da imagem (opcional)" value={form.imagem_url} onChange={handleChange} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nordeste-laranja" />
          <textarea name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} rows={2} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nordeste-laranja sm:col-span-2" />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" name="ativo" checked={form.ativo} onChange={handleChange} /> Produto ativo
          </label>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" className="bg-nordeste-laranja text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition">
              {editandoId ? 'Salvar alterações' : 'Cadastrar'}
            </button>
            {editandoId && <button type="button" onClick={() => { setForm(vazio); setEditandoId(null) }} className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition">Cancelar</button>}
          </div>
          {erro && <p className="text-red-500 text-sm sm:col-span-2">{erro}</p>}
          {sucesso && <p className="text-green-600 text-sm sm:col-span-2">{sucesso}</p>}
        </form>
      </div>
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-nordeste-marrom text-white">
            <tr>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Categoria</th>
              <th className="px-4 py-3 text-left">Preço</th>
              <th className="px-4 py-3 text-left">Ativo</th>
              <th className="px-4 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(p => (
              <tr key={p.id} className="border-t hover:bg-nordeste-creme transition">
                <td className="px-4 py-3 font-medium">{p.nome}</td>
                <td className="px-4 py-3 text-gray-500">{p.categoria}</td>
                <td className="px-4 py-3 text-nordeste-laranja font-bold">R$ {Number(p.preco).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.ativo ? 'Sim' : 'Não'}</span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => editar(p)} className="text-blue-600 hover:underline text-xs">Editar</button>
                  <button onClick={() => deletar(p.id)} className="text-red-500 hover:underline text-xs">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
