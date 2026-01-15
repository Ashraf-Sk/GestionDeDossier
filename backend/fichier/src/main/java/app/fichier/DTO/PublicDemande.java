package app.fichier.DTO;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

public record PublicDemande(
    String id,
    String status,
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime temps,
    String typeAutorization,
    String nomCommune
) {
    // Version publique d'une demande (sans CIN, documents, motif)
}
