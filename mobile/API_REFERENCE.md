# 📡 Référence API - Application Mobile

Documentation des endpoints API utilisés par l'application mobile.

## Configuration

**Base URL :** `http://10.0.2.2:8000` (émulateur Android)
**Content-Type :** `application/json` (sauf upload de fichiers)
**Authentification :** Bearer Token (JWT)

---

## 🔐 Authentification

### 1. Connexion

**Endpoint :** `POST /auth/login`

**Description :** Authentifie un utilisateur et retourne un token JWT.

**Headers :**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body :**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Response Success (200) :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Error (401) :**
```json
{
  "message": "Email ou mot de passe incorrect"
}
```

**Utilisation dans l'app :**
```typescript
const response = await authService.login({
  email: "user@example.com",
  password: "password"
});
```

---

### 2. Inscription

**Endpoint :** `POST /auth/register`

**Description :** Crée un nouveau compte utilisateur.

**Headers :**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body :**
```json
{
  "email": "newuser@example.com",
  "password": "motdepasse123",
  "nom": "Doe",
  "prenom": "John",
  "cin": "AB123456"
}
```

**Response Success (200) :**
```json
"Utilisateur créé avec succès"
```

**Response Error (400) :**
```json
{
  "message": "Email déjà utilisé"
}
```

**Utilisation dans l'app :**
```typescript
await authService.register({
  email: "user@example.com",
  password: "password",
  nom: "Doe",
  prenom: "John",
  cin: "AB123456"
});
```

---

## 📝 Gestion des Demandes

### 3. Créer une Demande

**Endpoint :** `POST /demande/envoyerDemande`

**Description :** Crée une nouvelle demande d'autorisation avec documents.

**Authentication :** ✅ Requise (Bearer Token)

**Headers :**
```json
{
  "Content-Type": "multipart/form-data",
  "Authorization": "Bearer {token}"
}
```

**Request Body (FormData) :**
```
typeAutorisation: "Construction"
cinDemandeur: "AB123456"
latitude: 33.5731104
longitude: -7.5898434
files[]: [File1, File2, ...] (optionnel)
```

**Response Success (201) :**
```json
{
  "status": "EN_ATTENTE",
  "idDemande": "DEM-2024-001",
  "date": "2024-01-12 14:30:00",
  "documents": [
    {
      "id": "doc-001",
      "nomDocument": "plan.pdf",
      "path": "/uploads/doc-001.pdf"
    }
  ],
  "motifRejet": null,
  "nomDemandeur": "Doe",
  "prenomDemandeur": "John",
  "commune": "Casablanca",
  "latitude": 33.5731104,
  "longitude": -7.5898434,
  "cin": "AB123456",
  "typeAutorisation": "Construction"
}
```

**Response Error (400) :**
```json
{
  "message": "Données invalides"
}
```

**Utilisation dans l'app :**
```typescript
const response = await demandeService.createDemande(
  "Construction",
  "AB123456",
  33.5731104,
  -7.5898434,
  [file1, file2]
);
```

---

### 4. Suivre une Demande

**Endpoint :** `GET /demande/track`

**Description :** Récupère les détails d'une demande spécifique.

**Authentication :** ✅ Requise (Bearer Token)

**Headers :**
```json
{
  "Authorization": "Bearer {token}"
}
```

**Query Parameters :**
```
idDemande: "DEM-2024-001"
cinDemandeur: "AB123456"
```

**Request Example :**
```
GET /demande/track?idDemande=DEM-2024-001&cinDemandeur=AB123456
```

**Response Success (200) :**
```json
{
  "status": "ACCEPTEE",
  "idDemande": "DEM-2024-001",
  "date": "2024-01-12 14:30:00",
  "documents": [
    {
      "id": "doc-001",
      "nomDocument": "plan.pdf",
      "path": "/uploads/doc-001.pdf"
    }
  ],
  "motifRejet": null,
  "nomDemandeur": "Doe",
  "prenomDemandeur": "John",
  "commune": "Casablanca",
  "latitude": 33.5731104,
  "longitude": -7.5898434,
  "cin": "AB123456",
  "typeAutorisation": "Construction"
}
```

**Response Error (404) :**
```json
"Demande introuvable"
```

**Response Error (400) :**
```json
{
  "message": "CIN ne correspond pas"
}
```

**Utilisation dans l'app :**
```typescript
const demande = await demandeService.trackDemande(
  "DEM-2024-001",
  "AB123456"
);
```

---

### 5. Télécharger un Document

**Endpoint :** `GET /demande/telecharger/{documentId}`

**Description :** Télécharge un document joint à une demande.

**Authentication :** ✅ Requise (Bearer Token)

**Headers :**
```json
{
  "Authorization": "Bearer {token}"
}
```

**Query Parameters :**
```
cin: "AB123456"
demandeId: "DEM-2024-001"
```

**Request Example :**
```
GET /demande/telecharger/doc-001?cin=AB123456&demandeId=DEM-2024-001
```

