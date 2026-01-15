import api from './api';
import { API_CONFIG } from '../config/api';
import { StatsResponse, ClusterResponse } from '../types';

export const statsService = {
  // Obtenir les statistiques (nécessite ADMIN)
  async getStats(): Promise<StatsResponse> {
    const response = await api.get<StatsResponse>(API_CONFIG.ENDPOINTS.STATS);
    return response.data;
  },

  // Obtenir les clusters pour la carte (public)
  async getCluster(): Promise<ClusterResponse> {
    const response = await api.get<ClusterResponse>(API_CONFIG.ENDPOINTS.CLUSTER);
    return response.data;
  },
};
