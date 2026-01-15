// Types pour l'application web

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  cin: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
}

// Types de demande
export type DemandeStatus =
  | 'ACCEPTEE'
  | 'REJETE'
  | 'EN_COURS'
  | 'AVIS_FAVORABLE'
  | 'AVIS_DEFAVORABLE'
  | 'EN_ATTENTE'
  | 'INCOMPLETE';

export interface DocumentAdmin {
  idFichier: string;
  NomFichier: string;
}

export interface AdminDemande {
  id: string;
  status: string;
  temps: string;
  documents: DocumentAdmin[];
  cin: string;
  typeAutorization: string;
  motif: string | null;
}

export interface AdminDetailsDemande {
  id: string;
  cin: string;
  date: string;
  documents: DocumentAdmin[];
  status: string;
  typeAuthorization: string;
  motif: string | null;
  nomCommune: string;
}

export interface UpdateDemandeRequest {
  status: DemandeStatus;
  motifRejet?: string | null;
}

export interface DemandeReponse {
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

export interface DocumentResponse {
  id: string;
  nomFichier: string;
}

// Statistiques
export interface StatsResponse {
  total: number;
  deposees: number;
  enCours: number;
  acceptees: number;
  rejetees: number;
  parCommune: Record<string, number>;
  parType: Record<string, number>;
}

// Cluster pour la carte
export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {
  commune: string;
  count: number;
}

export interface ClusterFeature {
  type: string;
  props: Properties;  // Backend utilise 'props' pas 'properties'
  geom: Geometry;      // Backend utilise 'geom' pas 'geometry'
}

export interface ClusterResponse {
  type: string;
  feature: ClusterFeature[];
}

// Pagination
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Types publics (sans données sensibles)
export interface PublicStatsResponse {
  total: number;
  deposees: number;
  enCours: number;
  acceptees: number;
  rejetees: number;
  parCommune: Record<string, number>;
  parType: Record<string, number>;
}

export interface PublicDemande {
  id: string;
  status: string;
  temps: string;
  typeAutorization: string;
  nomCommune: string;
}
