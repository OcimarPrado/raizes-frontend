import { useState, useEffect } from 'react'
import api from '../../services/api'

const STATUS_LIST = ['AGUARDANDO_PAGAMENTO','CONFIRMADO','PREPARANDO','PRONTO','ENTREGUE','CANCELADO']
const STATUS_COR = {
  AGUARDANDO_PAGAMENTO: '#f39c12', CONFIRMADO: '#2980b9', PREPARANDO: '#8e44ad',
  PRONTO: '#27ae60', ENTREGUE: '#2ecc71', CANCELADO: '#e74c3c',
}

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [filtro, setFiltro] = useState('')
  const [msg, setMsg] = useState('')

  function carregar() {
    const params = filtro ? `?status=${filtro}` : ''
    api.get(`/pedidos/${params}`).then(r => setPedidos(r.data))
  }

  useEffect(() => { carregar() }, [filtro])

  async function atualizar(pedido_id, status) {
    try {
      await api.patch(`/pedidos/${pedido_id}/status`, { status })
      setMsg(`Pedido #${pedido_id} → ${status}`)
      carregar()
    } catch(e) {
      setMsg(e.response?.data?.detail || 'Erro')
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gerenciar Pedidos</h2>

      <select style={styles.select} value={filtro} onChange={e => setFiltro(e.target.value)}>
        <option value="">Todos os status</option>
        {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      {msg && <p style={styles.msg}>{msg}</p>}

      {pedidos.length === 0 && <p style={styles.vazio}>Nenhum pedido.</p>}

      {pedidos.map(p => (
        <div key={p.id} style={styles.card}>
          <div style={styles.header}>
            <span style={styles.pedidoId}>Pedido #{p.id} — Cliente #{p.usuario_id}</span>
            <span style={{ ...styles.badge, background: STATUS_COR[p.status] || '#999' }}>{p.status}</span>
          </div>
          <p style={styles.info}>Canal: {p.canal_pedido} | Unidade: {p.unidade_id} | Total: R$ {parseFloat(p.total).toFixed(2)}</p>
          <p style={styles.info}>{new Date(p.created_at).toLocaleString('pt-BR')}</p>
          <div style={styles.acoes}>
            {STATUS_LIST.filter(s => s !== p.status).map(s => (
              <button key={s} style={{ ...styles.btnStatus, background: STATUS_COR[s] }}
                onClick={() => atualizar(p.id, s)}>{s}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: { maxWidth: 800, margin: '0 auto', padding: '1rem' },
  title: { color: '#c0392b' },
  select: { padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', marginBottom: 16 },
  msg: { background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 6, padding: '8px 12px', color: '#2e7d32' },
  vazio: { color: '#999', textAlign: 'center', marginTop: 40 },
  card: { background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: 12, boxShadow: '0 2px 6px #0001' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  pedidoId: { fontWeight: 700 },
  badge: { color: '#fff', borderRadius: 12, padding: '3px 10px', fontSize: 12, fontWeight: 600 },
  info: { color: '#666', fontSize: 13, margin: '2px 0' },
  acoes: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  btnStatus: { color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11 },
}
