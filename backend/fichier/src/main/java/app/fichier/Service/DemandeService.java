package app.fichier.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import app.fichier.DTO.AdminDemande;
import app.fichier.DTO.AdminDetailsDemande;
import app.fichier.DTO.DemandeReponse;
import app.fichier.DTO.DemandeRequete;
import app.fichier.DTO.PublicDemande;
import app.fichier.Entity.Commune;
import app.fichier.Entity.Demande;
import app.fichier.Entity.Document;
import app.fichier.Entity.Status;
import app.fichier.Entity.Utilisateur;
import app.fichier.repositry.CommuneRepo;
import app.fichier.repositry.DemandeRepo;
import app.fichier.repositry.DocumentRepo;
import app.fichier.repositry.UtilisateurRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import app.fichier.DTO.DocumentResponse;
import app.fichier.DTO.documentAdmin;
import app.fichier.DTO.updateDemande;

@Service
@RequiredArgsConstructor
@Slf4j
public class DemandeService {
     private final DocumentRepo documentRepo;
     private final DemandeRepo demandeRepo;
     private final DocumentImple documentService;
     private final DemandeSpecification specification;
     private final CommuneRepo communeRepo;
     private final UtilisateurRepo utilisateurRepo;

     @Transactional
     public DemandeReponse creerDemande(DemandeRequete requete, Authentication auth){
      if(auth == null || !auth.isAuthenticated()){ throw new RuntimeException("utilisateur doit etre authentifié");}
      Demande demande = new Demande();
      demande.setUtilisateur(utilisateurRepo.findByEmail(auth.getName()).get());
      demande.setId(genererIdDemande());
      demande.setCin(requete.cin());
      demande.setTypeAutorisation(requete.typeAutorisation());
      demande.setStatus(Status.EN_COURS);
      GeometryFactory factory = new GeometryFactory(new PrecisionModel(), 4326);
      Point point = factory.createPoint(new Coordinate(requete.longitude(), requete.latitude()));
      
      try {
          Commune commune = communeRepo.calculateIntersection(point);
          demande.setCommune(commune);
      } catch (Exception e) {
          log.warn("Impossible de trouver la commune pour les coordonnées ({}, {}): {}", 
                   requete.longitude(), requete.latitude(), e.getMessage());
          demande.setCommune(null);
      }
      demande.setPointGemotrique(point);
      demandeRepo.saveAndFlush(demande);
      
      // Recharger la demande avec toutes ses relations pour s'assurer que la commune est chargée
      demande = demandeRepo.findById(demande.getId()).orElse(demande);
      
      // Forcer le chargement de la commune si elle existe
      if (demande.getCommune() != null) {
        // Accéder à la commune pour forcer le chargement
        String codeCommune = demande.getCommune().getCodeCommune();
        log.debug("Code commune chargé: {}", codeCommune);
      }
      
      // Log pour diagnostiquer le problème de commune
      log.info("=== CREATION DEMANDE - Demande créée: {}", demande.getId());
      if (demande.getCommune() != null) {
        log.info("=== Commune trouvée - Code: {}, Nom: {}", 
                 demande.getCommune().getCodeCommune(), 
                 demande.getCommune().getNomCommune());
      } else {
        log.warn("=== ATTENTION: La commune est NULL pour la demande {} - Vérifiez que demande_commune correspond à un code_commu existant", demande.getId());
      }
      
      List<DocumentResponse> documents = new ArrayList<>();
      List<MultipartFile> files = requete.fichiers();
      if(files != null && !files.isEmpty()){
        for(MultipartFile fichier : files){
            Document doc = new Document();
            String documentId = documentService.uploadDocument(fichier);
            doc.setId(documentId);
            doc.setNomFichier(fichier.getOriginalFilename());
            doc.setDemande(demande);
            documentRepo.save(doc);
            documents.add(
                new DocumentResponse(
                    documentId,
                    fichier.getOriginalFilename()
                )
            );
        }
      }
    
      String nomCommune = "Non déterminée";
      if (demande.getCommune() != null && demande.getCommune().getNomCommune() != null) {
        nomCommune = demande.getCommune().getNomCommune();
      } else {
        log.warn("Commune ou nomCommune est null pour la demande {}", demande.getId());
      }
      
      return new DemandeReponse(
        demande.getStatus().toString(),
        demande.getId(), 
        demande.getDateCreation(),
        documents,
        null,
        demande.getUtilisateur().getNom(),
        demande.getUtilisateur().getPrenom(),
        nomCommune,
        demande.getPointGemotrique().getY(),
        demande.getPointGemotrique().getX(),
        demande.getCin(),
        demande.getTypeAutorisation()
      );
     }

    

     private String genererIdDemande() {
       return "DEM" + UUID.randomUUID().toString().substring(0,8);
    }


