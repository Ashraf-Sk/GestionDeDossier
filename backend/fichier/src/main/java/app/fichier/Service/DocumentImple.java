package app.fichier.Service;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import app.fichier.Exception.DocumentExceptionStorage;
import app.fichier.config.DirDocument;

@Service
public class DocumentImple implements DocumentService{

    private final Path documentPath;
    public DocumentImple(DirDocument dirDocument){
        this.documentPath = Paths.get(dirDocument.getDir()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.documentPath);
        } catch (Exception e) {
            throw new DocumentExceptionStorage("Erreur lors de la création du répertoire de stockage des documents", e);
        }
    }
    @Override
    public String uploadDocument(MultipartFile document) {
        if(document.isEmpty()){
            throw new DocumentExceptionStorage("Le fichier est vide" + document.getOriginalFilename());
        }
        String documentNom = document.getOriginalFilename();
        var documentDir = UUID.randomUUID() + documentNom;
        if(documentDir.contains("..")){
            throw new DocumentExceptionStorage("Le nom du fichier contient des caractères invalides" + documentNom);
        }
        try{
             Path documentLocation = this.documentPath.resolve(documentDir);
             Files.copy(document.getInputStream(), documentLocation, StandardCopyOption.REPLACE_EXISTING);
        }catch(IOException e){
            throw new DocumentExceptionStorage("Erreur lors de la sauvegarde du fichier" + documentNom, e);
        }
        return documentDir;

    }

    @Override
    public Resource getDocument(String documentId) {
        try {
            System.out.println("[DocumentImple] Recherche du document avec ID: " + documentId);
            System.out.println("[DocumentImple] Répertoire de base: " + this.documentPath);
            
            // Construire une liste de variantes à essayer
            java.util.List<String> variantsToTry = new java.util.ArrayList<>();
            
            // 1. Version originale
            variantsToTry.add(documentId);
            
            // 2. Décoder si le documentId contient des caractères encodés (%)
            if (documentId.contains("%")) {
                try {
                    String decoded = URLDecoder.decode(documentId, StandardCharsets.UTF_8);
                    variantsToTry.add(decoded);
                    System.out.println("[DocumentImple] Variant décodé ajouté: " + decoded);
                } catch (Exception e) {
                    System.out.println("[DocumentImple] Impossible de décoder: " + e.getMessage());
                }
            }
            
            // 3. Encoder les caractères spéciaux (espaces, parenthèses, etc.)
            try {
                // Encoder seulement les parties après le UUID (le nom du fichier)
                // Format attendu: UUIDnomFichier.pdf
                int uuidLength = 36; // UUID standard: 8-4-4-4-12 = 36 caractères
                if (documentId.length() > uuidLength) {
                    String uuid = documentId.substring(0, uuidLength);
                    String fileName = documentId.substring(uuidLength);
                    // Encoder le nom du fichier
                    String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8)
                        .replace("+", "%20"); // Remplacer + par %20 pour les espaces
                    String encoded = uuid + encodedFileName;
                    if (!variantsToTry.contains(encoded)) {
                        variantsToTry.add(encoded);
                        System.out.println("[DocumentImple] Variant encodé ajouté: " + encoded);
                    }
                }
            } catch (Exception e) {
                System.out.println("[DocumentImple] Impossible d'encoder: " + e.getMessage());
            }
            
            // Essayer chaque variant
            for (String variant : variantsToTry) {
                try {
                    var documentLocation = this.documentPath.resolve(variant).normalize();
                    System.out.println("[DocumentImple] Tentative avec: " + variant);
                    System.out.println("[DocumentImple] Chemin complet: " + documentLocation);
                    
                    // Vérifier que le chemin est dans le répertoire autorisé (sécurité)
                    if (!documentLocation.startsWith(this.documentPath.normalize())) {
                        System.err.println("[DocumentImple] Chemin hors du répertoire autorisé!");
                        continue;
                    }
                    
                    var resource = new UrlResource(documentLocation.toUri());
                    System.out.println("[DocumentImple] Resource existe: " + resource.exists());
                    System.out.println("[DocumentImple] Resource lisible: " + resource.isReadable());
                    
                    if(resource.isReadable() && resource.exists()){
                        System.out.println("[DocumentImple] ✓ Document trouvé avec variant: " + variant);
                        System.out.println("[DocumentImple] Nom du fichier: " + resource.getFilename());
                        return resource;
                    }
                } catch (Exception e) {
                    System.out.println("[DocumentImple] Variant " + variant + " a échoué: " + e.getMessage());
                    // Continuer avec le variant suivant
                }
            }
            
            // Si aucun variant n'a fonctionné, essayer de lister les fichiers pour debug
            System.err.println("[DocumentImple] ✗ Aucun variant n'a fonctionné. Liste des fichiers dans uploads:");
            try {
                Files.list(this.documentPath)
                    .filter(Files::isRegularFile)
                    .limit(10)
                    .forEach(path -> System.err.println("  - " + path.getFileName()));
            } catch (Exception e) {
                System.err.println("[DocumentImple] Impossible de lister les fichiers: " + e.getMessage());
            }
            
            throw new DocumentExceptionStorage("document pas trouvé avec aucun variant. DocumentId original: " + documentId);
            
        } catch(DocumentExceptionStorage e){
            // Re-lancer les exceptions DocumentExceptionStorage telles quelles
            throw e;
        } catch(Exception e){
            System.err.println("[DocumentImple] Erreur générale: " + e.getMessage());
            e.printStackTrace();
            throw new DocumentExceptionStorage("Erreur lors de la récupération du document: " + e.getMessage());
        }
    }
}