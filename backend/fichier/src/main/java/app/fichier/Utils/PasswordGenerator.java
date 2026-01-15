package app.fichier.Utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utilitaire pour générer des hash BCrypt
 * 
 * Usage: Exécutez la méthode main() avec votre mot de passe
 * pour obtenir le hash BCrypt à utiliser dans la base de données
 */
public class PasswordGenerator {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Mot de passe par défaut pour l'admin
        String password = "admin123";
        
        if (args.length > 0) {
            password = args[0];
        }
        
        String hash = encoder.encode(password);
        System.out.println("=========================================");
        System.out.println("Mot de passe: " + password);
        System.out.println("Hash BCrypt: " + hash);
        System.out.println("=========================================");
        System.out.println("\nUtilisez ce hash dans la requête SQL :");
        System.out.println("INSERT INTO utilisateur (email, password, nom, prenom, cin)");
        System.out.println("VALUES ('admin@example.com', '" + hash + "', 'Admin', 'User', 'ADMIN001');");
    }
}
