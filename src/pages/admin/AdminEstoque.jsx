import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function AdminEstoque() {
  const [unidades, setUnidades] = useState([])
  const [unidadeId, setUnidadeId] = useState('')
  const [estoque, setEstoque] = useState([])
  const [produtos, setProdutos] = useState({})

  useEffect(() => {
    api.get('/unidades/').then(r => setUnidades(r.data))
    api.get('/produtos/').then(r => {
      const map = {}
      r.data.forEach(p => map[p.id] = p.nome)
      setProdutos(map)
    })
  }, [])

  useEffect(() => {
    if (unidadeId) api.get(`/estoque/unidade/${unidadeId}`).then(r => setEstoque(r.data))
  }, [unidadeId])

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Estoque por Unidade</h2>

      <select style={styles.select} value={unidadeId} onChange={e => setUnidadeId(e.target.value)}>
        <option value="">Selecione a unidade</option>
        {unidades.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
      </select>

      {estoque.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Produto</th>
              <th style={styles.th}>Quantidade</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {estoque.map(e => (
              <tr key={e.produto_id}>
                <td style={styles.td}>{produtos[e.produto_id] || `#${e.produto_id}`}</td>
                <td style={styles.td}>{e.quantidade_disponivel}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background: e.quantidade_disponivel > 5 ? '#27ae60' : e.quantidade_disponivel > 0 ? '#f39c12' : '#e74c3c' }}>
                    {e.quantidade_disponivel > 5 ? 'OK' : e.quantidade_disponivel > 0 ? 'Baixo' : 'Esgotado'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {unidadeId && estoque.length === 0 && <p style={styles.vazio}>Nenhum item em estoque.</p>}
    </div>
  )
}

const styles = {
  container: { maxWidth: 700, margin: '0 auto', padding: '1rem' },
  title: { color: '#c0392b' },
  select: { padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', marginBottom: 16 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#f5f5f5', padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #eee' },
  td: { padding: '10px 12px', borderBottom: '1px solid #eee' },
  badge: { color: '#fff', borderRadius: 12, padding: '3px 10px', fontSize: 12, fontWeight: 600 },
  vazio: { color: '#999', textAlign: 'center', marginTop: 40 },
}
