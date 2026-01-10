package app.fichier.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="contactez")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Contactez extends BaseAuditing{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 
    private String nom;
    private String email;
    private String message;
    private LocalDateTime dateCreation;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="utilisateur_id")
    private Utilisateur utilisateur;

}
