# 🔍 Diagnostic Complet du Timeout

## ✅ Vérifications Essentielles

### 1. Le backend est-il démarré ?

**Vérifier dans le terminal backend :**
```bash
cd backend/fichier
mvn spring-boot:run
```

**Vous devriez voir :**
```
Tomcat started on port(s): 8000 (http)
Started FichierApplication in X.XXX seconds
```

**Si le backend n'est pas démarré → DÉMARREZ-LE**

---

### 2. Le backend a-t-il été redémarré après le changement ?

**IMPORTANT :** Après avoir ajouté `server.address=0.0.0.0`, vous devez **REDÉMARRER** le backend !

1. Arrêter le backend (Ctrl+C dans le terminal)
2. Redémarrer : `mvn spring-boot:run`
3. Vérifier qu'il démarre sur `0.0.0.0:8000`

---

### 3. Test depuis le PC (localhost)

Ouvrez un navigateur ou PowerShell et testez :
```bash
curl http://localhost:8000/stats/public
```

**Si ça ne fonctionne pas → Le backend n'est pas démarré ou a un problème**

---

### 4. Test depuis le PC avec l'IP locale

```bash
curl http://172.36.2.9:8000/stats/public
```

**Si ça fonctionne → Le backend écoute bien sur toutes les interfaces**
**Si ça ne fonctionne pas → Vérifier l'IP avec `ipconfig`**

---

### 5. Trouver votre IP actuelle

**Windows PowerShell :**
```powershell
ipconfig
```

Cherchez "Adresse IPv4" dans la section de votre connexion WiFi/Ethernet.

**Si l'IP a changé → Mettez à jour `constants.ts` dans mobile :**
```typescript
BASE_URL: 'http://VOTRE_NOUVELLE_IP:8000'
```

---

### 6. Test depuis le mobile (iPhone)

1. Ouvrez **Safari** sur votre iPhone
2. Visitez : `http://172.36.2.9:8000/stats/public`
3. **Si vous voyez du JSON → La connexion fonctionne ✅**
4. **Si ça ne charge pas → Problème réseau/firewall**

---

### 7. Vérifier le Firewall Windows

Le firewall peut bloquer le port 8000.

**Solution rapide (test temporaire) :**
1. Ouvrez "Pare-feu Windows Defender"
2. Désactivez temporairement le pare-feu
3. Testez depuis le mobile
4. Si ça fonctionne → Le firewall bloque
5. Réactivez le firewall et créez une règle pour le port 8000

**Créer une règle firewall :**
1. Pare-feu Windows Defender → Paramètres avancés
2. Règles de trafic entrant → Nouvelle règle
3. Type : Port
4. TCP, port spécifique : 8000
5. Autoriser la connexion
6. Appliquer à tous les profils

---

### 8. Vérifier que mobile et PC sont sur le même réseau

**CRUCIAL :**
- ✅ iPhone et PC sur le **même WiFi** → Fonctionne
- ❌ iPhone sur WiFi et PC sur Ethernet → Peut ne pas fonctionner
- ❌ iPhone et PC sur réseaux différents → Ne fonctionne pas

---

### 9. Vérifier les logs du backend

Quand vous essayez de vous inscrire depuis le mobile, regardez les **logs du backend** :

**Vous devriez voir :**
```
Tentative d'inscription pour l'email: taouilanas@gmail.com
```

**Si vous NE voyez RIEN dans les logs → La requête n'arrive pas au backend**

Causes possibles :
- Backend pas démarré
- Firewall bloque
- Mauvaise IP
- Pas sur le même réseau

---

### 10. Test complet avec curl (depuis le PC)

Testez l'inscription directement :
```bash
curl -X POST http://172.36.2.9:8000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\",\"nom\":\"Test\",\"prenom\":\"User\",\"cin\":\"TEST001\"}"
```

**Si ça fonctionne depuis le PC mais pas depuis le mobile → Problème réseau/firewall**

---

## 🔧 Solutions par Symptôme

### ❌ Backend ne démarre pas
- Vérifier que PostgreSQL est démarré
- Vérifier les logs d'erreur
- Vérifier que le port 8000 n'est pas déjà utilisé

### ❌ "Connection refused" ou timeout
- Backend pas démarré → Démarrez-le
- IP incorrecte → Trouvez la bonne IP avec `ipconfig`
- Firewall bloque → Autorisez le port 8000
- Pas sur le même réseau → Connectez mobile et PC au même WiFi

### ❌ Requête arrive au backend mais échoue
- Vérifier les logs backend pour l'erreur exacte
- Vérifier que la base de données est accessible
- Vérifier que le rôle ROLE_USER existe dans la DB

---

## ✅ Checklist Rapide

- [ ] Backend démarré et visible dans les logs
- [ ] Backend redémarré après modification de `application.properties`
- [ ] Test `curl http://localhost:8000/stats/public` fonctionne
- [ ] Test `curl http://172.36.2.9:8000/stats/public` fonctionne
- [ ] IP vérifiée avec `ipconfig` et correspond à `172.36.2.9`
- [ ] Mobile et PC sur le même réseau WiFi
- [ ] Firewall Windows autorise le port 8000 (ou désactivé temporairement)
- [ ] Test depuis Safari iPhone : `http://172.36.2.9:8000/stats/public` fonctionne
- [ ] Les logs backend montrent la requête d'inscription quand on essaie depuis le mobile

---

## 📝 Configuration Actuelle

**Backend (`application.properties`) :**
```properties
server.port=8000
server.address=0.0.0.0  ← DOIT être là !
```

**Mobile (`constants.ts`) :**
```typescript
BASE_URL: 'http://172.36.2.9:8000'  ← Vérifiez que cette IP est correcte
```
