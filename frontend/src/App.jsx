import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Layout from "./components/Layout"
import Notas from "./pages/Notas";
import NuevoUsuario from "./pages/NuevoUsuario";
import UsuariosLista from "./pages/UsuariosLista";
import NuevoArticulo from "./pages/NuevoArticulo";
import ArticulosLista from "./pages/ArticulosLista";
import CarritoPedidos from "./components/CarritoPedidos"
import VerPedidos from "./pages/VerPedidos";
import PedidosPasados from "./pages/PedidosPasados";

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <ProtectedRoute>
              <Layout>
                <Logout />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notas"
          element={
            <ProtectedRoute>
              <Layout>
                <Notas />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lista-usuarios"
           element={
            <ProtectedRoute>
                <Layout>
                  <UsuariosLista />
                </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/nuevo-usuario"
           element={
            <ProtectedRoute>
                <Layout>
                  <NuevoUsuario />
                </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/nuevo-usuario/:id"
           element={
            <ProtectedRoute>
                <Layout>
                  <NuevoUsuario />
                </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/articulos-lista"
          element={
            <ProtectedRoute>
              <Layout>
                <ArticulosLista />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/nuevo-articulo"
          element={
            <ProtectedRoute>
              <Layout>
                <NuevoArticulo />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/nuevo-articulo/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <NuevoArticulo />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/carrito"
          element={
            <ProtectedRoute>
              <Layout>
                <CarritoPedidos/>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ver-pedidos"
          element={
            <ProtectedRoute>
              <Layout>
                <VerPedidos />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/facturas"
          element={
            <ProtectedRoute>
              <Layout>
                <PedidosPasados />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
