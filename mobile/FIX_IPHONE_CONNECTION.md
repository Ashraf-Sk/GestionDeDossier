# 🔧 Correction de la Connexion iPhone Physique

## Problème Identifié

Vous essayez de vous connecter depuis un **iPhone physique** mais utilisez `localhost:8000`.

**Erreur :** `Network Error` (ERR_NETWORK)

## Pourquoi ça ne fonctionne pas ?

Sur un **device physique** (iPhone ou Android), `localhost` fait référence au téléphone lui-même, **pas à votre PC** où tourne le backend.

- ✅ **iOS Simulator** : `localhost` fonctionne (partage le réseau avec votre Mac)
- ❌ **iPhone physique** : `localhost` ne fonctionne **PAS** (pointe vers le téléphone)

## Solution

Utilisez l'**IP locale de votre PC** au lieu de `localhost`.

### Votre IP actuelle détectée : `172.36.2.9`

La configuration a été mise à jour dans `constants.ts` :
```typescript
BASE_URL: 'http://172.36.2.9:8000'
```

## Vérifications Importantes

### 1. ✅ Vérifier que le backend est démarré

Le backend doit être en cours d'exécution sur le port 8000 :
```bash
cd backend/fichier
mvn spring-boot:run
```

Vous devriez voir :
```
Tomcat started on port 8000 (http) with context path '/'
```

### 2. ✅ Vérifier que l'iPhone et le PC sont sur le même réseau WiFi

**CRUCIAL** : Votre iPhone et votre PC doivent être connectés au **même réseau WiFi**.

- ❌ Si l'iPhone est sur WiFi et le PC sur Ethernet → Ne fonctionnera pas
- ❌ Si l'iPhone est sur un réseau différent → Ne fonctionnera pas
- ✅ iPhone et PC sur le même WiFi → Fonctionne

### 3. ✅ Tester la connexion depuis l'iPhone

Ouvrez Safari sur votre iPhone et testez :
```
http://172.36.2.9:8000/stats/public
```

Si vous voyez du JSON, la connexion fonctionne ✅

### 4. ✅ Vérifier le firewall Windows

Le firewall Windows peut bloquer les connexions entrantes.

**Solution :**
1. Ouvrez "Pare-feu Windows Defender"
2. Cliquez sur "Paramètres avancés"
3. Créez une règle entrante pour le port 8000 (TCP)

**Ou temporairement :**
- Désactivez le firewall pour tester (réactivez-le après)

## Configuration par Environnement

| Environnement | URL à utiliser |
|---------------|----------------|
| iOS Simulator | `http://localhost:8000` |
| iPhone physique | `http://172.36.2.9:8000` (votre IP locale) |
| Émulateur Android | `http://10.0.2.2:8000` |
| Android physique | `http://172.36.2.9:8000` (votre IP locale) |

## Si l'IP change

Si votre IP change (connexion à un autre réseau), trouvez-la avec :

**Windows :**
```bash
ipconfig
```
Cherchez "Adresse IPv4" dans la section de votre connexion WiFi.

**Mac/Linux :**
```bash
ifconfig
# ou
ip addr
```

Puis mettez à jour `BASE_URL` dans `constants.ts`.

## Test de Diagnostic

### Depuis votre PC (devrait fonctionner)
```bash
curl http://172.36.2.9:8000/stats/public
```

### Depuis votre iPhone (Safari)
```
http://172.36.2.9:8000/stats/public
```

Si les deux fonctionnent, la configuration est correcte ✅

## Problèmes Courants

### ❌ "Network Error" persiste

**Causes possibles :**
1. Backend non démarré → Démarrez-le
2. IP incorrecte → Vérifiez avec `ipconfig`
3. Pas sur le même réseau WiFi → Connectez iPhone et PC au même WiFi
4. Firewall bloque → Autorisez le port 8000

### ❌ "Connection refused"

**Cause :** Le backend n'écoute pas sur toutes les interfaces.

**Solution :** Vérifiez dans `application.properties` que le backend écoute sur `0.0.0.0` :
```properties
server.address=0.0.0.0
```

### ❌ L'IP change souvent

**Solution :** Configurez une IP statique sur votre PC ou utilisez un service comme ngrok pour un tunnel stable.

## Configuration Actuelle

Votre configuration a été mise à jour :
```typescript
BASE_URL: 'http://172.36.2.9:8000'
```

**Prochaines étapes :**
1. ✅ Vérifiez que le backend est démarré
2. ✅ Vérifiez que l'iPhone et le PC sont sur le même WiFi
3. ✅ Testez dans Safari sur l'iPhone : `http://172.36.2.9:8000/stats/public`
4. ✅ Relancez l'application mobile
5. ✅ Essayez de vous inscrire à nouveau
