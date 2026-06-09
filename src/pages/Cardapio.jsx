import { useEffect, useState } from 'react'
import api from '../services/api'

const CATEGORIAS = ['TODAS','PRATOS_PRINCIPAIS','FRITOS','COZIDOS','PETISCOS','FRUTOS_DO_MAR','BEBIDAS','SOBREMESAS','LANCHES']
const LABEL = { TODAS:'🍽️ Todas', PRATOS_PRINCIPAIS:'🥘 Pratos Principais', FRITOS:'🍳 Fritos', COZIDOS:'♨️ Cozidos', PETISCOS:'🫙 Petiscos', FRUTOS_DO_MAR:'🦐 Frutos do Mar', BEBIDAS:'🥤 Bebidas', SOBREMESAS:'🍮 Sobremesas', LANCHES:'🫓 Lanches' }
const EMOJI = { PRATOS_PRINCIPAIS:'🥘', FRITOS:'🍳', COZIDOS:'♨️', PETISCOS:'🫙', FRUTOS_DO_MAR:'🦐', BEBIDAS:'🥤', SOBREMESAS:'🍮', LANCHES:'🫓' }

export default function Cardapio() {
  const [produtos, setProdutos] = useState([])
  const [filtro, setFiltro] = useState('TODAS')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api.get('/produtos/').then(res => setProdutos(res.data)).finally(() => setCarregando(false))
  }, [])

  const lista = filtro === 'TODAS' ? produtos.filter(p => p.ativo) : produtos.filter(p => p.ativo && p.categoria === filtro)

  return (
    <div className="min-h-screen bg-nordeste-creme">
      <div className="bg-nordeste-marrom text-white py-14 px-4 text-center">
        <h1 className="text-4xl font-extrabold text-nordeste-amarelo mb-3">Nosso Cardápio</h1>
        <p className="text-nordeste-creme text-lg opacity-90">Sabores autênticos do Nordeste brasileiro</p>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {CATEGORIAS.map(cat => (
            <button key={cat} onClick={() => setFiltro(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition border ${filtro === cat ? 'bg-nordeste-laranja text-white border-nordeste-laranja' : 'bg-white text-nordeste-marrom border-gray-200 hover:border-nordeste-laranja'}`}>
              {LABEL[cat]}
            </button>
          ))}
        </div>
        {carregando && <p className="text-center py-20 text-nordeste-marrom opacity-50">Carregando...</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {lista.map(produto => (
            <div key={produto.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
              <div className="h-44 w-full flex items-center justify-center text-6xl"
                style={{ background: 'linear-gradient(135deg, #FDF3E3 0%, #F5A623 100%)' }}>
                {EMOJI[produto.categoria] || '🍽️'}
              </div>
              <div className="p-4 flex flex-col gap-1 flex-1">
                <span className="text-xs font-bold text-nordeste-laranja uppercase">{produto.categoria}</span>
                <h3 className="font-bold text-nordeste-marrom text-lg">{produto.nome}</h3>
                {produto.descricao && <p className="text-gray-500 text-sm">{produto.descricao}</p>}
                <p className="text-nordeste-laranja font-extrabold text-2xl mt-auto pt-3">
                  R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
