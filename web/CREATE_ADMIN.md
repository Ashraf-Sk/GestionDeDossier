# Guide de Création d'un Utilisateur Administrateur

## Méthode 1 : Via SQL (Recommandé)

### Étape 1 : Vérifier que le rôle ADMIN existe

Exécutez cette requête dans PostgreSQL :

```sql
-- Vérifier si le rôle ROLE_ADMIN existe
SELECT * FROM roles WHERE role = 'ROLE_ADMIN';

-- Si le rôle n'existe pas, le créer
INSERT INTO roles (role) VALUES ('ROLE_ADMIN')
ON CONFLICT DO NOTHING;
```

### Étape 2 : Créer un utilisateur admin

**Option A : Créer directement en SQL (nécessite le hash BCrypt du mot de passe)**

```sql
-- 1. Insérer l'utilisateur (remplacez les valeurs)
INSERT INTO utilisateur (email, password, nom, prenom, cin)
VALUES (
    'admin@example.com',  -- Email admin
    '$2a$10$YourBCryptHashHere',  -- Hash BCrypt du mot de passe
    'Admin',
    'User',
    'ADMIN001'
);

-- 2. Récupérer l'ID de l'utilisateur créé
SELECT id FROM utilisateur WHERE email = 'admin@example.com';

-- 3. Récupérer l'ID du rôle ADMIN
SELECT id FROM roles WHERE role = 'ROLE_ADMIN';

-- 4. Associer le rôle à l'utilisateur (remplacez les IDs)
INSERT INTO utilisateur_role (utilisateur_id, role_id)
VALUES (
    (SELECT id FROM utilisateur WHERE email = 'admin@example.com'),
    (SELECT id FROM roles WHERE role = 'ROLE_ADMIN')
);
```

**Option B : Utiliser un script Java pour générer le hash BCrypt**

Créez un fichier temporaire pour générer le hash :

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeneratePassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "admin123"; // Votre mot de passe
        String hash = encoder.encode(password);
        System.out.println("Hash BCrypt: " + hash);
    }
}
```

## Méthode 2 : Via l'API (Après avoir créé le rôle ADMIN)

1. Créez d'abord un utilisateur normal via `/auth/register`
2. Ensuite, exécutez cette requête SQL pour lui donner le rôle ADMIN :

```sql
INSERT INTO utilisateur_role (utilisateur_id, role_id)
VALUES (
    (SELECT id FROM utilisateur WHERE email = 'votre-email@example.com'),
    (SELECT id FROM roles WHERE role = 'ROLE_ADMIN')
);
```

## Méthode 3 : Script SQL Complet (Tout-en-un)

Exécutez ce script SQL complet :

```sql
-- 1. Créer le rôle ADMIN s'il n'existe pas
INSERT INTO roles (role) 
SELECT 'ROLE_ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role = 'ROLE_ADMIN');

-- 2. Créer l'utilisateur admin (mot de passe: admin123)
-- Hash BCrypt pour "admin123": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO utilisateur (email, password, nom, prenom, cin)
SELECT 
    'admin@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Admin',
    'User',
    'ADMIN001'
WHERE NOT EXISTS (SELECT 1 FROM utilisateur WHERE email = 'admin@example.com');

-- 3. Associer le rôle ADMIN à l'utilisateur
INSERT INTO utilisateur_role (utilisateur_id, role_id)
SELECT 
    u.id,
    r.id
FROM utilisateur u
CROSS JOIN roles r
WHERE u.email = 'admin@example.com'
  AND r.role = 'ROLE_ADMIN'
  AND NOT EXISTS (
    SELECT 1 FROM utilisateur_role ur 
    WHERE ur.utilisateur_id = u.id AND ur.role_id = r.id
  );
```

## Identifiants par défaut (après exécution du script)

- **Email** : `admin@example.com`
- **Mot de passe** : `admin123`

⚠️ **IMPORTANT** : Changez le mot de passe après la première connexion !

## Vérification

Après avoir créé l'utilisateur admin, vérifiez avec cette requête :

```sql
SELECT 
    u.email,
    u.nom,
    u.prenom,
    r.role
FROM utilisateur u
JOIN utilisateur_role ur ON ur.utilisateur_id = u.id
JOIN roles r ON r.id = ur.role_id
WHERE r.role = 'ROLE_ADMIN';
```

## Connexion

1. Accédez à `/admin/login` dans l'application web
2. Utilisez les identifiants créés
3. Vous serez redirigé vers `/admin/demandes` après connexion
