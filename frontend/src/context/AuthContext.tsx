import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, role: UserRole) => Promise<void>;
  quickLogin: (role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('skillbridge_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const u = await authService.getMe();
          setUser(u);
        } catch (err) {
          console.error("Failed to load user profile:", err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email: string, pass: string) => {
    const res = await authService.login(email, pass);
    localStorage.setItem('skillbridge_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const register = async (name: string, email: string, pass: string, role: UserRole) => {
    const res = await authService.register(name, email, pass, role);
    localStorage.setItem('skillbridge_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const quickLogin = async (role: UserRole) => {
    let email = 'student@skillbridge.demo';
    let pass = 'Student@123';
    if (role === 'RECRUITER') {
      email = 'recruiter@skillbridge.demo';
      pass = 'Recruiter@123';
    } else if (role === 'INSTITUTION') {
      email = 'college@skillbridge.demo';
      pass = 'College@123';
    }
    await login(email, pass);
  };

  const logout = () => {
    localStorage.removeItem('skillbridge_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, quickLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
