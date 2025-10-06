"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { AuthService, AuthUser, LoginData, RegisterData } from '@/shared/services/AuthService';

interface AuthContextType {
  // Estado del usuario
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;

  // Métodos de autenticación
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;

  // Estados de UI
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((firebaseUser: User | null) => {
      if (firebaseUser) {
        // Usuario autenticado
        setUser(AuthService.formatUser(firebaseUser));
      } else {
        // Usuario no autenticado
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Método para limpiar errores
  const clearAuthError = () => {
    setAuthError(null);
  };

  // Método de login
  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      setAuthError(null);
      const authUser = await AuthService.login(data);
      setUser(authUser);
      console.log('✅ Usuario logueado exitosamente:', authUser.email);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de autenticación';
      console.error('❌ Error en login:', errorMessage);
      setAuthError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Método de registro
  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setAuthError(null);
      const authUser = await AuthService.register(data);
      setUser(authUser);
      console.log('✅ Usuario registrado exitosamente:', authUser.email);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de registro';
      console.error('❌ Error en registro:', errorMessage);
      setAuthError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Método de login con Google
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      const authUser = await AuthService.loginWithGoogle();
      setUser(authUser);
      console.log('✅ Usuario logueado con Google:', authUser.email);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error con login de Google';
      console.error('❌ Error en login con Google:', errorMessage);
      setAuthError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Método de login con Facebook
  const loginWithFacebook = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      const authUser = await AuthService.loginWithFacebook();
      setUser(authUser);
      console.log('✅ Usuario logueado con Facebook:', authUser.email);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error con login de Facebook';
      console.error('❌ Error en login con Facebook:', errorMessage);
      setAuthError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Método de logout
  const logout = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      await AuthService.logout();
      setUser(null);
      console.log('✅ Usuario deslogueado exitosamente');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cerrar sesión';
      console.error('❌ Error en logout:', errorMessage);
      setAuthError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Método para restablecer contraseña
  const resetPassword = async (email: string) => {
    try {
      setAuthError(null);
      await AuthService.resetPassword(email);
      console.log('✅ Email de restablecimiento enviado a:', email);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar email de restablecimiento';
      console.error('❌ Error al enviar email de reset:', errorMessage);
      setAuthError(errorMessage);
      throw error;
    }
  };

  const value: AuthContextType = {
    // Estado del usuario
    user,
    loading,
    isAuthenticated: !!user,

    // Métodos de autenticación
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    resetPassword,

    // Estados de UI
    authError,
    clearAuthError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

// Hook para verificar si el usuario está autenticado
export function useRequireAuth(): AuthUser {
  const { user, loading } = useAuth();
  
  if (loading) {
    throw new Error('Loading authentication state...');
  }
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}