import { useAuth } from '../context/AuthContext'

export default function Perfil() {
  const { usuario } = useAuth()
  if (!usuario) return null

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-nordeste-marrom mb-6">Meu Perfil</h1>
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        {[{ label: 'Nome', value: usuario.nome }, { label: 'E-mail', value: usuario.email }, { label: 'CPF', value: usuario.cpf }, { label: 'Telefone', value: usuario.telefone }]
          .filter(f => f.value).map(f => (
            <div key={f.label}>
              <p className="text-xs text-gray-400 uppercase">{f.label}</p>
              <p className="font-semibold text-nordeste-marrom">{f.value}</p>
            </div>
          ))}
        <div>
          <p className="text-xs text-gray-400 uppercase">Perfil</p>
          <span className="inline-block bg-nordeste-creme text-nordeste-marrom text-xs font-bold px-2 py-1 rounded-full">{usuario.role}</span>
        </div>
      </div>
    </div>
  )
}
