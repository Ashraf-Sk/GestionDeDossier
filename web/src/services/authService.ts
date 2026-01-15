import api from './api';
import { API_CONFIG } from '../config/api';
import { LoginCredentials, JwtResponse } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<JwtResponse> {
    const response = await api.post<JwtResponse>(
      API_CONFIG.ENDPOINTS.LOGIN,
      credentials
    );
    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('admin_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('admin_token');
  },

  getToken(): string | null {
    return localStorage.getItem('admin_token');
  },
};
