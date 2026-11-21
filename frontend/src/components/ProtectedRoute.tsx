import type { ReactNode } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { Role } from '../types';

interface Props {
  children: ReactNode;
  role?: Role;
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user } = useAuth();

  // Si no ha iniciado sesión, lo mandamos al login
  if (!user) return <Navigate to="/login" replace />;

  // Si inició sesión pero su rol no sirve para esta pantalla
  if (role && user.role !== role) {
    return (
      <section>
        <p className="mensaje mensaje-error">
          No tienes permisos para ver esta pantalla.
        </p>
        <p className="mensaje">
          <Link className="btn" to="/">Volver al catálogo</Link>
        </p>
      </section>
    );
  }

  return <>{children}</>;
}