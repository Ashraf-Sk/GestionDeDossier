// Service de démo avec données mockées pour tester sans backend

import { DemandeResponse, DocumentResponse } from './demandeService';

// Compte de démo
export const DEMO_ACCOUNT = {
  email: 'demo@gestion-dossier.ma',
  password: 'demo123',
  nom: 'Dupont',
  prenom: 'Jean',
  cin: 'AB123456',
};

// Token de démo
const DEMO_TOKEN = 'demo-jwt-token-1234567890-abcdefghijklmnopqrstuvwxyz';

// Données de démo - Demandes (avec les 6 vrais types du cahier des charges)
const mockDemandes: DemandeResponse[] = [
  {
    status: 'ACCEPTEE',
    idDemande: 'DEM-2025-001',
    date: '2025-01-10T14:30:00',
    documents: [
      { id: 'doc-001', nomFichier: 'CIN.pdf'},
      { id: 'doc-002', nomFichier: 'Titre_Foncier.pdf'},
      { id: 'doc-003', nomFichier: 'Plans_Architecturaux.pdf'},
    ],
    motifRejet: null,
    nomDemandeur: 'Dupont',
    prenomDemandeur: 'Jean',
    commune: 'Casablanca',
    latitude: 33.5731,
    longitude: -7.5898,
    cin: 'AB123456',
    typeAutorisation: 'Permis de construire',
  },
  {
    status: 'EN_COURS',
    idDemande: 'DEM-2025-002',
    date: '2025-01-05T09:15:00',
    documents: [
      { id: 'doc-004', nomFichier: 'CIN.pdf'},
      { id: 'doc-005', nomFichier: 'Plan_Cadastral.pdf'},
      { id: 'doc-006', nomFichier: 'Etude_Geotechnique.pdf'},
    ],
    motifRejet: null,
    nomDemandeur: 'Dupont',
    prenomDemandeur: 'Jean',
    commune: 'Fès',
    latitude: 34.0331,
    longitude: -5.0033,
    cin: 'AB123456',
    typeAutorisation: 'Lotissement / Morcellement',
  },
  {
    status: 'AVIS_FAVORABLE',
    idDemande: 'DEM-2024-098',
    date: '2024-12-20T11:45:00',
    documents: [
      { id: 'doc-007', nomFichier: 'Permis_Construire.pdf'},
      { id: 'doc-008', nomFichier: 'Plan_Final.pdf'},
      { id: 'doc-009', nomFichier: 'Photos_Construction.pdf'},
    ],
    motifRejet: null,
    nomDemandeur: 'Dupont',
    prenomDemandeur: 'Jean',
    commune: 'Rabat',
    latitude: 34.0209,
    longitude: -6.8416,
    cin: 'AB123456',
    typeAutorisation: 'Certificat de conformité',
  },
  {
    status: 'REJETE',
    idDemande: 'DEM-2024-050',
    date: '2024-11-15T10:00:00',
    documents: [
      { id: 'doc-010', nomFichier: 'CIN.pdf'},
      { id: 'doc-011', nomFichier: 'Justification.pdf'},
    ],
    motifRejet: 'La dérogation demandée ne respecte pas les normes environnementales applicables à cette zone.',
    nomDemandeur: 'Dupont',
    prenomDemandeur: 'Jean',
    commune: 'Marrakech',
    latitude: 31.6295,
    longitude: -8.0161,
    cin: 'AB123456',
    typeAutorisation: 'Demande de dérogation urbanistique',
  },
  {
    status: 'EN_ATTENTE',
    idDemande: 'DEM-2024-089',
    date: '2024-11-28T15:20:00',
    documents: [
      { id: 'doc-012', nomFichier: 'CIN.pdf'},
      { id: 'doc-013', nomFichier: 'Titre_Foncier.pdf'},
      { id: 'doc-014', nomFichier: 'Plan_Situation.pdf'},
    ],
    motifRejet: null,
    nomDemandeur: 'Dupont',
    prenomDemandeur: 'Jean',
    commune: 'Tanger',
    latitude: 35.7595,
    longitude: -5.8116,
    cin: 'AB123456',
    typeAutorisation: 'Note de renseignements urbanistiques (NRU)',
  },
  {
    status: 'AVIS_DEFAVORABLE',
    idDemande: 'DEM-2024-075',
    date: '2024-10-30T13:45:00',
    documents: [
      { id: 'doc-015', nomFichier: 'CIN.pdf'},
      { id: 'doc-016', nomFichier: 'Plan_Parcelle.pdf'},
      { id: 'doc-017', nomFichier: 'Photos_Demolition.pdf'},
    ],
    motifRejet: 'La structure ne peut pas être démolie car elle est classée au patrimoine historique.',
    nomDemandeur: 'Dupont',
    prenomDemandeur: 'Jean',
    commune: 'Meknès',
    latitude: 33.8869,
    longitude: -5.5492,
    cin: 'AB123456',
    typeAutorisation: 'Demande de démolition',
  },
];

// Service mock
export const mockService = {
  // Authentification
  login: async (credentials: { email: string; password: string }) => {
    // Vérifier les credentials de démo
    if (credentials.email === DEMO_ACCOUNT.email && credentials.password === DEMO_ACCOUNT.password) {
      return { token: DEMO_TOKEN };
    }
    throw new Error('Email ou mot de passe incorrect');
  },

  register: async (userData: any) => {
    return `Utilisateur ${userData.nom} créé avec succès (mode démo)`;
  },

  isAuthenticated: async () => {
    return false; // À implémenter si nécessaire
  },

  logout: async () => {
    return;
  },

  // Gestion des demandes
  createDemande: async (
    typeAutorisation: string,
    cinDemandeur: string,
    latitude: number,
    longitude: number,
    files?: any[]
  ): Promise<DemandeResponse> => {
    const newDemande: DemandeResponse = {
      status: 'EN_COURS',
      idDemande: `DEM-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      date: new Date().toISOString(),
      documents: files
        ? files.map((f, i) => ({
            id: `doc-${Date.now()}-${i}`,
            nomFichier: f.name || `document_${i}.pdf`,
            path: `/uploads/${f.name || `document_${i}.pdf`}`,
          }))
        : [],
      motifRejet: null,
      nomDemandeur: DEMO_ACCOUNT.nom,
      prenomDemandeur: DEMO_ACCOUNT.prenom,
      commune: 'Casablanca',
      latitude,
      longitude,
      cin: cinDemandeur,
      typeAutorisation,
    };
    return newDemande;
  },

  trackDemande: async (idDemande: string, cinDemandeur: string): Promise<DemandeResponse> => {
    const demande = mockDemandes.find((d) => d.idDemande === idDemande);
    if (!demande) {
      throw new Error('Demande introuvable');
    }
    if (demande.cin !== cinDemandeur) {
      throw new Error('CIN ne correspond pas');
    }
    return demande;
  },

  downloadDocument: async (
    documentId: string,
    cin: string,
    demandeId: string
  ): Promise<ArrayBuffer> => {
    // Simuler un téléchargement
    const content = `Ceci est un document de démo pour ${demandeId}`;
    const buffer = new ArrayBuffer(content.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < content.length; i++) {
      view[i] = content.charCodeAt(i);
    }
    return buffer;
  },

  contact: async (contactData: any): Promise<string> => {
    return `Message "${contactData.sujet}" envoyé avec succès (mode démo)`;
  },

  // Méthode supplémentaire pour récupérer toutes les demandes du compte de démo
  getAllDemandes: async (): Promise<DemandeResponse[]> => {
    return mockDemandes;
  },
};

export default mockService;

