# 🚀 Guide de Démarrage Rapide - Application Mobile

## ⚡ Installation Express (5 minutes)

### 1️⃣ Prérequis
```bash
# Vérifier Node.js (version 16+)
node --version

# Installer Expo CLI globalement
npm install -g expo-cli
```

### 2️⃣ Installation
```bash
# Naviguer vers le dossier mobile
cd mobile

# Installer les dépendances
npm install
```

### 3️⃣ Configuration
Éditer `src/config/constants.ts` :
```typescript
BASE_URL: 'http://10.0.2.2:8000'  // Pour émulateur Android
```

### 4️⃣ Lancement
```bash
# Démarrer le serveur de développement
npm start

# Puis appuyer sur :
# - 'a' pour Android
# - 'i' pour iOS
# - Scanner le QR code avec Expo Go sur votre téléphone
```

### 5️⃣ Backend
Assurez-vous que le backend Spring Boot est démarré :
```bash
cd ../backend/fichier
./mvnw spring-boot:run
```

---

## 📱 Premiers Pas

### Créer un Compte
1. Lancer l'application
2. Cliquer sur **"S'inscrire"**
3. Remplir : Nom, Prénom, CIN, Email, Mot de passe
4. Valider

### Se Connecter
1. Saisir votre email
2. Saisir votre mot de passe
3. Cliquer sur **"Se connecter"**

### Créer une Demande
1. Depuis l'accueil : **"Nouvelle Demande"**
2. Choisir le type d'autorisation (ex: Construction)
3. Saisir votre N° CIN
4. Cliquer **"Obtenir ma localisation"** (accepter les permissions)
5. (Optionnel) Ajouter des documents PDF
6. Cliquer **"Soumettre la demande"**
7. ✅ Noter le N° de demande reçu

### Suivre une Demande
1. Onglet **"Suivi"**
2. Saisir le N° de demande
3. Saisir votre N° CIN
4. Cliquer **"Rechercher"**
5. ✅ Voir tous les détails + carte

---

## 🎯 Fonctionnalités Principales

### ✅ Authentification
- Inscription avec CIN
- Connexion sécurisée
- Token JWT automatique

### ✅ Demandes
- Création avec localisation GPS
- Upload de documents
- Suivi en temps réel
- Statuts colorés

### ✅ Cartographie
- Position sur carte satellite
- Marker de localisation
- Carte du bureau

### ✅ Contact
- Téléphone, Email, Adresse
- Formulaire de message
- Carte interactive

### ✅ Procédures
- Liste des documents requis
- Procédures par type
- Informations utiles

---

## 🛠️ Configuration Avancée

### Google Maps (Android)
1. Créer une clé API : https://console.cloud.google.com/
2. Activer "Maps SDK for Android"
3. Dans `app.json` :
```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "VOTRE_CLE_ICI"
    }
  }
}
```

### Device Physique
Trouver votre IP locale :
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```
Puis dans `constants.ts` :
```typescript
BASE_URL: 'http://192.168.1.XX:8000'
```

---

## 🐛 Résolution de Problèmes

### ❌ Backend non accessible
**Solution :** Vérifier que Spring Boot tourne sur port 8000
```bash
cd backend/fichier
./mvnw spring-boot:run
```

### ❌ "Cannot connect"
**Solution :** Modifier `BASE_URL` dans `constants.ts`
- Android émulateur : `http://10.0.2.2:8000`
- iOS simulateur : `http://localhost:8000`
- Device physique : `http://YOUR_IP:8000`

### ❌ Carte ne s'affiche pas
**Solution :** Configurer la clé Google Maps dans `app.json`

### ❌ Permission localisation refusée
**Solution :** 
- Émulateur : Réinitialiser les permissions
- Device : Paramètres → Apps → Expo Go → Permissions

### ❌ "Module not found"
**Solution :**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 📚 Documentation Complète

- **README.md** - Vue d'ensemble du projet
- **INSTALLATION.md** - Guide d'installation détaillé
- **ARCHITECTURE.md** - Architecture technique
- **CHANGELOG.md** - Historique des versions
- **assets/README.md** - Gestion des assets

---

## 🎨 Aperçu des Écrans

### 🔐 Connexion & Inscription
- Design moderne avec icônes
- Validation en temps réel
- Gestion des erreurs

### 🏠 Accueil
- Menu avec 4 options principales
- Liste des types de demandes
- Bouton déconnexion

### 📝 Création de Demande
- Sélection type d'autorisation
- Capture GPS automatique
- Upload multiple de documents

### 🔍 Suivi
- Recherche par N° + CIN
- Détails complets
- Carte satellite avec marker

### 📞 Contact
- Coordonnées cliquables
- Carte de localisation
- Formulaire de message

---

## 🔄 Workflow Complet

```
┌─────────────────────────────────────────────────┐
│  1. S'inscrire / Se connecter                   │
│     ↓                                            │
│  2. Accueil : Voir les options                  │
│     ↓                                            │
│  3. Créer une demande                           │
│     • Choisir type                              │
│     • Saisir CIN                                │
│     • Obtenir GPS                               │
│     • Ajouter documents                         │
│     • Soumettre                                 │
│     ↓                                            │
│  4. Recevoir N° de demande                      │
│     ↓                                            │
│  5. Suivre la demande                           │
│     • Saisir N° demande                         │
│     • Saisir CIN                                │
│     • Voir détails + carte                      │
│     ↓                                            │
│  6. Contacter si besoin                         │
│     • Téléphone / Email                         │
│     • Message via formulaire                    │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Statuts des Demandes

| Statut | Couleur | Signification |
|--------|---------|---------------|
| ✅ ACCEPTEE | Vert | Demande acceptée |
| ❌ REJETEE | Rouge | Demande rejetée |
| ⏳ EN_COURS | Orange | En cours de traitement |
| 👍 AVIS_FAVORABLE | Vert clair | Avis favorable donné |
| 👎 AVIS_DEFAVORABLE | Rouge orange | Avis défavorable |
| ⏱️ EN_ATTENTE | Bleu | En attente de validation |
| ⚠️ INCOMPLETE | Jaune | Dossier incomplet |

---

## 📱 Compatibilité

- ✅ Android 6.0+ (API 23+)
- ✅ iOS 12.0+
- ✅ Émulateurs / Simulateurs
- ✅ Devices physiques

---

## 🚀 Commandes Utiles

```bash
# Démarrer en mode développement
npm start

# Démarrer pour Android
npm run android

# Démarrer pour iOS
npm run ios

# Nettoyer le cache
expo start -c

# Voir les logs
expo logs

# Build pour production
expo build:android
expo build:ios
```

---

## 📞 Support

Pour toute question :
- 📧 Email : contact@gestion-dossiers.ma
- 📱 Téléphone : +212 5XX-XXXXXX

---

## ✨ Fonctionnalités à Venir

- 🌙 Mode sombre
- 🔔 Notifications push
- 📊 Statistiques personnelles
- 💾 Mode hors ligne
- 🌍 Support multilingue
- 📄 Export PDF
- 💳 Paiement en ligne

---

**Version :** 1.0.0  
**Date :** Janvier 2026  
**Développé avec ❤️ par l'équipe Gestion des Dossiers**
