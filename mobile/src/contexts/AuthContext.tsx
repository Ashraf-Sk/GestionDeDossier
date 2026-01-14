import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { mockService } from '../services/mockService';
import { USE_MOCK_DATA } from '../config/demoMode';

// Choisir le service selon le mode démo
const authServiceToUse = USE_MOCK_DATA ? mockService : authService;

interface AuthContextType {
  isAuthenticated: boolean;
  userInfo: any;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    console.log('[AuthContext] Vérification du statut d\'authentification');
    try {
      const authenticated = await authServiceToUse.isAuthenticated ? 
        await authServiceToUse.isAuthenticated() : 
        false;
      console.log('[AuthContext] Statut d\'authentification:', authenticated);
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error('[AuthContext] Erreur lors de la vérification du statut d\'authentification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('[AuthContext] Tentative de connexion pour:', email);
    try {
      const response = await authServiceToUse.login({ email, password });
      console.log('[AuthContext] Connexion réussie, mise à jour du contexte');
      setIsAuthenticated(true);
      setUserInfo({ email });
    } catch (error: any) {
      console.error('[AuthContext] Erreur lors de la connexion:', {
        email,
        status: error.response?.status,
        message: error.response?.data || error.message,
      });
      throw error;
    }
  };

  const register = async (userData: any) => {
    console.log('[AuthContext] Tentative d\'inscription pour:', userData.email);
    try {
      await authServiceToUse.register(userData);
      console.log('[AuthContext] Inscription réussie pour:', userData.email);
    } catch (error: any) {
      console.error('[AuthContext] Erreur lors de l\'inscription:', {
        email: userData.email,
        status: error.response?.status,
        message: error.response?.data || error.message,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (authServiceToUse.logout) {
        await authServiceToUse.logout();
      }
      setIsAuthenticated(false);
      setUserInfo(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userInfo,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
