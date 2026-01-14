# 🧪 Mode Démo - Frontend Mobile

## 📋 Compte de Démo

**Email:** `demo@gestion-dossier.ma`  
**Mot de passe:** `demo123`  
**CIN:** `AB123456`  
**Nom:** `Dupont`  
**Prénom:** `Jean`

---

## 🚀 Démarrer l'App en Mode Démo

```cmd
cd c:\Users\hp\Desktop\PROJET\gestion-dossier\mobile
npm start
```

Puis scannez le QR code avec **Expo Go** sur votre téléphone.

---

## 🔧 Comment Activer/Désactiver le Mode Démo

Éditez `src/config/demoMode.ts`:

```typescript
export const USE_MOCK_DATA = true;   // ← Mode DÉMO (données mockées)
// export const USE_MOCK_DATA = false;  // ← Mode RÉEL (backend nécessaire)
```

---

## 📊 Données de Démo Incluses

Le mode démo charge **4 demandes d'exemple** avec différents statuts:

1. **DEM-2025-001** - Status: ✅ **ACCEPTEE** (Construction)
2. **DEM-2025-002** - Status: ⏳ **EN_COURS** (Villa)
3. **DEM-2024-098** - Status: 👍 **AVIS_FAVORABLE** (Rénovation)
4. **DEM-2024-050** - Status: ❌ **REJETE** (Extension)

---

## ✅ Fonctionnalités Testables en Mode Démo

- ✅ **Login** avec les identifiants démo
- ✅ **Voir les demandes** du compte
- ✅ **Suivre une demande** (rechercher DEM-2025-001 avec CIN AB123456)
- ✅ **Créer une nouvelle demande** avec localisation GPS
- ✅ **Voir les documents** de chaque demande
- ✅ **Afficher la carte** avec la localisation
- ✅ **Voir les motifs de rejet** (pour la demande rejetée)
- ✅ **Envoyer un message de contact** (simula une réponse)

---

## 🔄 Passer au Backend Réel

Quand vous voudrez utiliser le vrai backend:

1. **Changez `demoMode.ts`:**
   ```typescript
   export const USE_MOCK_DATA = false;
   ```

2. **Mettez à jour la BASE_URL** dans `src/config/constants.ts`:
   ```typescript
   export const API_CONFIG = {
     BASE_URL: 'http://192.168.1.100:8000',  // Votre IP
   ```

3. **Lancez le backend** Spring Boot sur le port 8000

4. **Relancez l'app:**
   ```cmd
   npm start
   ```

---

## 📝 Notes

- Les demandes créées en mode démo sont **temporaires** (pas de persistence)
- Les téléchargements de documents sont **simulés**
- Aucune donnée n'est envoyée à un serveur réel
- Parfait pour tester l'UI/UX sans backend!

Bon test! 🎉
