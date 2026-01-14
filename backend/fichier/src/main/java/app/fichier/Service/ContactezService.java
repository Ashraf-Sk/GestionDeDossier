package app.fichier.Service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.fichier.DTO.ContactezRequest;
import app.fichier.Entity.Contactez;
import app.fichier.Entity.Utilisateur;
import app.fichier.repositry.ContactezRepo;

@Service
public class ContactezService {
    @Autowired
    private ContactezRepo contactezRepo;
    public String creerContacter(ContactezRequest request, Utilisateur utilisateur){
        Contactez contactez = new Contactez();
        contactez.setEmail(utilisateur.getEmail());
        contactez.setNom(utilisateur.getNom());
        contactez.setMessage(request.message());
        contactez.setSujet(request.sujet());
        contactez.setDateCreation(LocalDateTime.now());
        contactez.setUtilisateur(utilisateur);
        contactezRepo.save(contactez);
        return "Contactez créé avec succès";
    }

}
