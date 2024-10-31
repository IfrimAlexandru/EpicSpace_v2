package it.nextdevs.CapstoneBackend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class NaveSpaziale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;
    private String produttore;
    private Integer capacitaEquipaggio;
    private String descrizione;
    @Column(name = "immagine")
    private String immagine;
}
