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

  // Télécharger un document (USER)
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

  // Télécharger un document (ADMIN)
  async downloadDocumentAsAdmin(documentId: string): Promise<Blob> {
    console.log('[demandeService] Téléchargement document admin, documentId:', documentId);
    
    // S'assurer que le documentId n'est pas déjà encodé
    let cleanDocumentId = documentId;
    try {
      // Si le documentId contient des caractères encodés, le décoder d'abord
      if (documentId.includes('%')) {
        // Essayer de décoder pour éviter le double encodage
        cleanDocumentId = decodeURIComponent(documentId);
        console.log('[demandeService] DocumentId décodé:', cleanDocumentId);
      }
    } catch (e) {
      // Si le décodage échoue, utiliser l'original tel quel
      cleanDocumentId = documentId;
      console.warn('[demandeService] Impossible de décoder documentId, utilisation de l\'original');
    }
    
    // Encoder une seule fois pour les caractères spéciaux dans l'URL
    const encodedDocumentId = encodeURIComponent(cleanDocumentId);
    const url = `${API_CONFIG.ENDPOINTS.ADMIN_DOWNLOAD_DOCUMENT}/${encodedDocumentId}`;
    console.log('[demandeService] URL complète:', url);
    
    try {
      const response = await api.get<Blob>(url, {
        responseType: 'blob',
      });
      console.log('[demandeService] Document téléchargé avec succès, taille:', response.data.size);
      return response.data;
    } catch (error: any) {
      console.error('[demandeService] Erreur lors du téléchargement:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: url,
      });
      throw error;
    }
  },
};
