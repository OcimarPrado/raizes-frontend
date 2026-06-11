import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Carrinho() {
  const [produtos, setProdutos] = useState([])
  const [unidades, setUnidades] = useState([])
  const [itens, setItens] = useState([])
  const [unidadeId, setUnidadeId] = useState('')
  const [canal, setCanal] = useState('APP')
  const [pedidoCriado, setPedidoCriado] = useState(null)
  const [metodo, setMetodo] = useState('PIX')
  const [pagamento, setPagamento] = useState(null)
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/produtos/').then(r => setProdutos(r.data))
    api.get('/unidades/').then(r => setUnidades(r.data))
  }, [])

  function addItem(produto) {
    setItens(prev => {
      const ex = prev.find(i => i.produto_id === produto.id)
      if (ex) return prev.map(i => i.produto_id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i)
      return [...prev, { produto_id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 }]
    })
  }

  function removeItem(produto_id) {
    setItens(prev => prev.filter(i => i.produto_id !== produto_id))
  }

  const total = itens.reduce((s, i) => s + parseFloat(i.preco) * i.quantidade, 0)

  async function criarPedido() {
    setErro('')
    if (!unidadeId) return setErro('Selecione uma unidade.')
    if (itens.length === 0) return setErro('Adicione ao menos um item.')
    try {
      const r = await api.post('/pedidos/', {
        unidade_id: parseInt(unidadeId),
        canal_pedido: canal,
        itens: itens.map(i => ({ produto_id: i.produto_id, quantidade: i.quantidade }))
      })
      setPedidoCriado(r.data)
    } catch (e) {
      setErro(e.response?.data?.detail || 'Erro ao criar pedido.')
    }
  }

  async function pagar() {
    setErro('')
    try {
      const r = await api.post('/pagamentos/', { pedido_id: pedidoCriado.id, metodo })
      setPagamento(r.data)
    } catch (e) {
      setErro(e.response?.data?.detail || 'Erro ao processar pagamento.')
    }
  }

  if (pagamento) return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ fontSize: 48, textAlign: 'center' }}>
          {pagamento.status === 'APROVADO' ? '✅' : '❌'}
        </div>
        <h2 style={{ textAlign: 'center', color: pagamento.status === 'APROVADO' ? '#2e7d32' : '#c62828' }}>
          Pagamento {pagamento.status}
        </h2>
        {pagamento.status === 'APROVADO' && (
          <p style={styles.info}>Código: <strong>{pagamento.resposta_mock}</strong></p>
        )}
        {pagamento.status === 'RECUSADO' && (
          <p style={styles.info}>Motivo: <strong>{pagamento.resposta_mock}</strong></p>
        )}
        <p style={styles.info}>Valor: <strong>R$ {parseFloat(pagamento.valor).toFixed(2)}</strong></p>
        <button style={styles.btn} onClick={() => navigate('/meus-pedidos')}>Ver meus pedidos</button>
      </div>
    </div>
  )

  if (pedidoCriado) return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Pedido #{pedidoCriado.id} criado</h2>
        <p style={styles.info}>Total: <strong>R$ {parseFloat(pedidoCriado.total).toFixed(2)}</strong></p>
        <p style={styles.info}>Status: <strong>{pedidoCriado.status}</strong></p>
        <h3 style={styles.subtitle}>Forma de pagamento</h3>
        <select style={styles.select} value={metodo} onChange={e => setMetodo(e.target.value)}>
          <option value="PIX">PIX (sempre aprovado)</option>
          <option value="DINHEIRO">Dinheiro (sempre aprovado)</option>
          <option value="CARTAO_CREDITO">Cartão de Crédito</option>
          <option value="CARTAO_DEBITO">Cartão de Débito</option>
        </select>
        {erro && <p style={styles.erro}>{erro}</p>}
        <button style={styles.btn} onClick={pagar}>Confirmar pagamento</button>
      </div>
    </div>
  )

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Novo Pedido</h2>

      <div style={styles.row}>
        <select style={styles.select} value={unidadeId} onChange={e => setUnidadeId(e.target.value)}>
          <option value="">Selecione a unidade</option>
          {unidades.map(u => <option key={u.id} value={u.id}>{u.nome} — {u.cidade}</option>)}
        </select>
        <select style={styles.select} value={canal} onChange={e => setCanal(e.target.value)}>
          {['APP','WEB','TOTEM','BALCAO','PICKUP'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <h3 style={styles.subtitle}>Cardápio</h3>
      <div style={styles.grid}>
        {produtos.map(p => (
          <div key={p.id} style={styles.prodCard}>
            <span style={styles.categoria}>{p.categoria}</span>
            <p style={styles.prodNome}>{p.nome}</p>
            <p style={styles.prodPreco}>R$ {parseFloat(p.preco).toFixed(2)}</p>
            <button style={styles.btnAdd} onClick={() => addItem(p)}>+ Adicionar</button>
          </div>
        ))}
      </div>

      {itens.length > 0 && (
        <>
          <h3 style={styles.subtitle}>Itens selecionados</h3>
          {itens.map(i => (
            <div key={i.produto_id} style={styles.itemRow}>
              <span>{i.nome} x{i.quantidade}</span>
              <span>R$ {(parseFloat(i.preco) * i.quantidade).toFixed(2)}</span>
              <button style={styles.btnRem} onClick={() => removeItem(i.produto_id)}>✕</button>
            </div>
          ))}
          <p style={styles.total}>Total: <strong>R$ {total.toFixed(2)}</strong></p>
        </>
      )}

      {erro && <p style={styles.erro}>{erro}</p>}
      <button style={styles.btn} onClick={criarPedido}>Fazer Pedido</button>
    </div>
  )
}

const styles = {
  container: { maxWidth: 700, margin: '0 auto', padding: '1rem' },
  card: { background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 2px 8px #0001' },
  title: { color: '#c0392b', marginBottom: '1rem' },
  subtitle: { color: '#555', margin: '1rem 0 0.5rem' },
  row: { display: 'flex', gap: 12, marginBottom: '1rem', flexWrap: 'wrap' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 },
  prodCard: { background: '#fff8f0', borderRadius: 8, padding: '0.75rem', border: '1px solid #f0d9c0' },
  categoria: { fontSize: 10, color: '#e67e22', textTransform: 'uppercase', fontWeight: 700 },
  prodNome: { fontWeight: 600, margin: '4px 0' },
  prodPreco: { color: '#e67e22', fontWeight: 700 },
  btnAdd: { background: '#e67e22', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', width: '100%' },
  itemRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #eee' },
  btnRem: { background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' },
  total: { textAlign: 'right', fontSize: 18, margin: '0.5rem 0' },
  select: { padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', flex: 1, minWidth: 180 },
  btn: { background: '#c0392b', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', width: '100%', marginTop: 12, fontSize: 16 },
  info: { margin: '8px 0' },
  erro: { color: '#c0392b', margin: '8px 0' },
}
