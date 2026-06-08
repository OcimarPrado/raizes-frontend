import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import RotaProtegida from './components/RotaProtegida'

import Login         from './pages/Login'
import Cadastro      from './pages/Cadastro'
import Cardapio      from './pages/Cardapio'
import Perfil        from './pages/Perfil'
import AdminProdutos from './pages/admin/Produtos'

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/"               element={<Navigate to="/cardapio" />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/cadastro"       element={<Cadastro />} />
        <Route path="/cardapio"       element={<Cardapio />} />

        <Route path="/perfil" element={
          <RotaProtegida roles={['CLIENTE', 'GERENTE']}>
            <Perfil />
          </RotaProtegida>
        } />

        <Route path="/admin/produtos" element={
          <RotaProtegida roles={['GERENTE']}>
            <AdminProdutos />
          </RotaProtegida>
        } />
      </Routes>
    </AuthProvider>
  )
}