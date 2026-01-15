// Configuration API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    
    // Public - Demandes
    TRACK_DEMANDE: '/demande/track',
    DOWNLOAD_DOCUMENT: '/demande/telecharger',
    
    // Admin
    ADMIN_DEMANDES: '/admin/demandes',
    ADMIN_DETAILS: '/admin/details',
    ADMIN_UPDATE_STATUS: '/admin/demande',
    
    // Stats
    STATS: '/stats/getStats',
    STATS_PUBLIC: '/stats/public',
    CLUSTER: '/stats/getCentroid',
    
    // Public
    PUBLIC_DEMANDES: '/public/demandes',
  },
};
