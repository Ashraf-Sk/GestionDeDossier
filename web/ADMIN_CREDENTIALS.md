# 🔐 Identifiants Administrateur

## Identifiants par défaut (après exécution du script SQL)

Après avoir exécuté le script `CREATE_ADMIN_USER.sql`, vous pouvez vous connecter avec :

- **Email** : `admin@example.com`
- **Mot de passe** : `admin123`

## 📍 Accès à la page de connexion

1. Ouvrez votre navigateur
2. Accédez à : `http://localhost:5173/admin/login`
3. Entrez les identifiants ci-dessus
4. Cliquez sur "Se connecter"

## ⚠️ Important

- **Changez le mot de passe** après la première connexion pour des raisons de sécurité
- Pour changer le mot de passe, vous devrez :
  1. Générer un nouveau hash BCrypt
  2. Mettre à jour la base de données

## 🔄 Créer un autre utilisateur admin

Si vous voulez créer un autre utilisateur admin avec un mot de passe différent :

1. **Générez le hash BCrypt** du nouveau mot de passe (voir `CREATE_ADMIN_USER.sql`)
2. **Exécutez les requêtes SQL** pour créer l'utilisateur et lui attribuer le rôle ADMIN

## 🛠️ Générer un hash BCrypt

Si vous avez accès à un terminal Java/Spring Boot, vous pouvez utiliser :

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hash = encoder.encode("votre-mot-de-passe");
System.out.println(hash);
```

Ou utilisez un générateur en ligne : https://bcrypt-generator.com/
