package app.fichier.DTO;

import java.util.List;

public record ClusterResponse(String type, List<ClusterFeature> feature) {
    public static ClusterResponse fromCluster(List<ClusterFeature> features){
        return new ClusterResponse("FeatureCollections", features);
    }

}
