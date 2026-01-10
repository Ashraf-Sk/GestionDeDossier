package app.fichier.repositry;

import java.util.List;

import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import app.fichier.Entity.Commune;

@Repository
public interface CommuneRepo extends JpaRepository<Commune, String>{
    @Query(value = """
        SELECT c.nom_commun, COUNT(d.id)
        FROM communes c
        LEFT JOIN demande d ON d.demande_commune = c.code_commu
        GROUP BY c.nom_commun
        ORDER BY COUNT(d.id) DESC
        """, nativeQuery = true)
    List<Object[]> countDemandesByCommune();
    

     @Query(value = """
             select c.* From communes c  where ST_Intersects(c.geom, :point) order by ST_Area(ST_Intersection(c.geom, :point)) desc limit 1
             """, nativeQuery = true)
     Commune calculateIntersection(@Param("point") Point point);

     @Query(value="""
             select c.code_commu, c.nom_commun, COUNT(d.id) as count,
             ST_AsGeoJSON(ST_Centroid(c.geom)) as centroid
                   from communes c left join demande d ON d.demande_commune = c.code_commu
                   where c.geom is not null
                   group by c.code_commu, c.nom_commun, c.geom
                   having count(d.id) > 0
                   order by count
             """, nativeQuery = true)
             List<Object[]> getCommuneClusterCentroid();
    

}
