import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/constants';

// Interface pour la réponse JWT
export interface JwtResponse {
  token: string;
}

// Interface pour les requêtes de connexion
export interface LoginRequest {
  email: string;
  password: string;
}

// Interface pour les requêtes d'inscription
// ⚠️ BACKEND ONLY SUPPORTS: email, password
// TODO: Backend needs to be updated to accept: nom, prenom, cin
export interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  cin: string;
}

// Création de l'instance Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Intercepteur pour ajouter le token JWT
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as any;
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url} - Token présent`);
    } else {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url} - Sans token`);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error.message);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  async (error: AxiosError) => {
    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} - Status: ${error.response?.status}`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      console.warn('[API] Token expiré ou invalide - Suppression du token');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userInfo');
    }
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  login: async (credentials: LoginRequest): Promise<JwtResponse> => {
    console.log('[AuthService] Tentative de connexion pour:', credentials.email);
    try {
      const response = await apiClient.post<JwtResponse>(
        API_CONFIG.ENDPOINTS.LOGIN,
        credentials
      );
      
      console.log('[AuthService] Connexion réussie pour:', credentials.email);
      
      if (response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        console.log('[AuthService] Token sauvegardé dans AsyncStorage');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('[AuthService] Erreur lors de la connexion:', {
        email: credentials.email,
        status: error.response?.status,
        message: error.response?.data || error.message,
      });
      throw error;
    }
  },

  register: async (userData: RegisterRequest): Promise<string> => {
    console.log('[AuthService] Tentative d\'inscription pour:', {
      email: userData.email,
      nom: userData.nom,
      prenom: userData.prenom,
    });
    try {
      const response = await apiClient.post<string>(
        API_CONFIG.ENDPOINTS.REGISTER,
        userData
      );
      console.log('[AuthService] Inscription réussie pour:', userData.email);
      return response.data;
    } catch (error: any) {
      console.error('[AuthService] Erreur lors de l\'inscription:', {
        email: userData.email,
        status: error.response?.status,
        message: error.response?.data || error.message,
      });
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userInfo');
  },

  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('authToken');
    return token !== null;
  },

  getToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem('authToken');
  },
};

export default apiClient;
