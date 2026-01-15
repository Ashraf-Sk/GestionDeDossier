// Configuration de l'API Backend
export const API_CONFIG = {
  // Pour émulateur Android : utilisez 10.0.2.2 (adresse spéciale de l'émulateur)
  // BASE_URL: 'http://10.0.2.2:8000',
  
  // Pour iOS Simulator : utilisez localhost (fonctionne directement)
  // BASE_URL: 'http://localhost:8000',
  
  // Pour device physique (iPhone ou Android) : utilisez l'IP locale de votre PC
  // Votre IP actuelle détectée : 172.36.2.9
  BASE_URL: 'http://172.36.2.9:8000', // Device physique - iPhone/Android
  
  // IMPORTANT : Assurez-vous que votre iPhone et votre PC sont sur le même réseau WiFi !
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    CREATE_DEMANDE: '/demande/envoyerDemande',
    TRACK_DEMANDE: '/demande/track',
    DOWNLOAD_DOCUMENT: '/demande/telecharger',
    CONTACT: '/demande/contacter',
  }
};

// Types de demandes disponibles (Cahier des charges)
export const TYPES_DEMANDES = [
  'Permis de construire',
  'Lotissement / Morcellement',
  'Certificat de conformité',
  'Note de renseignements urbanistiques (NRU)',
  'Demande de démolition',
  'Demande de dérogation urbanistique',
];

// Documents nécessaires par type de demande
export const DOCUMENTS_REQUIS = {
  'Permis de construire': [
    'Plan cadastral',
    'Titre foncier',
    'Plans architecturaux',
  ],
  'Lotissement / Morcellement': [
    'Titre foncier',
    'Plans',
    'Étude géotechnique',
  ],
  'Certificat de conformité': [
    'Permis de construire',
    'Plan final de construction',
  ],
  'Note de renseignements urbanistiques (NRU)': [
    'Titre foncier',
    'Plan de situation',
  ],
  'Demande de démolition': [
    'Plan de la parcelle',
    'Permis (si existant)',
  ],
  'Demande de dérogation urbanistique': [
    'Dossier technique complet',
    'Justification du projet',
  ],
};

// Statuts des demandes
export const STATUS_DEMANDE = {
  ACCEPTEE: 'ACCEPTEE',
  REJETE: 'REJETE',
  EN_COURS: 'EN_COURS',
  AVIS_FAVORABLE: 'AVIS_FAVORABLE',
  AVIS_DEFAVORABLE: 'AVIS_DEFAVORABLE',
  EN_ATTENTE: 'EN_ATTENTE',
  INCOMPLETE: 'INCOMPLETE',
};

// Couleurs pour les statuts
export const STATUS_COLORS = {
  ACCEPTEE: '#4CAF50',
  REJETE: '#F44336',
  EN_COURS: '#FF9800',
  AVIS_FAVORABLE: '#8BC34A',
  AVIS_DEFAVORABLE: '#FF5722',
  EN_ATTENTE: '#2196F3',
  INCOMPLETE: '#FFC107',
};

// Informations de contact
export const CONTACT_INFO = {
  phone: '+212 5XX-XXXXXX',
  email: 'contact@gestion-dossiers.ma',
  address: 'Adresse de l\'organisme, Ville, Maroc',
  latitude: 33.5731104,
  longitude: -7.5898434, // Coordonnées Casablanca par défaut
};
