package app.fichier.repositry;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import app.fichier.Entity.Contactez;
import app.fichier.Entity.Utilisateur;

public interface ContactezRepo extends JpaRepository<Contactez, Long>{
    List<Contactez> findByUtilisateur(Utilisateur utilisateur);

}
