package app.fichier.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import app.fichier.DTO.ClusterFeature;
import app.fichier.DTO.ClusterResponse;
import app.fichier.DTO.Geometry;
import app.fichier.DTO.Propreties;
import app.fichier.DTO.StatsResponse;
import app.fichier.Entity.Status;
import app.fichier.repositry.CommuneRepo;
import app.fichier.repositry.DemandeRepo;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final DemandeRepo demandeRepo;
    private final CommuneRepo communeRepo;
    private final ObjectMapper mapper;

    public StatsResponse getStats() {
        Map<String, Long> parCommune = communeRepo.countDemandesByCommune()
            .stream()
            .filter(arr -> arr[0] != null) // Filtrer les clés null
            .collect(Collectors.toMap(
                arr -> (String) arr[0],
                arr -> arr[1] == null ? 0L : ((Number) arr[1]).longValue()
            ));

        Map<String, Long> parType = demandeRepo.countByTypeAutorisation()
            .stream()
            .filter(arr -> arr[0] != null) // Filtrer les clés null
            .collect(Collectors.toMap(
                arr -> (String) arr[0],
                arr -> arr[1] == null ? 0L : ((Number) arr[1]).longValue()
            ));

        return new StatsResponse(
            demandeRepo.count(),
            demandeRepo.countByStatus(Status.AVIS_FAVORABLE),
            demandeRepo.countByStatus(Status.EN_COURS),
            demandeRepo.countByStatus(Status.ACCEPTEE),
            demandeRepo.countByStatus(Status.REJETE),
            parCommune,
            parType
        );
    }
    public ClusterResponse getCluster(){
        List<Object[]> rows = communeRepo.getCommuneClusterCentroid();
        List<ClusterFeature> features = rows.stream().map(this::fromCommune).toList();
        return new ClusterResponse("Features", features);
    }
    private ClusterFeature fromCommune(Object[] row){
        String code = (String) row[0];
        String nom = (String) row[1];
        Long count = ((Number) row[2]).longValue();
        String centroid = (String) row[3];
        Propreties props = new Propreties(nom, count);
        Geometry geom = new Geometry("Point", parse(centroid));
        return new ClusterFeature("Feature",props, geom
        );
    }
    private double[] parse(String json){
        try{
            JsonNode root = mapper.readTree(json);
            JsonNode coordinate = root.path("coordinates");
            if(coordinate.isArray() && coordinate.size() == 2){
                return new double[]{coordinate.get(0).asDouble(), coordinate.get(1).asDouble()};
            }
            return new double[]{0.0, 0.0};
        }
        catch( Exception e){
            return new double[]{0.0, 0.0};
        }
    }
  
}