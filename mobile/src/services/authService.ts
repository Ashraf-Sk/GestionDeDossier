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
  timeout: 60000, // Augmenté à 60 secondes pour les opérations lourdes (upload, inscription)
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
    console.log('[AuthService] URL complète:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`);
    const startTime = Date.now();
    try {
      const response = await apiClient.post<string>(
        API_CONFIG.ENDPOINTS.REGISTER,
        userData,
        {
          timeout: 60000, // Timeout spécifique pour l'inscription
        }
      );
      const duration = Date.now() - startTime;
      console.log(`[AuthService] Inscription réussie pour: ${userData.email} (${duration}ms)`);
      return response.data;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      // Gestion spécifique des erreurs réseau
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.error('[AuthService] Erreur réseau lors de l\'inscription:', {
          email: userData.email,
          duration: `${duration}ms`,
          code: error.code,
          message: error.message,
          baseURL: API_CONFIG.BASE_URL,
          suggestion: 'Vérifiez que le backend est démarré et accessible depuis votre appareil',
        });
        throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion réseau et que le backend est démarré sur ' + API_CONFIG.BASE_URL);
      }
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.error('[AuthService] Timeout lors de l\'inscription:', {
          email: userData.email,
          duration: `${duration}ms`,
          timeout: '60s dépassé',
          message: 'Le serveur met trop de temps à répondre. Vérifiez la connexion réseau et que le backend est accessible.',
        });
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        console.error('[AuthService] Impossible de se connecter au backend:', {
          email: userData.email,
          baseURL: API_CONFIG.BASE_URL,
          message: 'Le backend n\'est pas accessible à cette adresse. Vérifiez que le serveur est démarré et que l\'URL est correcte.',
        });
      } else {
        console.error('[AuthService] Erreur lors de l\'inscription:', {
          email: userData.email,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          code: error.code,
          duration: `${duration}ms`,
        });
      }
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
