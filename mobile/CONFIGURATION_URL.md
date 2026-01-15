# 🔧 Configuration de l'URL du Backend

## Vue d'ensemble

L'URL du backend doit être configurée différemment selon votre environnement de développement.

## Configuration par Environnement

### 1. Émulateur Android

**URL à utiliser :** `http://10.0.2.2:8000`

```typescript
// mobile/src/config/constants.ts
export const API_CONFIG = {
  BASE_URL: 'http://10.0.2.2:8000', // Émulateur Android
  // ...
};
```

**Pourquoi ?** L'émulateur Android utilise `10.0.2.2` comme alias pour `localhost` de votre machine hôte.

### 2. iOS Simulator

**URL à utiliser :** `http://localhost:8000`

```typescript
// mobile/src/config/constants.ts
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000', // iOS Simulator
  // ...
};
```

**Pourquoi ?** Le simulateur iOS partage le réseau avec votre Mac, donc `localhost` fonctionne directement.

### 3. Device Physique (Android ou iOS)

**URL à utiliser :** `http://VOTRE_IP_LOCALE:8000`

```typescript
// mobile/src/config/constants.ts
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.100:8000', // Exemple - Remplacez par votre IP
  // ...
};
```

**Comment trouver votre IP locale ?**

#### Windows
```bash
ipconfig
```
Cherchez "IPv4 Address" dans la section de votre connexion WiFi/Ethernet.

#### Mac / Linux
```bash
ifconfig
# ou
ip addr
```
Cherchez l'adresse IP de votre interface réseau (généralement `en0` ou `wlan0`).

## Configuration Recommandée

### Option 1 : Configuration Manuelle (Simple)

Modifiez directement `constants.ts` selon votre environnement :

```typescript
// mobile/src/config/constants.ts
export const API_CONFIG = {
  // Décommentez la ligne correspondante à votre environnement :
  
  // BASE_URL: 'http://10.0.2.2:8000',        // Émulateur Android
  // BASE_URL: 'http://localhost:8000',       // iOS Simulator
  BASE_URL: 'http://172.36.2.57:8000',      // Device physique (votre IP actuelle)
  
  ENDPOINTS: {
    // ...
  }
};
```

### Option 2 : Configuration Automatique (Avancé)

Créez une configuration qui détecte automatiquement l'environnement :

```typescript
// mobile/src/config/constants.ts
import { Platform } from 'react-native';

// Détection automatique de l'environnement
const getBaseURL = () => {
  if (__DEV__) {
    // Mode développement
    if (Platform.OS === 'android') {
      // Émulateur Android
      return 'http://10.0.2.2:8000';
    } else {
      // iOS Simulator
      return 'http://localhost:8000';
    }
  } else {
    // Mode production - URL de votre serveur de production
    return 'https://api.votre-domaine.com';
  }
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  ENDPOINTS: {
    // ...
  }
};
```

## Vérification de la Connexion

### Test Rapide

1. **Démarrez le backend** :
   ```bash
   cd backend/fichier
   mvn spring-boot:run
   ```

2. **Testez depuis votre navigateur** :
   - Émulateur Android : `http://10.0.2.2:8000/stats/public`
   - iOS Simulator : `http://localhost:8000/stats/public`
   - Device physique : `http://VOTRE_IP:8000/stats/public`

3. **Si vous voyez du JSON**, la connexion fonctionne ✅

### Test depuis l'Application Mobile

Dans les logs de l'application, vous devriez voir :
```
[API Request] POST /auth/register - Sans token
[API Response] POST /auth/register - Status: 200
```

Si vous voyez des erreurs de connexion, vérifiez :
- ✅ Le backend est démarré
- ✅ L'URL est correcte
- ✅ Le téléphone/émulateur et le PC sont sur le même réseau WiFi (pour device physique)
- ✅ Le firewall autorise le port 8000

## Problèmes Courants

### ❌ "Network Error" ou "ECONNREFUSED"

**Cause :** Le backend n'est pas accessible à cette adresse.

**Solutions :**
1. Vérifiez que le backend est démarré
2. Vérifiez l'URL dans `constants.ts`
3. Testez l'URL dans un navigateur
4. Vérifiez le firewall

### ❌ "Timeout" (sur device physique)

**Cause :** Le device et le PC ne sont pas sur le même réseau.

**Solutions :**
1. Connectez le device et le PC au même WiFi
2. Vérifiez l'IP avec `ipconfig` / `ifconfig`
3. Mettez à jour l'URL dans `constants.ts`

### ❌ "Cannot connect" (sur émulateur Android)

**Cause :** Utilisation de `localhost` au lieu de `10.0.2.2`.

**Solution :** Changez l'URL en `http://10.0.2.2:8000`

## Configuration Actuelle

Votre configuration actuelle utilise :
```typescript
BASE_URL: 'http://172.36.2.57:8000'
```

Cette IP fonctionne pour :
- ✅ Device physique (si cette IP est celle de votre PC)
- ❌ Émulateur Android (utilisez `10.0.2.2`)
- ❌ iOS Simulator (utilisez `localhost`)

## Recommandation

Pour un développement flexible, utilisez la configuration automatique (Option 2) qui détecte automatiquement l'environnement.
