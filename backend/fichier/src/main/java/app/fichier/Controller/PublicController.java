package app.fichier.Controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.fichier.DTO.PublicDemande;
import app.fichier.Service.DemandeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class PublicController {
    private final DemandeService service;

    @GetMapping("/demandes")
    public ResponseEntity<Page<PublicDemande>> getPublicDemandes(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) String nomCommune
    ) {
        Pageable pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dateCreation"));
        Page<PublicDemande> result = service.listerDemandePublic(pageRequest, status, nomCommune, type);
        return ResponseEntity.ok().body(result);
    }
}
