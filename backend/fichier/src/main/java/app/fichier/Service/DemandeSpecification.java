package app.fichier.Service;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import app.fichier.Entity.Demande;

@Component
public class DemandeSpecification {
    public static Specification<Demande> byStatus(String Status){
        return (root, query, cb) -> cb.equal(root.get("status"), Status);

    }
    public static Specification<Demande> byType(String type){
       // Mapping des codes vers les libellés complets utilisés dans la base de données
       String searchTerm = mapTypeCodeToLabel(type);
       
       // Recherche partielle (case-insensitive) pour permettre la recherche par code ou libellé
       return (root, query, cb) -> cb.like(
           cb.lower(root.get("typeAutorisation")), 
           "%" + searchTerm.toLowerCase() + "%"
       );
    }
    
    /**
     * Convertit un code de type (ex: "PERMIS_CONSTRUIRE") en terme de recherche
     * qui correspond aux libellés stockés dans la base de données
     */
    private static String mapTypeCodeToLabel(String typeCode) {
        if (typeCode == null || typeCode.trim().isEmpty()) {
            return "";
        }
        
        // Mapping des codes vers les libellés complets
        switch (typeCode.toUpperCase()) {
            case "PERMIS_CONSTRUIRE":
                return "Permis de construire";
            case "LOTISSEMENT":
                return "Lotissement";
            case "CERTIFICAT_CONFORMITE":
                return "Certificat de conformité";
            case "NOTE_RENSEIGNEMENTS":
                return "Note de renseignements";
            case "DEMOLITION":
                return "Démolition";
            case "DEROGATION":
                return "Dérogation";
            default:
                // Si ce n'est pas un code connu, utiliser le terme tel quel
                // Cela permet aussi de rechercher directement par libellé
                return typeCode;
        }
    }
    public static Specification<Demande> byCommune(String commune){
        // Recherche partielle (case-insensitive) pour permettre la recherche par nom partiel
        return (root, query, cb) -> cb.like(
            cb.lower(root.get("commune").get("nomCommune")), 
            "%" + commune.toLowerCase() + "%"
        );
    }

}
