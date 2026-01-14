import apiClient from './authService';
import { API_CONFIG } from '../config/constants';
import { USE_MOCK_DATA } from '../config/demoMode';
import { mockService } from './mockService';

// Interface pour la réponse de document
// ⚠️ Doit correspondre exactement au DTO backend DocumentResponse
export interface DocumentResponse {
  id: string;
  nomFichier: string; // Backend utilise 'nomFichier' pas 'nomDocument'
  // path: string; // ❌ Non fourni par le backend
}

// Interface pour la réponse de demande
export interface DemandeResponse {
  status: string;
  idDemande: string;
  date: string;
  documents: DocumentResponse[];
  motifRejet: string | null;
  nomDemandeur: string;
  prenomDemandeur: string;
  commune: string;
  latitude: number;
  longitude: number;
  cin: string;
  typeAutorisation: string;
}

// Interface pour la requête de contact
// ⚠️ BACKEND ONLY SUPPORTS: message
// TODO: Backend needs to be updated to accept 'sujet' field
export interface ContactRequest {
  // sujet: string; // ❌ Non supporté par le backend actuel
  message: string;
  sujet: string;
}

// Service de gestion des demandes
export const demandeService = USE_MOCK_DATA ? mockService : {
  // Créer une demande avec fichiers
  createDemande: async (
    typeAutorisation: string,
    cinDemandeur: string,
    latitude: number,
    longitude: number,
    files?: any[]
  ): Promise<DemandeResponse> => {
    console.log('[DemandeService] Création de demande:', {
      typeAutorisation,
      cinDemandeur,
      latitude,
      longitude,
      nombreFichiers: files?.length || 0,
    });
    try {
      const formData = new FormData();
      formData.append('typeAutorisation', typeAutorisation);
      formData.append('cinDemandeur', cinDemandeur);
      formData.append('latitude', latitude.toString());
      formData.append('longitude', longitude.toString());

      if (files && files.length > 0) {
        files.forEach((file, index) => {
          formData.append('files', {
            uri: file.uri,
            type: file.type || 'application/pdf',
            name: file.name || `document_${index}.pdf`,
          } as any);
        });
      }

      const response = await apiClient.post<DemandeResponse>(
        API_CONFIG.ENDPOINTS.CREATE_DEMANDE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('[DemandeService] Demande créée avec succès:', response.data.idDemande);
      return response.data;
    } catch (error: any) {
      console.error('[DemandeService] Erreur lors de la création de demande:', {
        typeAutorisation,
        cinDemandeur,
        status: error.response?.status,
        message: error.response?.data || error.message,
      });
      throw error;
    }
  },

  // Suivre une demande
  trackDemande: async (
    idDemande: string,
    cinDemandeur: string
  ): Promise<DemandeResponse> => {
    console.log('[DemandeService] Suivi de demande:', { idDemande, cinDemandeur });
    try {
      const response = await apiClient.get<DemandeResponse>(
        API_CONFIG.ENDPOINTS.TRACK_DEMANDE,
        {
          params: {
            idDemande,
            cinDemandeur,
          },
        }
      );

      console.log('[DemandeService] Demande trouvée:', {
        idDemande: response.data.idDemande,
        status: response.data.status,
      });
      return response.data;
    } catch (error: any) {
      console.error('[DemandeService] Erreur lors du suivi de demande:', {
        idDemande,
        cinDemandeur,
        status: error.response?.status,
        message: error.response?.data || error.message,
      });
      throw error;
    }
  },

  // Télécharger un document
  downloadDocument: async (
    documentId: string,
    cin: string,
    demandeId: string
  ): Promise<ArrayBuffer> => {
    console.log('[DemandeService] Téléchargement de document:', { documentId, cin, demandeId });
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.DOWNLOAD_DOCUMENT}/${documentId}`,
        {
          params: {
            cin,
            demandeId,
          },
          // React Native Axios does not reliably support 'blob' without polyfills
          responseType: 'arraybuffer',
        }
      );

      console.log('[DemandeService] Document téléchargé avec succès:', documentId);
      return response.data;
    } catch (error: any) {
      console.error('[DemandeService] Erreur lors du téléchargement de document:', {
        documentId,
        cin,
        demandeId,
        status: error.response?.status,
        message: error.response?.data || error.message,
      });
      throw error;
    }
  },

  // Contacter l'organisme
  contact: async (contactData: ContactRequest): Promise<string> => {
    console.log('[DemandeService] Envoi de message de contact');
    try {
      const response = await apiClient.post<string>(
        API_CONFIG.ENDPOINTS.CONTACT,
        contactData
      );

      console.log('[DemandeService] Message de contact envoyé avec succès');
      return response.data;
    } catch (error: any) {
      console.error('[DemandeService] Erreur lors de l\'envoi du message de contact:', {
        status: error.response?.status,
        message: error.response?.data || error.message,
      });
      throw error;
    }
  },
};

export default demandeService;
