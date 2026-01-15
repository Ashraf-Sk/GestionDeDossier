# 🔧 Résolution du Problème de Timeout

## Problème
L'inscription échoue avec l'erreur : `timeout of 30000ms exceeded`

## Causes Possibles

### 1. Backend non accessible
- Le backend n'est pas démarré
- L'adresse IP/URL est incorrecte
- Problème de réseau/firewall

### 2. Backend trop lent
- Requête d'inscription prend plus de 30 secondes
- Base de données lente
- Traitement lourd côté serveur

### 3. Problème de connexion réseau
- Réseau instable
- Latence élevée
- Problème de DNS

## Solutions Appliquées

### ✅ Timeout augmenté
- **Avant** : 30 secondes (30000ms)
- **Après** : 60 secondes (60000ms) pour l'inscription

### ✅ Meilleure gestion d'erreurs
- Détection spécifique des timeouts
- Messages d'erreur plus clairs
- Logs détaillés pour diagnostic

## Vérifications à Faire

### 1. Vérifier que le backend est démarré
```bash
# Dans le terminal backend
cd backend/fichier
mvn spring-boot:run
```

Vérifiez que vous voyez :
```
Started FichierApplication in X.XXX seconds
```

### 2. Vérifier l'URL dans constants.ts
```typescript
// mobile/src/config/constants.ts
BASE_URL: 'http://172.36.2.57:8000' // Vérifiez que cette IP est correcte
```

**Pour trouver votre IP :**
- Windows : `ipconfig` (cherchez "IPv4 Address")
- Mac/Linux : `ifconfig` ou `ip addr`

### 3. Tester la connexion au backend
Depuis votre téléphone/émulateur, testez dans un navigateur :
```
http://172.36.2.57:8000/stats/public
```

Si ça ne fonctionne pas, le backend n'est pas accessible.

### 4. Vérifier les logs du backend
Quand vous essayez de vous inscrire, regardez les logs du backend :
- La requête arrive-t-elle ? (vous devriez voir `POST /auth/register`)
- Y a-t-il des erreurs ?
- Combien de temps prend le traitement ?

## Solutions selon le cas

### Cas 1 : Backend non accessible
**Symptômes** : Erreur `ECONNREFUSED` ou `ENOTFOUND`

**Solutions** :
1. Vérifiez que le backend est démarré
2. Vérifiez l'IP dans `constants.ts`
3. Vérifiez le firewall Windows (autoriser le port 8000)
4. Sur émulateur Android, utilisez `10.0.2.2` au lieu de l'IP locale

### Cas 2 : Timeout réel (backend trop lent)
**Symptômes** : La requête arrive au backend mais prend > 60s

**Solutions** :
1. Vérifiez les performances de la base de données
2. Vérifiez les logs backend pour identifier le goulot d'étranglement
3. Optimisez la requête d'inscription si nécessaire
4. Augmentez encore le timeout si vraiment nécessaire (mais c'est un symptôme, pas une solution)

### Cas 3 : Problème réseau
**Symptômes** : Connexion instable, timeouts intermittents

**Solutions** :
1. Vérifiez que le téléphone et le PC sont sur le même réseau WiFi
2. Testez avec un autre réseau
3. Vérifiez la qualité du signal WiFi

## Test de Diagnostic

Exécutez cette commande pour tester la connexion :

```bash
# Depuis votre PC
curl -X POST http://172.36.2.57:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "nom": "Test",
    "prenom": "User",
    "cin": "TEST001"
  }'
```

Si ça fonctionne depuis le PC mais pas depuis le mobile, c'est un problème de réseau/connexion.

## Configuration Recommandée

### Pour émulateur Android
```typescript
BASE_URL: 'http://10.0.2.2:8000'
```

### Pour iOS Simulator
```typescript
BASE_URL: 'http://localhost:8000'
```

### Pour device physique
```typescript
BASE_URL: 'http://VOTRE_IP_LOCALE:8000' // Ex: http://192.168.1.100:8000
```

## Logs à Surveiller

Dans les logs mobile, vous devriez voir :
```
[AuthService] Tentative d'inscription pour: { email: '...' }
[AuthService] URL complète: http://...
[API Request] POST /auth/register - Sans token
```

Si vous ne voyez pas `[API Request]`, la requête ne part même pas.

Si vous voyez `[API Request]` mais pas de réponse, c'est un timeout ou un problème réseau.

## Contact

Si le problème persiste après ces vérifications, vérifiez :
1. Les logs complets du backend
2. Les logs complets du mobile
3. La configuration réseau
4. Les performances de la base de données
