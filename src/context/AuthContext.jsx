import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/usuarios/me')
        .then(res => setUsuario(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setCarregando(false))
    } else {
      setCarregando(false)
    }
  }, [])

  async function login(email, senha) {
    const form = new URLSearchParams()
    form.append('username', email)
    form.append('password', senha)
    const res = await api.post('/auth/login', form)
    localStorage.setItem('token', res.data.access_token)
    const me = await api.get('/usuarios/me')
    setUsuario(me.data)
    return me.data
  }

  function logout() {
    localStorage.removeItem('token')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
