# 🔐 Comment utiliser PasswordGenerator.java

## Méthode 1 : Exécuter directement (Recommandé)

### Étape 1 : Naviguer vers le dossier backend

```bash
cd backend/fichier
```

### Étape 2 : Compiler et exécuter

```bash
# Compiler le projet (si nécessaire)
mvn compile

# Exécuter PasswordGenerator avec un mot de passe
mvn exec:java -Dexec.mainClass="app.fichier.Utils.PasswordGenerator" -Dexec.args="admin123"
```

**Exemple :**
```bash
mvn exec:java -Dexec.mainClass="app.fichier.Utils.PasswordGenerator" -Dexec.args="admin123"
```

### Étape 3 : Utiliser le hash généré

Copiez le hash BCrypt affiché et utilisez-le dans votre requête SQL :

```sql
INSERT INTO utilisateur (email, password, nom, prenom, cin)
VALUES (
    'admin@example.com',
    '$2a$10$VotreHashGenereIci',  -- ← Collez le hash ici
    'Admin',
    'User',
    'ADMIN001'
);
```

## Méthode 2 : Créer une classe main temporaire

Si la méthode 1 ne fonctionne pas, créez un fichier temporaire :

### Créer `GeneratePassword.java` dans `backend/fichier/src/main/java/`

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeneratePassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = args.length > 0 ? args[0] : "admin123";
        String hash = encoder.encode(password);
        System.out.println("Mot de passe: " + password);
        System.out.println("Hash BCrypt: " + hash);
    }
}
```

Puis compilez et exécutez :
```bash
cd backend/fichier
javac -cp "target/classes:$(mvn dependency:build-classpath -q -Dmdep.outputFile=/dev/stdout)" src/main/java/GeneratePassword.java
java -cp "target/classes:$(mvn dependency:build-classpath -q -Dmdep.outputFile=/dev/stdout):src/main/java" GeneratePassword votre-mot-de-passe
```

## Méthode 3 : Utiliser un générateur en ligne (Plus simple)

Si vous préférez une solution rapide sans compilation :

1. Allez sur : https://bcrypt-generator.com/
2. Entrez votre mot de passe (ex: `admin123`)
3. Cliquez sur "Generate Hash"
4. Copiez le hash généré
5. Utilisez-le dans votre requête SQL

## Méthode 4 : Via Spring Boot Test

Créez un test temporaire :

### Créer `backend/fichier/src/test/java/app/fichier/Utils/PasswordGeneratorTest.java`

```java
package app.fichier.Utils;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGeneratorTest {
    @Test
    public void generatePassword() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "admin123"; // Changez ici
        String hash = encoder.encode(password);
        System.out.println("Mot de passe: " + password);
        System.out.println("Hash BCrypt: " + hash);
    }
}
```

Puis exécutez :
```bash
cd backend/fichier
mvn test -Dtest=PasswordGeneratorTest
```

## 📝 Exemple complet

Si vous voulez créer un admin avec le mot de passe `monpassword123` :

1. **Générez le hash** avec l'une des méthodes ci-dessus
2. **Exécutez cette requête SQL** :

```sql
-- Créer le rôle ADMIN
INSERT INTO roles (role) 
SELECT 'ROLE_ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role = 'ROLE_ADMIN');

-- Créer l'utilisateur avec le hash généré
INSERT INTO utilisateur (email, password, nom, prenom, cin)
VALUES (
    'admin@example.com',
    '$2a$10$VotreHashGenereIci',  -- ← Collez le hash ici
    'Admin',
    'User',
    'ADMIN001'
);

-- Associer le rôle
INSERT INTO utilisateur_role (utilisateur_id, role_id)
SELECT u.id, r.id
FROM utilisateur u, roles r
WHERE u.email = 'admin@example.com' AND r.role = 'ROLE_ADMIN';
```

## ✅ Vérification

Après avoir créé l'utilisateur, testez la connexion :
- Email : `admin@example.com`
- Mot de passe : celui que vous avez utilisé pour générer le hash
