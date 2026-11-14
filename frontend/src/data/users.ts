import type { User } from '../types';

// Cuentas de prueba (no son personas reales).
// En la Entrega 1 el inicio de sesión será simulado solo con el correo.
export const users: User[] = [
  { id: 1, name: 'Administrador Tienda', email: 'admin@tienda.test', role: 'admin' },
  { id: 2, name: 'Cliente Uno', email: 'cliente1@tienda.test', role: 'cliente' },
  { id: 3, name: 'Cliente Dos', email: 'cliente2@tienda.test', role: 'cliente' },
];