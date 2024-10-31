package it.nextdevs.CapstoneBackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Pianeta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;
    private Long tempoDiVoloOre;
    private Long distanzaDallaTerraKm;
    private String descrizione;
    private Long prezzoDelVoloEuro;
    private String immagine;
}
