import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { users } from '../data/users';

export default function LoginPage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = email.trim();

    if (!text) {
      setError('Escribe tu correo.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setError('El correo no tiene un formato válido.');
      return;
    }
    const problem = login(text);
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    navigate('/');
  }

  if (user) {
    return (
      <section>
        <h1>Iniciar sesión</h1>
        <p className="mensaje">
          Ya iniciaste sesión como <strong>{user.name}</strong> ({user.role}).
        </p>
        <p className="mensaje">
          <button className="btn btn-gris" onClick={logout}>Cerrar sesión</button>
        </p>
      </section>
    );
  }

  return (
    <section>
      <h1>Iniciar sesión</h1>

      <form className="formulario" onSubmit={handleSubmit} noValidate>
        <label>
          Correo electrónico
          <input
            type="email"
            placeholder="ejemplo@tienda.test"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
          />
        </label>
        {error && <p className="alerta alerta-error">{error}</p>}
        <button className="btn" type="submit">Entrar</button>
      </form>

      <div className="cuentas">
        <h3>Cuentas de prueba</h3>
        <p>Haz clic en una cuenta para llenar el correo. Por ahora el acceso es simulado y no pide contraseña.</p>
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              <button className="btn-mini" onClick={() => setEmail(u.email)}>
                Usar
              </button>{' '}
              {u.email} <span className="card-category">({u.role})</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

