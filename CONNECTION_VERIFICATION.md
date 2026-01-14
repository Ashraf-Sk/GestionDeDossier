# Vérification de la Connexion Frontend/Backend

## ✅ Résumé de la Vérification

### 1. Ports
- **Backend**: Port `8000` ✅
  - Configuré dans: `backend/fichier/src/main/resources/application.properties`
  - Ligne 2: `server.port= 8000`
  - Status: ✅ Confirmé dans les logs du terminal

- **Mobile**: BASE_URL configuré ✅
  - Fichier: `mobile/src/config/constants.ts`
  - Actuellement: `http://localhost:8000` (iOS Simulator)
  - Android: `http://10.0.2.2:8000` (commenté)

### 2. Endpoints - Correspondance ✅

| Endpoint Mobile | Endpoint Backend | Méthode | Status |
|----------------|------------------|---------|--------|
| `/auth/login` | `/auth/login` | POST | ✅ |
| `/auth/register` | `/auth/register` | POST | ✅ |
| `/demande/envoyerDemande` | `/demande/envoyerDemande` | POST | ✅ |
| `/demande/track` | `/demande/track` | GET | ✅ |
| `/demande/telecharger` | `/demande/telecharger/{documentId}` | GET | ✅ |
| `/demande/contacter` | `/demande/contacter` | POST | ✅ |

### 3. Configuration CORS ⚠️

**Problème détecté**: Pas de configuration CORS explicite trouvée dans le backend.

**Ce qui existe**:
- L'interceptor `inter.java` ignore les requêtes OPTIONS (ligne 37)
- Mais aucune configuration CORS complète avec `@CrossOrigin` ou `CorsConfiguration`

**Recommandation**: Ajouter une configuration CORS si nécessaire pour les requêtes cross-origin.

### 4. Configuration de l'URL selon l'Environnement ⚠️

**Actuellement configuré**: `http://localhost:8000` (iOS Simulator)

**Options selon l'environnement**:
- **Émulateur Android**: `http://10.0.2.2:8000`
- **iOS Simulator**: `http://localhost:8000`
- **Device physique**: `http://YOUR_IP_ADDRESS:8000` (IP locale de votre machine)

## 📋 Actions Requises

1. **Vérifier l'environnement utilisé**:
   - Si Android → Décommenter `http://10.0.2.2:8000` et commenter `localhost:8000`
   - Si iOS → Garder `localhost:8000`
   - Si device physique → Utiliser votre IP locale

2. **Tester la connexion**:
   - S'assurer que le backend tourne sur le port 8000
   - Lancer l'application mobile
   - Tester une connexion (login)

3. **CORS** (si problème de connexion):
   - Si erreur CORS, ajouter une configuration CORS dans le backend

## 🔍 Commandes de Vérification

### Vérifier que le backend tourne:
```bash
# Vérifier dans les logs du terminal
# Chercher: "Tomcat started on port 8000"
```

### Tester une connexion (avec curl):
```bash
# Test login (remplacer email/password)
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Trouver votre IP locale (pour device physique):
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```
