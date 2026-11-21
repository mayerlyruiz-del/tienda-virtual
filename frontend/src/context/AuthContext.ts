import { createContext } from 'react';
import type { User } from '../types';

export interface AuthContextValue {
  user: User | null;
  // Devuelve un mensaje de error si falla, o null si salió bien
  login: (email: string) => string | null;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
