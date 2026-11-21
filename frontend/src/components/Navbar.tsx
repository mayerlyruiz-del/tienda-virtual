import { NavLink } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <span className="navbar-logo">🛒 Tienda virtual</span>
      <div className="navbar-links">
        <NavLink to="/">Catálogo</NavLink>
        <NavLink to="/carrito">Carrito ({totalItems})</NavLink>
        {user && <NavLink to="/pedidos">Mis pedidos</NavLink>}
        {user?.role === 'admin' && <NavLink to="/admin/pedidos">Administración</NavLink>}
        {user?.role === 'admin' && <NavLink to="/admin/productos">Productos</NavLink>}
        {user ? (
          <>
            <span className="navbar-user">{user.name}</span>
            <button className="navbar-salir" onClick={logout}>Salir</button>
          </>
        ) : (
          <NavLink to="/login">Iniciar sesión</NavLink>
        )}
      </div>
    </nav>
  );
}