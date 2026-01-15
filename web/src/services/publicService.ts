import api from './api';
import { API_CONFIG } from '../config/api';
import { PublicStatsResponse, PublicDemande, PageResponse } from '../types';

export const publicService = {
  // Statistiques publiques (sans authentification)
  async getPublicStats(): Promise<PublicStatsResponse> {
    const response = await api.get<PublicStatsResponse>(API_CONFIG.ENDPOINTS.STATS_PUBLIC);
    return response.data;
  },

  // Liste des demandes publiques (sans détails sensibles)
  async getPublicDemandes(
    page: number = 0,
    size: number = 10,
    status?: string,
    type?: string,
    nomCommune?: string
  ): Promise<PageResponse<PublicDemande>> {
    const response = await api.get<PageResponse<PublicDemande>>(
      API_CONFIG.ENDPOINTS.PUBLIC_DEMANDES,
      {
        params: { page, size, status, type, nomCommune },
      }
    );
    return response.data;
  },
};
