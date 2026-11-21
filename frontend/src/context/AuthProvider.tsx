import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { users } from '../data/users';
import type { User } from '../types';

const STORAGE_KEY = 'tienda-usuario';

// Lee el usuario guardado en el navegador (si existe)
function loadUser(): User | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as User) : null;
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  function login(email: string): string | null {
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) return 'No existe una cuenta con ese correo.';
    setUser(found);
    return null;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}