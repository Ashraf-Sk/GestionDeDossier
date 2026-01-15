# Application Web - Gestion des Dossiers

Application web React pour la gestion et le suivi des demandes d'autorisation avec interface SIG (Système d'Information Géographique).

## 🚀 Fonctionnalités

### Partie Publique (sans authentification)
- **Accueil** : Présentation de la plateforme
- **Tableau de bord** : Statistiques avec graphiques (histogrammes, camemberts)
  - Statistiques par commune, type, statut
  - Visualisation des moyennes
- **Liste des demandes** : Tableau avec pagination et filtres
  - Filtres par type, commune, statut
  - Pagination
- **Carte interactive (SIG)** : Géolocalisation des demandes
  - Affichage des demandes par point
  - Clusters par commune avec statistiques

### Partie Administration (avec authentification)
- **Authentification** : Connexion administrateur
- **Gestion des demandes** :
  - Liste avec filtres et pagination
  - Détails d'une demande
  - Mise à jour du statut (validation/rejet)
  - Gestion du motif de rejet

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build
```

## ⚙️ Configuration

Modifiez le fichier `src/config/api.ts` pour configurer l'URL du backend :

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000', // Modifiez selon votre configuration
  // ...
};
```

## 🔐 Authentification

L'application utilise JWT pour l'authentification. Les tokens sont stockés dans `localStorage` sous la clé `admin_token`.

Pour se connecter en tant qu'administrateur :
1. Accédez à `/admin/login`
2. Utilisez les identifiants d'un compte avec le rôle `ROLE_ADMIN`

## 📁 Structure du projet

```
web/
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── Layout/       # Header, Footer, Layout
│   │   └── admin/        # Composants admin
│   ├── pages/            # Pages de l'application
│   │   ├── admin/        # Pages administration
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Demandes.tsx
│   │   └── Carte.tsx
│   ├── services/         # Services API
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── demandeService.ts
│   │   └── statsService.ts
│   ├── config/           # Configuration
│   │   └── api.ts
│   ├── types/           # Types TypeScript
│   │   └── index.ts
│   ├── App.tsx          # Composant principal avec routing
│   └── main.tsx         # Point d'entrée
├── package.json
└── README.md
```

## 🛠️ Technologies utilisées

- **React 18** : Framework UI
- **TypeScript** : Typage statique
- **Vite** : Build tool et dev server
- **React Router** : Routing
- **Axios** : Client HTTP
- **Tailwind CSS** : Styling
- **Recharts** : Graphiques
- **Leaflet / React-Leaflet** : Cartes interactives
- **Lucide React** : Icônes

## 📡 Endpoints API utilisés

### Public
- `GET /stats/getCentroid` : Clusters pour la carte
- `GET /demande/track` : Suivi d'une demande

### Admin (nécessite authentification)
- `POST /auth/login` : Connexion
- `GET /admin/demandes` : Liste des demandes
- `GET /admin/details/{id}` : Détails d'une demande
- `PATCH /admin/demande/{id}/status` : Mettre à jour le statut
- `GET /stats/getStats` : Statistiques complètes

## 🚨 Notes importantes

1. **CORS** : Assurez-vous que le backend autorise les requêtes depuis `http://localhost:5173` (port par défaut de Vite)
2. **Authentification** : Les statistiques complètes nécessitent un compte administrateur
3. **Carte** : L'endpoint `/stats/getCentroid` est public et peut être utilisé sans authentification

## 📝 Développement

Pour ajouter de nouvelles fonctionnalités :

1. Créez les services dans `src/services/`
2. Ajoutez les types dans `src/types/index.ts`
3. Créez les composants dans `src/components/`
4. Ajoutez les routes dans `src/App.tsx`

## 🐛 Dépannage

### Erreur CORS
Vérifiez que le backend autorise les requêtes depuis l'origine du frontend.

### Erreur 401/403
- Vérifiez que le token JWT est valide
- Vérifiez que l'utilisateur a le rôle `ROLE_ADMIN` pour les endpoints admin

### Carte ne s'affiche pas
- Vérifiez que Leaflet CSS est importé
- Vérifiez la console pour les erreurs de chargement des tuiles
