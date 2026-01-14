package app.fichier.Service;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import app.fichier.DTO.LoginRequete;
import app.fichier.DTO.RegisterRequete;
import app.fichier.Entity.Utilisateur;
import app.fichier.Utils.JwtUtils;
import app.fichier.repositry.RoleRepo;
import app.fichier.repositry.UtilisateurRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class AuthenticationManagerService {

    private final RoleRepo roleRepo;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UtilisateurRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    
    public String generateTokenAfterAutentication(LoginRequete requete){
        log.debug("Début de l'authentification pour l'email: {}", requete.email());
        try {
            Authentication authentication = authenticationManager.authenticate(new 
                UsernamePasswordAuthenticationToken(requete.email(), requete.password()) 
            );
            log.debug("Authentification réussie pour l'email: {}, isAuthenticated: {}", 
                    requete.email(), authentication.isAuthenticated());
            if(authentication.isAuthenticated()){
                SecurityContextHolder.getContext().setAuthentication(authentication);
                String token = jwtUtils.generateToken(authentication, 3600000L);
                log.debug("Token JWT généré avec succès pour l'email: {}", requete.email());
                return token;
            }
            log.warn("Authentification échouée pour l'email: {} - isAuthenticated = false", requete.email());
            return "";
        } catch (Exception e) {
            log.error("Erreur lors de l'authentification pour l'email: {} - Exception: {} - Message: {}", 
                    requete.email(), e.getClass().getSimpleName(), e.getMessage(), e);
            throw e;
        }
    }
    
    public String createUser(RegisterRequete requete){
        log.debug("Début de la création d'utilisateur pour l'email: {}", requete.email());
        try {
            // Vérifier si l'email existe déjà
            if(userRepo.findByEmail(requete.email()).isPresent()){
                log.warn("Tentative d'inscription avec un email déjà existant: {}", requete.email());
                throw new IllegalArgumentException("Email déjà utilisé");
            }
            log.debug("Email {} n'existe pas encore, vérification du rôle ROLE_USER", requete.email());
            
            // Vérifier si le rôle ROLE_USER existe
            var roleUser = roleRepo.findByRole("ROLE_USER")
                .orElseThrow(() -> {
                    log.error("Le rôle ROLE_USER n'existe pas dans la base de données");
                    return new IllegalStateException("Rôle ROLE_USER n'existe pas dans la base de données");
                });
            log.debug("Rôle ROLE_USER trouvé avec succès");
            
            // Créer l'utilisateur
            Utilisateur utilisateur = new Utilisateur();
            utilisateur.setEmail(requete.email());
            utilisateur.setNom(requete.nom());
            utilisateur.setPrenom(requete.prenom());
            utilisateur.setCin(requete.cin());
            String encodedPassword = passwordEncoder.encode(requete.password());
            utilisateur.setPassword(encodedPassword);
            utilisateur.setRoles(List.of(roleUser));
            
            log.debug("Sauvegarde de l'utilisateur dans la base de données pour l'email: {}", requete.email());
            userRepo.save(utilisateur);
            log.info("Utilisateur créé avec succès pour l'email: {}", requete.email());
            return "Utilisateur créé avec succès";
        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("Erreur de validation lors de la création d'utilisateur pour l'email: {} - Exception: {} - Message: {}", 
                    requete.email(), e.getClass().getSimpleName(), e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Erreur inattendue lors de la création d'utilisateur pour l'email: {} - Exception: {} - Message: {}", 
                    requete.email(), e.getClass().getSimpleName(), e.getMessage(), e);
            throw e;
        }
    }

}
