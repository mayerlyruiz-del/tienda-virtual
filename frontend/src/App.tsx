import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import LoginPage from './pages/LoginPage';
import AdminProductsPage from './pages/AdminProductsPage';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="contenedor">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pedidos"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pedidos"
            element={
              <ProtectedRoute role="admin">
                <AdminOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/productos"
            element={
              <ProtectedRoute role="admin">
                <AdminProductsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </>
  );
}