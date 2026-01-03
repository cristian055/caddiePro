import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'caddie' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  loginTime: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'caddiePro_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = (name: string, role: UserRole) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      role,
      loginTime: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
