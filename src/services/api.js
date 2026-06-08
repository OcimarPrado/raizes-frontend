
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

// injeta o token JWT em toda requisição autenticada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api