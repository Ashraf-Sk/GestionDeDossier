import api from './api';
import { API_CONFIG } from '../config/api';
import {
  AdminDemande,
  AdminDetailsDemande,
  UpdateDemandeRequest,
  DemandeReponse,
  PageResponse,
} from '../types';

export const demandeService = {
  // Public - Suivi d'une demande
  async trackDemande(idDemande: string, cinDemandeur: string): Promise<DemandeReponse> {
    const response = await api.get<DemandeReponse>(
      API_CONFIG.ENDPOINTS.TRACK_DEMANDE,
      {
        params: { idDemande, cinDemandeur },
      }
    );
    return response.data;
  },

  // Admin - Liste des demandes avec pagination et filtres
  async getDemandes(
    page: number = 0,
    size: number = 10,
    status?: string,
    type?: string,
    nomCommune?: string
  ): Promise<PageResponse<AdminDemande>> {
    const response = await api.get<PageResponse<AdminDemande>>(
      API_CONFIG.ENDPOINTS.ADMIN_DEMANDES,
      {
        params: { page, size, status, type, nomCommune },
      }
    );
    return response.data;
  },

  // Admin - Détails d'une demande
  async getDemandeDetails(id: string): Promise<AdminDetailsDemande> {
    const response = await api.get<AdminDetailsDemande>(
      `${API_CONFIG.ENDPOINTS.ADMIN_DETAILS}/${id}`
    );
    return response.data;
  },

  // Admin - Mettre à jour le statut d'une demande
  async updateDemandeStatus(
    id: string,
    update: UpdateDemandeRequest
  ): Promise<AdminDetailsDemande> {
    const response = await api.patch<AdminDetailsDemande>(
      `${API_CONFIG.ENDPOINTS.ADMIN_UPDATE_STATUS}/${id}/status`,
      update
    );
    return response.data;
  },

  // Télécharger un document
  async downloadDocument(
    documentId: string,
    cin: string,
    demandeId: string
  ): Promise<Blob> {
    const response = await api.get<Blob>(
      `${API_CONFIG.ENDPOINTS.DOWNLOAD_DOCUMENT}/${documentId}`,
      {
        params: { cin, demandeId },
        responseType: 'blob',
      }
    );
    return response.data;
  },
};
