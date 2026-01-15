# Guide de Démarrage - Application Web

## 🚀 Démarrage Rapide

### 1. Installation des dépendances

```bash
cd web
npm install
```

### 2. Configuration

Modifiez `src/config/api.ts` si votre backend n'est pas sur `http://localhost:8000` :

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000', // Modifiez selon votre configuration
  // ...
};
```

### 3. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📋 Fonctionnalités Implémentées

### ✅ Partie Publique

1. **Page d'accueil** (`/`)
   - Présentation de la plateforme
   - Liens vers les différentes sections

2. **Tableau de bord** (`/dashboard`)
   - Statistiques avec graphiques (histogrammes, camemberts)
   - Statistiques par commune, type, statut
   - ⚠️ Nécessite authentification admin pour les stats complètes

3. **Liste des demandes** (`/demandes`)
   - Tableau avec pagination
   - Filtres par type, commune, statut
   - ⚠️ Nécessite authentification admin pour afficher les demandes

4. **Carte interactive (SIG)** (`/carte`)
   - Géolocalisation des demandes
   - Clusters par commune avec statistiques
   - Légende colorée selon le nombre de demandes

### ✅ Partie Administration

1. **Connexion** (`/admin/login`)
   - Authentification avec email/mot de passe
   - Stockage du token JWT

2. **Gestion des demandes** (`/admin/demandes`)
   - Liste avec filtres et pagination
   - Actions : voir les détails

3. **Détails d'une demande** (`/admin/demandes/:id`)
   - Affichage des informations complètes
   - Mise à jour du statut
   - Gestion du motif de rejet

4. **Statistiques admin** (`/admin/stats`)
   - Statistiques complètes avec graphiques
   - Accessible uniquement aux administrateurs

## 🔐 Authentification

Pour se connecter en tant qu'administrateur :

1. Accédez à `/admin/login`
2. Utilisez un compte avec le rôle `ROLE_ADMIN`
3. Le token JWT est stocké dans `localStorage` sous la clé `admin_token`

## 🛠️ Structure des Services API

### `authService.ts`
- `login()` : Connexion
- `logout()` : Déconnexion
- `isAuthenticated()` : Vérification de l'authentification

### `demandeService.ts`
- `getDemandes()` : Liste avec pagination et filtres
- `getDemandeDetails()` : Détails d'une demande
- `updateDemandeStatus()` : Mise à jour du statut
- `trackDemande()` : Suivi d'une demande (public)

### `statsService.ts`
- `getStats()` : Statistiques complètes (admin)
- `getCluster()` : Clusters pour la carte (public)

## 📦 Technologies

- **React 19** + **TypeScript**
- **Vite** : Build tool ultra-rapide
- **React Router** : Navigation
- **Axios** : Client HTTP avec intercepteurs
- **Tailwind CSS** : Styling
- **Recharts** : Graphiques
- **Leaflet** : Cartes interactives
- **Lucide React** : Icônes

## 🐛 Dépannage

### Erreur CORS
Vérifiez que le backend autorise les requêtes depuis `http://localhost:5173`

### Erreur 401/403
- Vérifiez que le token est valide
- Vérifiez que l'utilisateur a le rôle `ROLE_ADMIN`

### Carte ne s'affiche pas
- Vérifiez que Leaflet CSS est bien importé dans `style.css`
- Vérifiez la console pour les erreurs

### Statistiques ne s'affichent pas
- Les statistiques nécessitent une authentification admin
- Vérifiez que vous êtes connecté avec un compte admin

## ✅ Fonctionnalités Complétées

- [x] **Endpoint public pour les statistiques** : `/stats/public` - Accessible sans authentification
- [x] **Endpoint public pour les demandes** : `/public/demandes` - Liste sans données sensibles (CIN, documents, motif)
- [x] **Gestion des erreurs améliorée** : 
  - ErrorBoundary pour capturer les erreurs React
  - Gestion centralisée des erreurs API
  - Composant ErrorMessage réutilisable
- [x] **Tests unitaires** : Configuration Vitest avec exemples de tests pour les services
- [x] **Optimisation des performances** :
  - Lazy loading de tous les composants de pages
  - Code splitting automatique avec React.lazy()
  - Suspense pour les états de chargement

## 🧪 Tests

Pour exécuter les tests :

```bash
npm test          # Mode watch
npm run test:ui   # Interface graphique
```

## 🚀 Optimisations Appliquées

- **Lazy Loading** : Toutes les pages sont chargées à la demande
- **Code Splitting** : Chaque route est un bundle séparé
- **Error Boundaries** : Gestion robuste des erreurs React
- **Gestion d'erreurs API** : Messages d'erreur clairs et contextuels
