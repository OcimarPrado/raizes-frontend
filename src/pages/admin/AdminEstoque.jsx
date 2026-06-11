import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function AdminEstoque() {
  const [unidades, setUnidades] = useState([])
  const [unidadeId, setUnidadeId] = useState('')
  const [estoque, setEstoque] = useState([])
  const [produtos, setProdutos] = useState({})
  const [mov, setMov] = useState({ produto_id: '', tipo: 'ENTRADA', quantidade: 1, observacao: '' })
  const [msg, setMsg] = useState('')
  const [erro, setErro] = useState('')

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

  async function movimentar() {
    setMsg(''); setErro('')
    if (!unidadeId || !mov.produto_id) return setErro('Selecione unidade e produto.')
    try {
      await api.post(`/estoque/unidade/${unidadeId}/produto/${mov.produto_id}`, {
        tipo: mov.tipo,
        quantidade: parseInt(mov.quantidade),
        observacao: mov.observacao || null,
      })
      setMsg(`${mov.tipo} de ${mov.quantidade} unidade(s) registrada com sucesso.`)
      api.get(`/estoque/unidade/${unidadeId}`).then(r => setEstoque(r.data))
      setMov({ produto_id: '', tipo: 'ENTRADA', quantidade: 1, observacao: '' })
    } catch(e) {
      setErro(e.response?.data?.detail || 'Erro ao movimentar estoque.')
    }
  }

  return (
    <div style={s.container}>
      <h2 style={s.title}>Estoque por Unidade</h2>

      <select style={s.select} value={unidadeId} onChange={e => setUnidadeId(e.target.value)}>
        <option value="">Selecione a unidade</option>
        {unidades.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
      </select>

      {unidadeId && <>
        <div style={s.card}>
          <h3 style={s.subtitle}>📦 Registrar Movimentação</h3>
          <select style={s.selectFull} value={mov.produto_id}
            onChange={e => setMov({...mov, produto_id: e.target.value})}>
            <option value="">Selecione o produto</option>
            {estoque.map(e => (
              <option key={e.produto_id} value={e.produto_id}>
                {produtos[e.produto_id] || `#${e.produto_id}`} (atual: {e.quantidade_disponivel})
              </option>
            ))}
          </select>
          <div style={s.row}>
            <select style={s.selectHalf} value={mov.tipo}
              onChange={e => setMov({...mov, tipo: e.target.value})}>
              <option value="ENTRADA">ENTRADA ↑</option>
              <option value="SAIDA">SAÍDA ↓</option>
            </select>
            <input style={s.inputHalf} type="number" min="1" value={mov.quantidade}
              onChange={e => setMov({...mov, quantidade: e.target.value})}
              placeholder="Quantidade" />
          </div>
          <input style={s.selectFull} value={mov.observacao}
            onChange={e => setMov({...mov, observacao: e.target.value})}
            placeholder="Observação (opcional)" />
          {msg && <p style={s.msg}>{msg}</p>}
          {erro && <p style={s.erro}>{erro}</p>}
          <button style={s.btn} onClick={movimentar}>Confirmar Movimentação</button>
        </div>

        {estoque.length > 0 && (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Produto</th>
                <th style={s.th}>Qtd</th>
                <th style={s.th}>Mín</th>
                <th style={s.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {estoque.map(e => (
                <tr key={e.produto_id}>
                  <td style={s.td}>{produtos[e.produto_id] || `#${e.produto_id}`}</td>
                  <td style={s.td}>{e.quantidade_disponivel}</td>
                  <td style={s.td}>{e.quantidade_minima}</td>
                  <td style={s.td}>
                    <span style={{...s.badge,
                      background: e.quantidade_disponivel > e.quantidade_minima ? '#27ae60'
                        : e.quantidade_disponivel > 0 ? '#f39c12' : '#e74c3c'}}>
                      {e.quantidade_disponivel > e.quantidade_minima ? 'OK'
                        : e.quantidade_disponivel > 0 ? 'Baixo' : 'Esgotado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>}
    </div>
  )
}

const s = {
  container: { maxWidth: 700, margin: '0 auto', padding: '1rem' },
  title: { color: '#c0392b' },
  subtitle: { color: '#555', marginBottom: '0.75rem', fontSize: 16 },
  select: { padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', marginBottom: 16, width: '100%', fontSize: 15 },
  selectFull: { padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', width: '100%', marginBottom: 10, fontSize: 15, boxSizing: 'border-box' },
  selectHalf: { padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', flex: 1, fontSize: 15 },
  inputHalf: { padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', flex: 1, fontSize: 15 },
  row: { display: 'flex', gap: 10, marginBottom: 10 },
  card: { background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: 16, boxShadow: '0 2px 6px #0001' },
  btn: { background: '#c0392b', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', marginTop: 4, width: '100%', fontSize: 15 },
  msg: { color: '#2e7d32', background: '#e8f5e9', borderRadius: 6, padding: '8px 12px', margin: '8px 0' },
  erro: { color: '#c62828', background: '#ffebee', borderRadius: 6, padding: '8px 12px', margin: '8px 0' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: 8 },
  th: { background: '#f5f5f5', padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #eee' },
  td: { padding: '10px 12px', borderBottom: '1px solid #eee' },
  badge: { color: '#fff', borderRadius: 12, padding: '4px 12px', fontSize: 12, fontWeight: 600 },
}
