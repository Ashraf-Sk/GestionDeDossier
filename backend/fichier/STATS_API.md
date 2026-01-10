# API Statistiques - Guide de Test

## 📊 Endpoint de Statistiques

### Get Statistics - Obtenir les statistiques

**Méthode**: `GET`  
**URL**: `http://localhost:8000/stats/getStats`  
**Authorization**: Requis (Rôle ADMIN uniquement)

**Headers**:
```
Authorization: Bearer <VOTRE_TOKEN_JWT>
Content-Type: application/json
```

**Paramètres**: Aucun

---

## 🔐 Authentification

⚠️ **Important**: Cet endpoint nécessite le rôle **ADMIN**. Vous devez vous connecter avec un compte administrateur.

### Étapes pour obtenir le token ADMIN :

1. **Créer un utilisateur ADMIN** (si pas encore créé) - nécessite une modification manuelle en base de données ou un script d'initialisation
2. **Se connecter** avec les credentials ADMIN via `/auth/login`
3. **Copier le token JWT** de la réponse
4. **Utiliser le token** dans le header `Authorization: Bearer <token>`

---

## 📥 Réponse Attendue

**Code de statut**: `200 OK`

**Body (JSON)**:
```json
{
  "total": 150,
  "deposees": 45,
  "enCours": 60,
  "acceptees": 30,
  "rejetees": 15,
  "parCommune": {
    "Casablanca": 50,
    "Rabat": 40,
    "Fès": 30,
    "Marrakech": 20,
    "Tanger": 10
  },
  "parType": {
    "Construction": 80,
    "Rénovation": 40,
    "Extension": 20,
    "Démolition": 10
  }
}
```

### Description des champs :

- **total** : Nombre total de demandes
- **deposees** : Nombre de demandes avec statut `AVIS_FAVORABLE`
- **enCours** : Nombre de demandes avec statut `EN_COURS`
- **acceptees** : Nombre de demandes avec statut `ACCEPTEE`
- **rejetees** : Nombre de demandes avec statut `REJETE`
- **parCommune** : Map avec le nom de la commune et le nombre de demandes
- **parType** : Map avec le type d'autorisation et le nombre de demandes

---

## ❌ Codes d'Erreur Possibles

### 401 Unauthorized
```json
{
  "timestamp": "2024-12-25T12:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}
```
**Cause**: Token JWT manquant ou invalide

### 403 Forbidden
```json
{
  "timestamp": "2024-12-25T12:00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied"
}
```
**Cause**: L'utilisateur n'a pas le rôle ADMIN

---

## 📝 Exemple de Test dans Postman

### Configuration de la requête :

1. **Méthode**: GET
2. **URL**: `http://localhost:8000/stats/getStats`
3. **Headers**:
   - `Authorization`: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - `Content-Type`: `application/json`

### Workflow complet :

1. **Login en tant qu'ADMIN**:
   ```
   POST http://localhost:8000/auth/login
   Body: {
     "email": "admin@example.com",
     "password": "admin123"
   }
   ```

2. **Copier le token** de la réponse

3. **Appeler l'API de statistiques**:
   ```
   GET http://localhost:8000/stats/getStats
   Header: Authorization: Bearer <token>
   ```

---

## 🔄 Variables Postman Recommandées

Créez ces variables dans votre environnement Postman :

```
base_url: http://localhost:8000
admin_token: (sera rempli après login admin)
```

Puis utilisez dans l'URL : `{{base_url}}/stats/getStats`  
Et dans le header : `Bearer {{admin_token}}`

---

## ⚙️ Script de Test Postman (Optionnel)

Dans l'onglet **Tests** de la requête Login (pour ADMIN), ajoutez :

```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("admin_token", jsonData.token);
    console.log("Token ADMIN sauvegardé");
}
```

Puis dans la requête Stats, utilisez automatiquement `{{admin_token}}` dans le header Authorization.

---

## 📌 Notes Importantes

1. **Rôle requis**: Seuls les utilisateurs avec le rôle `ROLE_ADMIN` peuvent accéder à cet endpoint
2. **Pas de paramètres**: L'endpoint ne prend aucun paramètre, il retourne toutes les statistiques
3. **Données en temps réel**: Les statistiques sont calculées à partir des données actuelles de la base de données
4. **Performance**: Si vous avez beaucoup de données, cette requête peut prendre quelques secondes


