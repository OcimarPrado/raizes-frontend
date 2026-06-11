import { useState, useEffect } from 'react'
import api from '../services/api'

const STATUS_COR = {
  AGUARDANDO_PAGAMENTO: '#f39c12',
  CONFIRMADO: '#2980b9',
  PREPARANDO: '#8e44ad',
  PRONTO: '#27ae60',
  ENTREGUE: '#2ecc71',
  CANCELADO: '#e74c3c',
}

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [fidelidade, setFidelidade] = useState(null)

  useEffect(() => {
    api.get('/pedidos/').then(r => setPedidos(r.data))
    api.get('/fidelidade/me').then(r => setFidelidade(r.data)).catch(() => {})
  }, [])

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Meus Pedidos</h2>

      {fidelidade && (
        <div style={styles.fidelidade}>
          🎟️ Cupons disponíveis: <strong>{fidelidade.cupons_disponiveis}</strong>
          <span style={styles.dica}> (ganhe 1 a cada 10 pedidos entregues)</span>
        </div>
      )}

      {pedidos.length === 0 && <p style={styles.vazio}>Nenhum pedido encontrado.</p>}

      {pedidos.map(p => (
        <div key={p.id} style={styles.card}>
          <div style={styles.header}>
            <span style={styles.pedidoId}>Pedido #{p.id}</span>
            <span style={{ ...styles.badge, background: STATUS_COR[p.status] || '#999' }}>{p.status}</span>
          </div>
          <p style={styles.info}>Canal: {p.canal_pedido} | Unidade: {p.unidade_id}</p>
          <p style={styles.info}>Data: {new Date(p.created_at).toLocaleString('pt-BR')}</p>
          <div style={styles.itens}>
            {p.itens.map(i => (
              <span key={i.id} style={styles.item}>
                {i.quantidade}x Produto #{i.produto_id} — R$ {parseFloat(i.preco_unitario).toFixed(2)}
              </span>
            ))}
          </div>
          <p style={styles.total}>Total: <strong>R$ {parseFloat(p.total).toFixed(2)}</strong></p>
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: { maxWidth: 700, margin: '0 auto', padding: '1rem' },
  title: { color: '#c0392b' },
  fidelidade: { background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 8, padding: '10px 16px', marginBottom: 16 },
  dica: { color: '#999', fontSize: 12 },
  vazio: { color: '#999', textAlign: 'center', marginTop: 40 },
  card: { background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: 12, boxShadow: '0 2px 6px #0001' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  pedidoId: { fontWeight: 700, fontSize: 16 },
  badge: { color: '#fff', borderRadius: 12, padding: '3px 10px', fontSize: 12, fontWeight: 600 },
  info: { color: '#666', fontSize: 13, margin: '2px 0' },
  itens: { display: 'flex', flexWrap: 'wrap', gap: 6, margin: '8px 0' },
  item: { background: '#f5f5f5', borderRadius: 6, padding: '3px 8px', fontSize: 12 },
  total: { textAlign: 'right', fontSize: 15 },
}
