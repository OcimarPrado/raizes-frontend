import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import RotaProtegida from './components/RotaProtegida'

import Login         from './pages/Login'
import Cadastro      from './pages/Cadastro'
import Cardapio      from './pages/Cardapio'
import Perfil        from './pages/Perfil'
import Carrinho      from './pages/Carrinho'
import MeusPedidos   from './pages/MeusPedidos'
import AdminProdutos from './pages/admin/Produtos'
import AdminPedidos  from './pages/admin/AdminPedidos'
import AdminEstoque  from './pages/admin/AdminEstoque'

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/"               element={<Navigate to="/cardapio" />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/cadastro"       element={<Cadastro />} />
        <Route path="/cardapio"       element={<Cardapio />} />

        <Route path="/carrinho" element={
          <RotaProtegida roles={['CLIENTE', 'GERENTE']}>
            <Carrinho />
          </RotaProtegida>
        } />

        <Route path="/meus-pedidos" element={
          <RotaProtegida roles={['CLIENTE', 'GERENTE']}>
            <MeusPedidos />
          </RotaProtegida>
        } />

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

        <Route path="/admin/pedidos" element={
          <RotaProtegida roles={['GERENTE']}>
            <AdminPedidos />
          </RotaProtegida>
        } />

        <Route path="/admin/estoque" element={
          <RotaProtegida roles={['GERENTE']}>
            <AdminEstoque />
          </RotaProtegida>
        } />
      </Routes>
    </AuthProvider>
  )
}