**Response Success (200) :**
- Content-Type: application/octet-stream
- Binary file data

**Response Error (403) :**
```json
{
  "message": "Accès refusé"
}
```

**Utilisation dans l'app :**
```typescript
const blob = await demandeService.downloadDocument(
  "doc-001",
  "AB123456",
  "DEM-2024-001"
);
```

---

## 📞 Contact

### 6. Envoyer un Message

**Endpoint :** `POST /demande/contacter`

**Description :** Envoie un message de contact/réclamation.

**Authentication :** ✅ Requise (Bearer Token)

**Headers :**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"
}
```

**Request Body :**
```json
{
  "sujet": "Question sur ma demande",
  "message": "Bonjour, j'aimerais savoir quand..."
}
```

**Response Success (200) :**
```json
"Message envoyé avec succès"
```

**Response Error (400) :**
```json
{
  "message": "Données invalides"
}
```

**Utilisation dans l'app :**
```typescript
await demandeService.contact({
  sujet: "Question",
  message: "Mon message..."
});
```

---

## 📊 Codes de Statut

| Code | Signification | Description |
|------|--------------|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée |
| 400 | Bad Request | Données invalides |
| 401 | Unauthorized | Token manquant ou invalide |
| 403 | Forbidden | Accès refusé |
| 404 | Not Found | Ressource introuvable |
| 500 | Internal Server Error | Erreur serveur |

---

## 🔒 Gestion du Token JWT

### Stockage du Token
```typescript
// Après login
await AsyncStorage.setItem('authToken', token);

// Récupération
const token = await AsyncStorage.getItem('authToken');

// Suppression
await AsyncStorage.removeItem('authToken');
```

### Ajout Automatique du Token
```typescript
// Intercepteur Axios
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Gestion de l'Expiration
```typescript
// Intercepteur de réponse
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expiré
      await AsyncStorage.removeItem('authToken');
      // Rediriger vers login
    }
    return Promise.reject(error);
  }
);
```

---

## 🎯 Statuts des Demandes

| Statut | Valeur | Description |
|--------|--------|-------------|
| En attente | `EN_ATTENTE` | Demande en attente de validation |
| En cours | `EN_COURS` | Demande en cours de traitement |
| Acceptée | `ACCEPTEE` | Demande acceptée |
| Rejetée | `REJETEE` | Demande rejetée |
| Avis favorable | `AVIS_FAVORABLE` | Avis favorable donné |
| Avis défavorable | `AVIS_DEFAVORABLE` | Avis défavorable |
| Incomplète | `INCOMPLETE` | Dossier incomplet |

---

## 🔍 Types d'Autorisation

Valeurs possibles pour `typeAutorisation` :
- Construction
- Villa
- Terrain
- Immeuble
- Rénovation
- Extension
- Démolition

---

## 🛠️ Configuration Backend

**URL de base :**
- Émulateur Android : `http://10.0.2.2:8000`
- Simulateur iOS : `http://localhost:8000`
- Device physique : `http://YOUR_IP:8000`

**Port par défaut :** 8000

**Base de données :** PostgreSQL (localhost:5432/app-dossier)

---

## 📝 Exemple d'Utilisation Complète

```typescript
// 1. Inscription
await authService.register({
  email: "john@example.com",
  password: "pass123",
  nom: "Doe",
  prenom: "John",
  cin: "AB123456"
});

// 2. Connexion
const { token } = await authService.login({
  email: "john@example.com",
  password: "pass123"
});

// 3. Créer une demande
const demande = await demandeService.createDemande(
  "Construction",
  "AB123456",
  33.5731104,
  -7.5898434,
  [file1, file2]
);

console.log("N° de demande:", demande.idDemande);

// 4. Suivre la demande
const status = await demandeService.trackDemande(
  demande.idDemande,
  "AB123456"
);

console.log("Statut:", status.status);

// 5. Contacter
await demandeService.contact({
  sujet: "Question",
  message: "Bonjour..."
});

// 6. Déconnexion
await authService.logout();
```

---

## 🐛 Gestion des Erreurs

### Patterns de Gestion
```typescript
try {
  const response = await demandeService.trackDemande(id, cin);
  // Traiter la réponse
} catch (error: any) {
  if (error.response) {
    // Erreur de réponse du serveur
    const message = error.response.data?.message || error.response.data;
    Alert.alert('Erreur', message);
  } else if (error.request) {
    // Pas de réponse du serveur
    Alert.alert('Erreur', 'Impossible de contacter le serveur');
  } else {
    // Autre erreur
    Alert.alert('Erreur', 'Une erreur est survenue');
  }
}
```

---

## 📞 Support Technique

Pour toute question sur l'API :
- 📧 Email technique : dev@gestion-dossiers.ma
- 📚 Documentation Swagger : http://localhost:8000/swagger-ui.html

---

**Version API :** 1.0  
**Dernière mise à jour :** Janvier 2026
