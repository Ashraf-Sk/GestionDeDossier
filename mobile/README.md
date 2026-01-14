# Application Mobile - Gestion des Dossiers

Application mobile React Native avec Expo pour la gestion et le suivi des demandes d'autorisation.

## 🚀 Fonctionnalités

### Authentification
- ✅ Connexion avec email et mot de passe
- ✅ Inscription de nouveaux utilisateurs
- ✅ Gestion des tokens JWT
- ✅ Déconnexion sécurisée

### Gestion des Demandes
- ✅ Création de nouvelles demandes avec :
  - Type d'autorisation (Construction, Villa, Terrain, etc.)
  - N° CIN du demandeur
  - Localisation GPS (latitude/longitude)
  - Documents joints (PDF, images)
- ✅ Suivi des demandes existantes
- ✅ Affichage des détails complets :
  - Statut de la demande (Acceptée, Rejetée, En cours, etc.)
  - Informations du demandeur
  - Date de dépôt
  - Motif de rejet (si applicable)
  - Documents joints
  - Localisation sur carte satellite

### Fonctionnalités Supplémentaires
- ✅ Procédures administratives pour chaque type de demande
- ✅ Formulaire de contact
- ✅ Localisation du bureau sur carte
- ✅ Informations de contact (téléphone, email, adresse)

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- Expo CLI : `npm install -g expo-cli`
- Android Studio (pour émulateur Android) ou Xcode (pour simulateur iOS)
- Un appareil mobile avec l'app Expo Go (optionnel)

## 🛠️ Installation

1. Naviguer vers le dossier mobile :
```bash
cd mobile
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer l'URL du backend :
   - Ouvrir `src/config/constants.ts`
   - Modifier `BASE_URL` selon votre environnement :
     - Émulateur Android : `http://10.0.2.2:8000`
     - Simulateur iOS : `http://localhost:8000`
     - Device physique : `http://YOUR_IP_ADDRESS:8000`

## 🚀 Lancement

### Démarrer le serveur de développement :
```bash
npm start
```

### Sur émulateur Android :
```bash
npm run android
```

### Sur simulateur iOS :
```bash
npm run ios
```

### Sur appareil physique :
1. Installer Expo Go depuis Play Store ou App Store
2. Scanner le QR code affiché dans le terminal

## 📱 Configuration Android

Pour utiliser Google Maps sur Android, vous devez :

1. Créer une clé API Google Maps :
   - Aller sur [Google Cloud Console](https://console.cloud.google.com/)
   - Créer un nouveau projet ou utiliser un existant
   - Activer l'API "Maps SDK for Android"
   - Créer une clé API

2. Ajouter la clé dans `app.json` :
```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "VOTRE_CLE_API_ICI"
    }
  }
}
```

## 📁 Structure du Projet

```
mobile/
├── App.tsx                      # Point d'entrée de l'application
├── app.json                     # Configuration Expo
├── package.json                 # Dépendances npm
├── src/
│   ├── config/
│   │   └── constants.ts        # Configuration et constantes
│   ├── contexts/
│   │   └── AuthContext.tsx     # Contexte d'authentification
│   ├── navigation/
│   │   └── AppNavigator.tsx    # Configuration de navigation
│   ├── screens/
│   │   ├── LoginScreen.tsx     # Écran de connexion
│   │   ├── RegisterScreen.tsx  # Écran d'inscription
│   │   ├── HomeScreen.tsx      # Écran d'accueil
│   │   ├── TrackDemandeScreen.tsx      # Suivi de demande
│   │   ├── DemandeDetailScreen.tsx     # Détails de demande
│   │   ├── CreateDemandeScreen.tsx     # Création de demande
│   │   ├── ProceduresScreen.tsx        # Procédures administratives
│   │   └── ContactScreen.tsx           # Contact
│   └── services/
│       ├── authService.ts      # Service d'authentification
│       └── demandeService.ts   # Service de gestion des demandes
```

## 🔧 Configuration du Backend

Assurez-vous que le backend Spring Boot est démarré sur le port 8000.

Endpoints utilisés :
- `POST /auth/login` - Authentification
- `POST /auth/register` - Inscription
- `POST /demande/envoyerDemande` - Créer une demande
- `GET /demande/track` - Suivre une demande
- `POST /demande/contacter` - Envoyer un message
- `GET /demande/telecharger/{documentId}` - Télécharger un document

## 📊 Statuts des Demandes

- **ACCEPTEE** : Demande acceptée ✅
- **REJETEE** : Demande rejetée ❌
- **EN_COURS** : En cours de traitement ⏳
- **AVIS_FAVORABLE** : Avis favorable 👍
- **AVIS_DEFAVORABLE** : Avis défavorable 👎
- **EN_ATTENTE** : En attente de validation ⏱️
- **INCOMPLETE** : Dossier incomplet ⚠️

## 🎨 Thème

L'application utilise une palette de couleurs cohérente :
- Couleur principale : Bleu (#2196F3)
- Succès : Vert (#4CAF50)
- Erreur : Rouge (#F44336)
- Avertissement : Orange (#FF9800)

## 🔐 Sécurité

- Authentification JWT avec stockage sécurisé via AsyncStorage
- Intercepteurs Axios pour l'ajout automatique du token
- Gestion automatique de l'expiration des tokens
- Validation des entrées côté client

## 🐛 Dépannage

### Problème de connexion au backend
- Vérifier que le backend est démarré
- Vérifier l'URL dans `constants.ts`
- Sur émulateur Android, utiliser `10.0.2.2` au lieu de `localhost`

### Problème avec les cartes
- Vérifier que la clé API Google Maps est configurée
- Vérifier les permissions de localisation dans l'app

### Erreur lors de l'installation
```bash
# Nettoyer le cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notes Importantes

- L'application nécessite une connexion Internet pour fonctionner
- Les permissions de localisation sont requises pour créer des demandes
- Les permissions de stockage sont requises pour joindre des documents
- Tester sur un appareil réel pour les meilleures performances

## 🚀 Prochaines Étapes

Pour déployer en production :

1. Configurer les clés de signature Android/iOS
2. Créer un build de production :
```bash
expo build:android
expo build:ios
```

3. Publier sur les stores :
   - Google Play Store (Android)
   - Apple App Store (iOS)

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.
