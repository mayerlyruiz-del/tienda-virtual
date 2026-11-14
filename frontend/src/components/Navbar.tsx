import { NavLink } from 'react-router-dom';
import { useCart } from '../context/useCart';

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="navbar">
      <span className="navbar-logo">🛒 Tienda virtual</span>
      <div className="navbar-links">
        <NavLink to="/">Catálogo</NavLink>
        <NavLink to="/carrito">Carrito ({totalItems})</NavLink>
        <NavLink to="/pedidos">Mis pedidos</NavLink>
        <NavLink to="/admin/pedidos">Administración</NavLink>
        <NavLink to="/login">Iniciar sesión</NavLink>
      </div>
    </nav>
  );
}