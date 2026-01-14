# 🔧 Résolution du Problème Network Error

## 🔴 Problème Identifié

**Erreur** : `Network Error` avec status `undefined`

**Cause** : L'URL du backend n'est pas accessible depuis le mobile.

---

## 📋 Solutions selon l'Environnement

### 1. Émulateur Android
**URL à utiliser** : `http://10.0.2.2:8000`

Déjà configuré dans `constants.ts`. Si cela ne fonctionne pas :
- Vérifier que le backend tourne sur le port 8000
- Redémarrer l'émulateur Android
- Vérifier que l'émulateur est bien démarré

### 2. iOS Simulator
**URL à utiliser** : `http://localhost:8000`

Dans `constants.ts`, commenter `10.0.2.2` et décommenter `localhost`.

### 3. Device Physique (Téléphone réel)
**URL à utiliser** : `http://172.36.2.57:8000` (votre IP locale détectée)

**⚠️ Important** :
- Le téléphone et l'ordinateur doivent être sur le même réseau WiFi
- Le firewall Windows peut bloquer les connexions
- Vérifier que le port 8000 n'est pas bloqué

---

## 🔍 Étapes de Diagnostic

### 1. Vérifier quel environnement vous utilisez
- **Émulateur Android** : Vous voyez un téléphone Android dans Android Studio
- **iOS Simulator** : Vous voyez un iPhone dans Xcode
- **Device physique** : Vous scannez un QR code avec Expo Go sur votre téléphone réel

### 2. Vérifier que le backend tourne
Dans les logs du terminal, chercher :
```
Tomcat started on port 8000 (http) with context path '/'
```

### 3. Tester la connexion depuis le navigateur
Ouvrir dans votre navigateur (sur le même ordinateur) :
```
http://localhost:8000/auth/register
```
Si cela ne fonctionne pas, le backend n'est pas accessible.

### 4. Si vous utilisez un device physique
- Vérifier que le téléphone et l'ordinateur sont sur le même WiFi
- Désactiver temporairement le firewall Windows pour tester
- Utiliser l'IP locale : `172.36.2.57:8000`

---

## 🛠️ Correction Rapide

### Pour Device Physique :
Dans `mobile/src/config/constants.ts`, changer :
```typescript
BASE_URL: 'http://172.36.2.57:8000', // Pour device physique
```

### Pour iOS Simulator :
Dans `mobile/src/config/constants.ts`, changer :
```typescript
BASE_URL: 'http://localhost:8000', // Pour iOS Simulator
```

### Pour Android Émulateur :
Dans `mobile/src/config/constants.ts`, garder :
```typescript
BASE_URL: 'http://10.0.2.2:8000', // Pour émulateur Android
```

---

## 🔥 Firewall Windows

Si vous utilisez un device physique, le firewall Windows peut bloquer les connexions.

### Solution temporaire (pour tester) :
1. Ouvrir "Pare-feu Windows Defender"
2. Cliquer sur "Paramètres avancés"
3. Créer une règle de trafic entrant pour le port 8000
4. Ou désactiver temporairement le firewall pour tester

---

## ✅ Vérification

Après avoir changé l'URL, redémarrer l'application mobile et réessayer.

Les logs devraient maintenant montrer :
- `[API Response] POST /auth/register - Status: 200` (succès)
- Ou `[API Error] POST /auth/register - Status: 400/500` (erreur backend, mais connexion OK)
