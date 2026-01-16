# 🔍 Diagnostic - Lecture/Téléchargement PDFs Admin

## Problème
Les PDFs envoyés par les utilisateurs via mobile ne peuvent pas être lus/ouverts par l'admin dans l'interface web.

## Vérifications à Effectuer

### 1. ✅ Vérifier que le backend est démarré
Le backend doit être en cours d'exécution sur le port 8000.

### 2. ✅ Vérifier les logs du backend
Quand vous cliquez sur "Ouvrir" ou "Télécharger" un PDF dans l'interface admin, regardez les logs du backend.

**Vous devriez voir :**
```
[AdminController] Tentative de téléchargement du document: <documentId>
[DocumentImple] Chemin du document recherché: <chemin>
[DocumentImple] Resource existe: true
[DocumentImple] Resource lisible: true
[AdminController] Document trouvé: <nom_fichier>
```

**Si vous voyez des erreurs :**
- `Document non trouvé` → Le fichier n'existe pas physiquement
- `Erreur URL` → Problème avec le chemin du fichier
- `Resource existe: false` → Le fichier n'est pas au bon endroit

### 3. ✅ Vérifier que les fichiers existent physiquement
Les fichiers sont stockés dans le répertoire `./uploads` (relatif au backend).

**Vérifier :**
```bash
cd backend/fichier
ls -la uploads/
```

Vous devriez voir des fichiers avec des noms comme : `UUID-nom_fichier.pdf`

### 4. ✅ Vérifier la console du navigateur
Ouvrez la console du navigateur (F12) et regardez les logs quand vous cliquez sur un PDF.

**Vous devriez voir :**
```
[demandeService] Téléchargement document admin, documentId: <id>
[demandeService] URL complète: http://localhost:8000/admin/document/<id>
[demandeService] Document téléchargé avec succès, taille: <taille>
```

**Si vous voyez des erreurs :**
- `404` → Le document n'est pas trouvé
- `CORS` → Problème de configuration CORS
- `Timeout` → Le backend ne répond pas

### 5. ✅ Tester directement l'endpoint
Testez l'endpoint directement dans le navigateur ou avec curl :

```bash
# Remplacer <documentId> par un vrai documentId depuis l'interface admin
curl http://localhost:8000/admin/document/<documentId> \
  -H "Authorization: Bearer <votre_token_admin>"
```

**Si ça fonctionne :** Vous devriez recevoir le PDF
**Si ça ne fonctionne pas :** Regardez l'erreur retournée

### 6. ✅ Vérifier le documentId
Le `documentId` dans l'interface admin correspond au nom du fichier stocké (UUID + nomOriginal).

**Exemple :**
- DocumentId dans la DB : `478371eb-7afd-454d-aefb-8fb7ee7fc724document.pdf`
- Fichier physique : `./uploads/478371eb-7afd-454d-aefb-8fb7ee7fc724document.pdf`

### 7. ✅ Vérifier les permissions du répertoire uploads
Le répertoire `uploads` doit être accessible en lecture :

```bash
cd backend/fichier
ls -la uploads/
# Les fichiers doivent être lisibles
```

## Solutions selon le Problème

### ❌ Erreur 404 - Document introuvable

**Causes possibles :**
1. Le fichier n'existe pas physiquement dans `./uploads`
2. Le documentId ne correspond pas au nom du fichier
3. Le répertoire uploads n'existe pas

**Solutions :**
1. Vérifier que le fichier existe : `ls uploads/`
2. Vérifier que le documentId correspond au nom du fichier
3. Créer le répertoire si nécessaire : `mkdir -p uploads`

### ❌ Erreur CORS

**Solution :** Vérifier que la configuration CORS dans `SecurityConfig.java` inclut l'origine du frontend.

### ❌ Le blob est vide ou erreur texte

**Cause :** Le backend renvoie un message d'erreur au lieu du PDF.

**Solution :** Regarder les logs backend pour voir l'erreur exacte.

### ❌ Le PDF s'ouvre mais est vide/corrompu

**Causes possibles :**
1. Le fichier a été corrompu lors de l'upload
2. Le fichier n'a pas été complètement téléchargé

**Solution :** Vérifier le fichier original dans `uploads/`

## Test Rapide

1. Ouvrez l'interface admin
2. Allez sur une demande avec des documents
3. Ouvrez la console du navigateur (F12)
4. Cliquez sur "Ouvrir" ou "Télécharger" un PDF
5. Regardez les logs dans :
   - Console navigateur (frontend)
   - Logs backend (terminal Spring Boot)

## Configuration Actuelle

**Backend :**
- Endpoint : `GET /admin/document/{documentId:.+}`
- Répertoire fichiers : `./uploads` (configuré dans `application.properties`)
- Logs activés : OUI

**Frontend :**
- Service : `downloadDocumentAsAdmin(documentId)`
- URL : `/admin/document/{documentId}`
- Logs activés : OUI

## Prochaines Étapes

1. Exécutez les tests ci-dessus
2. Regardez les logs backend et frontend
3. Partagez les erreurs spécifiques pour un diagnostic plus précis
