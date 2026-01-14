package app.fichier.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.fichier.DTO.JwtReponse;
import app.fichier.DTO.LoginRequete;
import app.fichier.DTO.RegisterRequete;
import app.fichier.Service.AuthenticationManagerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class LoginController {
    private final AuthenticationManagerService service;
    
    @PostMapping("/login")
    public ResponseEntity<JwtReponse> login(@RequestBody LoginRequete requete) {
        log.info("Tentative de connexion pour l'email: {}", requete.email());
        try {
            String token = service.generateTokenAfterAutentication(requete);
            log.info("Connexion réussie pour l'email: {}", requete.email());
            var reponse = new JwtReponse(token);
            return ResponseEntity.ok().body(reponse);
        } catch (Exception e) {
            log.error("Erreur lors de la connexion pour l'email: {} - Erreur: {}", requete.email(), e.getMessage(), e);
            throw e;
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequete entity) {
        log.info("Tentative d'inscription pour l'email: {}, nom: {}, prenom: {}", 
                entity.email(), entity.nom(), entity.prenom());
        try {
            String savedUtilisateur = service.createUser(entity);
            log.info("Inscription réussie pour l'email: {}", entity.email());
            return ResponseEntity.ok(savedUtilisateur);
        } catch (Exception e) {
            log.error("Erreur lors de l'inscription pour l'email: {} - Erreur: {}", entity.email(), e.getMessage(), e);
            throw e;
        }
    }
    
}
