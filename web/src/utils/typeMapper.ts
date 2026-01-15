// Mapper entre les codes de types (frontend) et les libellés (base de données)
// Les types peuvent être stockés dans la base de données avec différents formats

export const TYPE_MAPPING: Record<string, string[]> = {
  'PERMIS_CONSTRUIRE': [
    'Permis de construire',
    'PERMIS_CONSTRUIRE',
    'permis de construire',
  ],
  'LOTISSEMENT': [
    'Lotissement / Morcellement',
    'LOTISSEMENT',
    'lotissement',
    'Morcellement',
  ],
  'CERTIFICAT_CONFORMITE': [
    'Certificat de conformité',
    'CERTIFICAT_CONFORMITE',
    'certificat de conformité',
  ],
  'NOTE_RENSEIGNEMENTS': [
    'Note de renseignements urbanistiques (NRU)',
    'NOTE_RENSEIGNEMENTS',
    'note de renseignements',
    'NRU',
  ],
  'DEMOLITION': [
    'Demande de démolition',
    'DEMOLITION',
    'démolition',
    'demande de démolition',
  ],
  'DEROGATION': [
    'Demande de dérogation urbanistique',
    'DEROGATION',
    'dérogation',
    'demande de dérogation',
  ],
};

/**
 * Convertit un code de type en terme de recherche pour le filtre
 * Retourne le code original pour permettre une recherche partielle
 */
export function getTypeSearchTerm(code: string): string {
  return code; // Le filtre LIKE trouvera les correspondances partielles
}
