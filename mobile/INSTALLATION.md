# Guide d'Installation et d'Utilisation

## Installation Rapide

### 1. Installation des dépendances

```bash
cd mobile
npm install
```

### 2. Configuration du Backend

Dans `src/config/constants.ts`, modifiez `BASE_URL` selon votre cas :

**Pour émulateur Android :**
```typescript
BASE_URL: 'http://10.0.2.2:8000'
```

**Pour simulateur iOS :**
```typescript
BASE_URL: 'http://localhost:8000'
```

**Pour device physique :**
Trouvez votre IP locale :
- Windows : `ipconfig` dans CMD
- Mac/Linux : `ifconfig` dans Terminal
- Utilisez l'IP (ex: `http://192.168.1.10:8000`)

### 3. Configuration Google Maps (Android)

1. Créer une clé API Google Maps :
   - https://console.cloud.google.com/
   - Créer un projet
   - Activer "Maps SDK for Android"
   - Créer une clé API

2. Dans `app.json`, remplacer :
```json
"apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
```

### 4. Démarrage

```bash
npm start
```

Puis choisir :
- `a` pour Android
- `i` pour iOS
- Scanner QR code avec Expo Go sur téléphone

## Structure des Écrans

### 1. Écran de Connexion (LoginScreen)
- Email et mot de passe
- Lien vers inscription
- Gestion JWT automatique

### 2. Écran d'Inscription (RegisterScreen)
- Nom, prénom, CIN, email, mot de passe
- Validation des champs

### 3. Écran d'Accueil (HomeScreen)
- Menu principal avec 4 options
- Liste des types de demandes
- Bouton déconnexion

### 4. Écran de Suivi (TrackDemandeScreen)
- Recherche par N° demande + CIN
- Affiche les détails si trouvé

### 5. Écran Détails (DemandeDetailScreen)
- Statut coloré
- Toutes les informations
- Carte satellite avec position
- Liste des documents

### 6. Création de Demande (CreateDemandeScreen)
- Sélection type d'autorisation
- N° CIN
- Localisation GPS automatique
- Upload de documents (optionnel)

### 7. Procédures (ProceduresScreen)
- Liste des procédures par type
- Documents requis
- Informations utiles

### 8. Contact (ContactScreen)
- Coordonnées (téléphone, email, adresse)
- Carte de localisation
- Formulaire de message
- Horaires

## Flux d'Utilisation

1. **Première utilisation :**
   - Inscription avec CIN, nom, prénom, email, password
   - Connexion automatique après inscription

2. **Créer une demande :**
   - Accueil → "Nouvelle Demande"
   - Choisir type d'autorisation
   - Saisir N° CIN
   - Obtenir localisation GPS
   - Ajouter documents (optionnel)
   - Soumettre

3. **Suivre une demande :**
   - Onglet "Suivi"
   - Saisir N° demande (reçu après création)
   - Saisir N° CIN
   - Rechercher

4. **Consulter les procédures :**
   - Accueil → "Procédures Administratives"
   - Voir la liste des documents requis

5. **Contacter :**
   - Onglet "Contact"
   - Appeler, envoyer email, ou voir sur carte
   - Envoyer un message via le formulaire

## Tests Recommandés

### Test 1 : Inscription et Connexion
1. Lancer l'app
2. Cliquer "S'inscrire"
3. Remplir le formulaire
4. Vérifier redirection vers login
5. Se connecter avec les identifiants

### Test 2 : Créer une Demande
1. Depuis l'accueil, "Nouvelle Demande"
2. Sélectionner "Construction"
3. Saisir un CIN
4. Cliquer "Obtenir ma localisation"
5. Accepter les permissions
6. Ajouter un document PDF
7. Soumettre
8. Noter le N° de demande

### Test 3 : Suivre une Demande
1. Aller sur onglet "Suivi"
2. Saisir le N° de demande obtenu
3. Saisir le même CIN
4. Rechercher
5. Vérifier l'affichage des détails
6. Vérifier la carte avec le marker

### Test 4 : Contact
1. Onglet "Contact"
2. Vérifier la carte
3. Tester les liens (téléphone, email)
4. Remplir le formulaire
5. Envoyer un message

## API Backend Requise

L'application communique avec ces endpoints :

```
POST /auth/login
POST /auth/register
POST /demande/envoyerDemande (multipart/form-data)
GET /demande/track?idDemande={}&cinDemandeur={}
GET /demande/telecharger/{documentId}?cin={}&demandeId={}
POST /demande/contacter
```

## Permissions Nécessaires

### Android (app.json)
```json
"permissions": [
  "ACCESS_FINE_LOCATION",
  "ACCESS_COARSE_LOCATION"
]
```

### iOS (automatique via Expo)
- Location When In Use

## Dépendances Principales

- **react-navigation** : Navigation entre écrans
- **axios** : Requêtes HTTP
- **react-native-maps** : Affichage des cartes
- **expo-location** : Géolocalisation
- **expo-document-picker** : Sélection de fichiers
- **react-native-vector-icons** : Icônes

## Troubleshooting

### Erreur : Cannot connect to backend
➜ Vérifier que le backend Spring Boot est démarré sur port 8000
➜ Vérifier l'URL dans constants.ts
➜ Sur Android émulateur, utiliser 10.0.2.2 pas localhost

### Erreur : Location permission denied
➜ Sur émulateur : Réinitialiser les permissions
➜ Sur device : Aller dans Paramètres → Apps → Expo Go → Permissions

### Erreur : Maps not showing
➜ Vérifier la clé API Google Maps dans app.json
➜ Activer "Maps SDK for Android" dans Google Cloud Console

### Erreur : Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur : Expo Go won't scan QR
➜ Vérifier que le téléphone et PC sont sur le même réseau WiFi
➜ Essayer mode Tunnel : `expo start --tunnel`

## Build Production

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

### Configuration requise avant build
1. Créer compte Expo
2. Configurer app.json (bundleIdentifier, package)
3. Préparer icônes et splash screen
4. Générer signing keys

## Contact Développeur

Pour questions techniques, contactez l'équipe de développement.
