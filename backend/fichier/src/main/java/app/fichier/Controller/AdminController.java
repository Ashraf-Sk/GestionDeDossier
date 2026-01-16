package app.fichier.Controller;

import app.fichier.DTO.AdminDemande;
import app.fichier.DTO.AdminDetailsDemande;
import app.fichier.DTO.updateDemande;
import app.fichier.Service.DemandeService;
import app.fichier.Service.DocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class AdminController {
    private final DemandeService service;
    private final DocumentService documentService;
    @GetMapping("/demandes")
    public ResponseEntity<Page<AdminDemande>> getMethodName(@RequestParam(defaultValue ="0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(required = false) String status,
    @RequestParam(required = false) String type,
    @RequestParam(required = false) String nomCommune
    ) {
        Pageable pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dateCreation"));
        Page<AdminDemande> result = service.listerDemande(pageRequest, status, nomCommune, type);
        return ResponseEntity.ok().body(result);
        
    }
    @GetMapping("/details/{id}")
    public ResponseEntity<AdminDetailsDemande> MethodName(@PathVariable String id) {
        AdminDetailsDemande admin = service.getDetails(id);
        return ResponseEntity.ok().body(admin);
    }
    @PatchMapping("/demande/{id}/status")
    public ResponseEntity<AdminDetailsDemande> updateDetails(@PathVariable String id,  @RequestBody updateDemande demande){
        AdminDetailsDemande updateDemande = service.updateDemande(id, demande);
        return ResponseEntity.ok().body(updateDemande);
    }
    
    @GetMapping("/document/{documentId:.+}")
    public ResponseEntity<?> downloadDocument(@PathVariable String documentId) {
        try {
            log.info("[AdminController] Tentative de téléchargement du document (raw): {}", documentId);
            
            // Spring décode automatiquement le documentId depuis l'URL
            // Mais si le documentId contient des caractères spéciaux, il peut être double-encodé
            // On essaie de le décoder une fois de plus si nécessaire
            String cleanDocumentId = documentId;
            try {
                // Si le documentId contient des caractères encodés, le décoder
                if (documentId.contains("%")) {
                    cleanDocumentId = java.net.URLDecoder.decode(documentId, java.nio.charset.StandardCharsets.UTF_8);
                    log.info("[AdminController] DocumentId décodé: {}", cleanDocumentId);
                }
            } catch (Exception e) {
                log.warn("[AdminController] Impossible de décoder documentId, utilisation de l'original: {}", e.getMessage());
                cleanDocumentId = documentId;
            }
            
            log.info("[AdminController] DocumentId final utilisé: {}", cleanDocumentId);
            Resource resource = documentService.getDocument(cleanDocumentId);
            log.info("[AdminController] Document trouvé: {}", resource.getFilename());
            String contentType = MediaType.APPLICATION_PDF_VALUE; // Par défaut PDF
            
            // Détecter le type MIME à partir de l'extension du fichier
            try {
                String filename = resource.getFilename();
                if (filename != null) {
                    int lastDotIndex = filename.lastIndexOf('.');
                    if (lastDotIndex > 0 && lastDotIndex < filename.length() - 1) {
                        String extension = filename.substring(lastDotIndex + 1).toLowerCase();
                        switch (extension) {
                            case "pdf":
                                contentType = MediaType.APPLICATION_PDF_VALUE;
                                break;
                            case "jpg":
                            case "jpeg":
                                contentType = MediaType.IMAGE_JPEG_VALUE;
                                break;
                            case "png":
                                contentType = MediaType.IMAGE_PNG_VALUE;
                                break;
                            case "gif":
                                contentType = MediaType.IMAGE_GIF_VALUE;
                                break;
                            default:
                                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
                        }
                    }
                }
            } catch (Exception e) {
                // Si la détection échoue, utiliser PDF par défaut
            }
            
            log.info("[AdminController] Envoi du document avec Content-Type: {}", contentType);
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
        } catch (Exception e) {
            log.error("[AdminController] Erreur lors du téléchargement du document {}: {}", documentId, e.getMessage(), e);
            return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND)
                .contentType(MediaType.TEXT_PLAIN)
                .body("Document introuvable: " + e.getMessage());
        }
    }

}