    public DemandeReponse trackDemnande(String id, String cin, Utilisateur utilisateur){
      Demande demande = demandeRepo.findByIdAndCinAndUtilisateur(id, cin, utilisateur).get();
      
      // Log pour diagnostiquer le problème de commune
      log.info("=== TRACK DEMANDE - Demande trouvée: {}", demande.getId());
      if (demande.getCommune() != null) {
        log.info("=== Commune trouvée - Code: {}, Nom: {}", 
                 demande.getCommune().getCodeCommune(), 
                 demande.getCommune().getNomCommune());
      } else {
        log.warn("=== ATTENTION: La commune est NULL pour la demande {}", demande.getId());
      }
      
        List<DocumentResponse> documents = demande.getDocuments()
        .stream()
        .map(document -> new DocumentResponse(document.getId(), document.getNomFichier()))
        .collect(Collectors.toList());
      
      String nomCommune = "Non déterminée";
      if (demande.getCommune() != null && demande.getCommune().getNomCommune() != null) {
        nomCommune = demande.getCommune().getNomCommune();
      } else {
        log.warn("Commune ou nomCommune est null pour la demande {}", demande.getId());
      }
      
      return new DemandeReponse(
        demande.getStatus().toString(),
        demande.getId(),
        demande.getDateCreation(),
        documents,
        demande.getMotifRejet(),
        demande.getUtilisateur().getNom(),
        demande.getUtilisateur().getPrenom(),
        nomCommune,
        demande.getPointGemotrique().getY(),
        demande.getPointGemotrique().getX(),
        demande.getCin(),
        demande.getTypeAutorisation()
      );
    }
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdminDemande> getAllDemandes(){
      List<Demande> demandes = demandeRepo.findAll();
      
     return demandes.stream().map(demande -> new AdminDemande(
         demande.getId(), 
         demande.getStatus() != null ? demande.getStatus().toString() : null, 
         demande.getDateCreation(), 
         todocumentAdmin(demande.getDocuments()), 
         demande.getCin(), 
         demande.getTypeAutorisation(),
         demande.getMotifRejet()
     )).collect(Collectors.toList());
    }
    
    private List<documentAdmin> todocumentAdmin(List<Document> documents) {
      if (documents == null || documents.isEmpty()) {
        return new ArrayList<>();
      }
      return documents.stream()
          .map(document -> new documentAdmin(document.getId(), document.getNomFichier()))
          .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public Page<AdminDemande> listerDemande(
      Pageable pageable,
      String statut,
      String commune,
      String type) {

  Specification<Demande> spec = null;

  // Appliquer les filtres seulement s'ils ne sont pas null et pas vides
  if (statut != null && !statut.trim().isEmpty()) {
    spec = DemandeSpecification.byStatus(statut.trim());
  }
  if (commune != null && !commune.trim().isEmpty()) {
    spec = (spec == null) ? DemandeSpecification.byCommune(commune.trim()) : spec.and(DemandeSpecification.byCommune(commune.trim()));
  }
  if (type != null && !type.trim().isEmpty()) {
    spec = (spec == null) ? DemandeSpecification.byType(type.trim()) : spec.and(DemandeSpecification.byType(type.trim()));
  }

  return (spec == null ? demandeRepo.findAll(pageable) : demandeRepo.findAll(spec, pageable))
          .map(demande -> new AdminDemande(
              demande.getId(), 
              demande.getStatus() != null ? demande.getStatus().toString() : null, 
              demande.getDateCreation(), 
              todocumentAdmin(demande.getDocuments()), 
              demande.getCin(), 
              demande.getTypeAutorisation(),
              demande.getMotifRejet()
          ));
}

public Page<PublicDemande> listerDemandePublic(
      Pageable pageable,
      String statut,
      String commune,
      String type) {

  Specification<Demande> spec = null;

  // Appliquer les filtres seulement s'ils ne sont pas null et pas vides
  if (statut != null && !statut.trim().isEmpty()) {
    spec = DemandeSpecification.byStatus(statut.trim());
  }
  if (commune != null && !commune.trim().isEmpty()) {
    spec = (spec == null) ? DemandeSpecification.byCommune(commune.trim()) : spec.and(DemandeSpecification.byCommune(commune.trim()));
  }
  if (type != null && !type.trim().isEmpty()) {
    spec = (spec == null) ? DemandeSpecification.byType(type.trim()) : spec.and(DemandeSpecification.byType(type.trim()));
  }

  return (spec == null ? demandeRepo.findAll(pageable) : demandeRepo.findAll(spec, pageable))
          .map(demande -> {
            String nomCommune = "Non déterminée";
            if (demande.getCommune() != null && demande.getCommune().getNomCommune() != null) {
              nomCommune = demande.getCommune().getNomCommune();
            }
            return new PublicDemande(
                demande.getId(), 
                demande.getStatus() != null ? demande.getStatus().toString() : null, 
                demande.getDateCreation(), 
                demande.getTypeAutorisation(),
                nomCommune
            );
          });
}

  public AdminDetailsDemande getDetails(String id){
     Demande demande = demandeRepo.findById(id).orElseThrow(()-> new EntityNotFoundException("demande n'est pas trouvé"));
     return new AdminDetailsDemande(
         demande.getId(),
         demande.getCin(),
         demande.getDateCreation(),
         todocumentAdmin(demande.getDocuments()),
         demande.getStatus() != null ? demande.getStatus().toString() : null,
         demande.getTypeAutorisation(),
         demande.getMotifRejet(),
         demande.getCommune() != null ? demande.getCommune().getNomCommune() : null
     );
  }
  @Transactional
  @PreAuthorize("hasRole('ADMIN')")
  public AdminDetailsDemande updateDemande(String id, updateDemande updateRequest) {
    Demande demande = demandeRepo.findById(id).orElseThrow(()-> new EntityNotFoundException("demande n'est pas trouvé")); 
    demande.setStatus(updateRequest.status());
    
    if(updateRequest.status() == Status.REJETE){
      if(updateRequest.motifRejet() == null || updateRequest.motifRejet().trim().isEmpty()){
        throw new IllegalArgumentException("le motif de rejet est obligatoire");
      }
      demande.setMotifRejet(updateRequest.motifRejet().trim());
    } else {
      demande.setMotifRejet(null);
    }
    
    demandeRepo.saveAndFlush(demande);
    
    return new AdminDetailsDemande(
        demande.getId(),
        demande.getCin(),
        demande.getDateCreation(),
        todocumentAdmin(demande.getDocuments()),
        demande.getStatus() != null ? demande.getStatus().toString() : null,
        demande.getTypeAutorisation(),
        demande.getMotifRejet(),
        demande.getCommune() != null ? demande.getCommune().getNomCommune() : null
    );
  }

}
