// Gestion centralisée des erreurs

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export function handleApiError(error: any): ApiError {
  // Erreur réseau
  if (!error.response) {
    return {
      message: 'Erreur de connexion. Vérifiez votre connexion internet.',
      status: 0,
      code: 'NETWORK_ERROR',
    };
  }

  const status = error.response.status;
  const data = error.response.data;

  // Erreurs HTTP spécifiques
  switch (status) {
    case 400:
      return {
        message: data?.message || 'Requête invalide',
        status: 400,
        code: 'BAD_REQUEST',
      };
    case 401:
      return {
        message: 'Authentification requise',
        status: 401,
        code: 'UNAUTHORIZED',
      };
    case 403:
      return {
        message: 'Accès refusé',
        status: 403,
        code: 'FORBIDDEN',
      };
    case 404:
      return {
        message: 'Ressource non trouvée',
        status: 404,
        code: 'NOT_FOUND',
      };
    case 500:
      return {
        message: 'Erreur serveur. Veuillez réessayer plus tard.',
        status: 500,
        code: 'SERVER_ERROR',
      };
    default:
      return {
        message: data?.message || 'Une erreur est survenue',
        status,
        code: 'UNKNOWN_ERROR',
      };
  }
}

export function logError(error: any, context?: string) {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context || 'Error'}]`, error);
  }
  // En production, vous pourriez envoyer l'erreur à un service de logging
}
