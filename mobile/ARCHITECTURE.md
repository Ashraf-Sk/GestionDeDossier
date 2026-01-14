# Architecture de l'Application Mobile

## Vue d'ensemble

L'application mobile est construite avec React Native et Expo, suivant une architecture modulaire et maintenable.

## Structure des Dossiers

```
mobile/
│
├── App.tsx                          # Point d'entrée principal
├── app.json                         # Configuration Expo
├── package.json                     # Dépendances npm
├── tsconfig.json                    # Configuration TypeScript
├── babel.config.js                  # Configuration Babel
│
├── src/                             # Code source
│   │
│   ├── config/                      # Configuration de l'application
│   │   └── constants.ts            # Constantes globales
│   │
│   ├── contexts/                    # Contextes React
│   │   └── AuthContext.tsx         # Gestion de l'authentification
│   │
│   ├── navigation/                  # Configuration de navigation
│   │   └── AppNavigator.tsx        # Navigation principale
│   │
│   ├── screens/                     # Écrans de l'application
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── TrackDemandeScreen.tsx
│   │   ├── DemandeDetailScreen.tsx
│   │   ├── CreateDemandeScreen.tsx
│   │   ├── ProceduresScreen.tsx
│   │   └── ContactScreen.tsx
│   │
│   ├── services/                    # Services API
│   │   ├── authService.ts          # Service d'authentification
│   │   └── demandeService.ts       # Service des demandes
│   │
│   └── types/                       # Types TypeScript
│       └── index.ts                # Définitions de types
│
└── assets/                          # Ressources statiques
    ├── icon.png
    ├── splash.png
    ├── adaptive-icon.png
    └── favicon.png
```

## Flux de Données

### 1. Authentification
```
LoginScreen → authService.login() 
           → API Backend 
           → JWT Token 
           → AsyncStorage 
           → AuthContext 
           → Navigation
```

### 2. Création de Demande
```
CreateDemandeScreen → expo-location (GPS)
                    → expo-document-picker (Fichiers)
                    → demandeService.createDemande()
                    → API Backend
                    → Confirmation
```

### 3. Suivi de Demande
```
TrackDemandeScreen → demandeService.trackDemande()
                   → API Backend
                   → DemandeDetailScreen
                   → Affichage + Carte
```

## Patterns Utilisés

### 1. Context API
- **AuthContext** : Gestion globale de l'état d'authentification
- Fournit : `isAuthenticated`, `userInfo`, `login()`, `logout()`

### 2. Service Layer
Séparation de la logique métier des composants UI :
- **authService** : Gestion de l'authentification
- **demandeService** : Gestion des demandes

### 3. Axios Interceptors
```typescript
// Ajout automatique du token JWT
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestion automatique de l'expiration
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);
```

### 4. Navigation Stack + Tabs
```
Root Stack
├── Auth Stack (non authentifié)
│   ├── Login
│   └── Register
└── Main Stack (authentifié)
    ├── MainTabs
    │   ├── Home
    │   ├── Track
    │   └── Contact
    ├── DemandeDetail
    ├── CreateDemande
    └── Procedures
```

## Composants Principaux

### 1. App.tsx
- Point d'entrée
- Wraps avec AuthProvider
- Rend AppNavigator

### 2. AuthContext
- Gère l'état d'authentification global
- Fournit les méthodes login/logout
- Vérifie l'authentification au démarrage

### 3. AppNavigator
- Configure la navigation
- Affiche Stack Auth ou Main selon l'état
- Gère les transitions entre écrans

### 4. Services
**authService.ts :**
- login(credentials)
- register(userData)
- logout()
- isAuthenticated()
- getToken()

**demandeService.ts :**
- createDemande(data)
- trackDemande(id, cin)
- downloadDocument(id)
- contact(message)

## État de l'Application

### État Local (useState)
Utilisé pour :
- Formulaires (inputs)
- États de chargement
- Visibilité des modaux

### État Global (Context)
Utilisé pour :
- Authentification utilisateur
- Informations utilisateur
- Token JWT

### AsyncStorage
Utilisé pour :
- Persistance du token JWT
- Cache des informations utilisateur

## Sécurité

### 1. Stockage des Tokens
```typescript
// Stockage sécurisé
await AsyncStorage.setItem('authToken', token);

// Récupération
const token = await AsyncStorage.getItem('authToken');

// Suppression lors de la déconnexion
await AsyncStorage.removeItem('authToken');
```

### 2. Headers HTTP
```typescript
config.headers.Authorization = `Bearer ${token}`;
```

### 3. Validation des Entrées
Toutes les entrées utilisateur sont validées avant envoi :
- Email format
- Longueur mot de passe
- Champs requis
- Format CIN

## Performance

### 1. Optimisations Implémentées
- Lazy loading des composants
- Mémorisation avec React.memo (si nécessaire)
- Utilisation de FlatList pour les listes longues
- Compression des images

### 2. Gestion du Cache
- Cache HTTP via Axios
- Cache local via AsyncStorage
- Invalidation automatique sur 401

## Tests

### Tests Manuels Recommandés
1. Authentification (login/logout)
2. Création de demande avec localisation
3. Upload de documents
4. Suivi de demande
5. Affichage des cartes
6. Formulaire de contact

### Tests à Ajouter
- Unit tests avec Jest
- Tests d'intégration
- Tests E2E avec Detox
- Tests de performance

## Déploiement

### 1. Development Build
```bash
expo start
```

### 2. Production Build
```bash
# Android
expo build:android

# iOS
expo build:ios
```

### 3. Over-The-Air Updates
```bash
expo publish
```

## Dépendances Clés

### Navigation
- @react-navigation/native
- @react-navigation/bottom-tabs
- @react-navigation/native-stack

### API & Data
- axios
- @react-native-async-storage/async-storage

### Maps & Location
- react-native-maps
- expo-location

### UI
- react-native-vector-icons
- expo-status-bar

### Utilities
- expo-document-picker

## Bonnes Pratiques

1. **Composants :** Un composant = une responsabilité
2. **Services :** Logique métier séparée des composants
3. **Types :** TypeScript pour la sécurité des types
4. **Styles :** StyleSheet pour les performances
5. **Erreurs :** Gestion cohérente avec Alert
6. **Loading :** Indicateurs de chargement partout
7. **Navigation :** Types pour les params de navigation

## Évolutions Futures

### Court Terme
- Ajout de tests automatisés
- Optimisation des performances
- Mode hors ligne

### Moyen Terme
- Notifications push
- Cache avancé
- Compression d'images

### Long Terme
- Migration vers Expo EAS
- Support Web progressif
- Analytics et monitoring

---

**Version :** 1.0.0
**Dernière mise à jour :** Janvier 2026
