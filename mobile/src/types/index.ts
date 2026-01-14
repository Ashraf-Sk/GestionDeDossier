// Types TypeScript pour l'application

// Types d'authentification
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

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  cin: string;
}

// Types de demande
export interface Demande {
  id: string;
  status: DemandeStatus;
  idDemande: string;
  date: string;
  documents: Document[];
  motifRejet: string | null;
  nomDemandeur: string;
  prenomDemandeur: string;
  commune: string;
  latitude: number;
  longitude: number;
  cin: string;
  typeAutorisation: string;
}

export type DemandeStatus =
  | 'ACCEPTEE'
  | 'REJETE'
  | 'EN_COURS'
  | 'AVIS_FAVORABLE'
  | 'AVIS_DEFAVORABLE'
  | 'EN_ATTENTE'
  | 'INCOMPLETE';

export interface Document {
  id: string;
  nomDocument: string;
  path: string;
}

export interface CreateDemandeData {
  typeAutorisation: string;
  cinDemandeur: string;
  latitude: number;
  longitude: number;
  files?: FileInfo[];
}

export interface FileInfo {
  uri: string;
  name: string;
  type: string;
}

// Types de contact
export interface ContactMessage {
  sujet: string;
  message: string;
}

// Types de réponse API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: { [key: string]: string };
}
