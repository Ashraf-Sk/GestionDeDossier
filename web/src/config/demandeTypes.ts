// Types de demandes d'autorisation avec leurs descriptions

export interface DemandeTypeInfo {
  code: string;
  label: string;
  description: string;
  documentsTypiques: string[];
  utilite: string;
  icon: string;
}

export const DEMANDE_TYPES: DemandeTypeInfo[] = [
  {
    code: 'PERMIS_CONSTRUIRE',
    label: 'Permis de construire',
    description: 'Toute nouvelle construction ou modification d\'un bâtiment',
    documentsTypiques: ['Plan cadastral', 'Titre foncier', 'Plans architecturaux'],
    utilite: 'Légaliser la construction selon le Plan d\'Aménagement Urbain (PAU)',
    icon: '🏗️',
  },
  {
    code: 'LOTISSEMENT',
    label: 'Lotissement / Morcellement',
    description: 'Diviser un terrain en plusieurs lots constructibles ou aménageables',
    documentsTypiques: ['Titre foncier', 'Plans', 'Étude géotechnique (parfois)'],
    utilite: 'Créer des lots pour la vente ou la construction',
    icon: '🏘️',
  },
  {
    code: 'CERTIFICAT_CONFORMITE',
    label: 'Certificat de conformité',
    description: 'Obtenir l\'attestation que la construction respecte les normes urbaines et les permis délivrés',
    documentsTypiques: ['Permis de construire', 'Plan final de construction'],
    utilite: 'Obligatoire pour la vente ou la location d\'un bâtiment',
    icon: '🧱',
  },
  {
    code: 'NOTE_RENSEIGNEMENTS',
    label: 'Note de renseignements urbanistiques (NRU)',
    description: 'Connaître les règles de construction applicables à un terrain',
    documentsTypiques: ['Titre foncier', 'Plan de situation'],
    utilite: 'Préparer un projet de construction ou achat de terrain',
    icon: '📐',
  },
  {
    code: 'DEMOLITION',
    label: 'Démolition',
    description: 'Faire démolir une construction non conforme ou dangereuse',
    documentsTypiques: ['Plan de la parcelle', 'Permis si existant'],
    utilite: 'Régularisation ou sécurité',
    icon: '🏚️',
  },
  {
    code: 'DEROGATION',
    label: 'Dérogation urbanistique',
    description: 'Obtenir une autorisation exceptionnelle quand le projet ne respecte pas exactement le plan d\'urbanisme',
    documentsTypiques: ['Dossier technique complet', 'Justification du projet'],
    utilite: 'Projets spéciaux ou modifications nécessaires',
    icon: '🔄',
  },
];

// Fonction utilitaire pour obtenir les informations d'un type de demande
export function getDemandeTypeInfo(typeCode: string): DemandeTypeInfo | undefined {
  return DEMANDE_TYPES.find((type) => type.code === typeCode);
}

// Fonction pour obtenir le label d'un type
export function getDemandeTypeLabel(typeCode: string): string {
  const typeInfo = getDemandeTypeInfo(typeCode);
  return typeInfo ? typeInfo.label : typeCode;
}

// Liste des codes de types pour les filtres
export const DEMANDE_TYPE_CODES = DEMANDE_TYPES.map((type) => type.code);
