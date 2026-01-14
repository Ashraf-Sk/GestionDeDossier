// Configuration de l'API Backend
export const API_CONFIG = {
  BASE_URL: 'http://172.36.2.57:8000', // Pour émulateur Android
  // BASE_URL: 'http://localhost:8000', // Pour iOS Simulator
  // BASE_URL: 'http://YOUR_IP:8000', // Pour device physique (trouvez votre IP avec ipconfig/ifconfig)
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
