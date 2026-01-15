package app.fichier.DTO;

import java.util.Map;

public record PublicStatsResponse(
    long total,
    long deposees,
    long enCours,
    long acceptees,
    long rejetees,
    Map<String, Long> parCommune,
    Map<String, Long> parType
) {
    // Version publique des statistiques (sans données sensibles)
}
