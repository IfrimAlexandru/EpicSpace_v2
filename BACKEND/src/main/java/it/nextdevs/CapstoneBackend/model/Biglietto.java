package it.nextdevs.CapstoneBackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Biglietto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String userId;
    private String buyerName;
    private String email;
    private String planet;
    private String ship;
    private String suit;
    private LocalDate dataPrenotazione;
    private String shipImg;
    private String planetImg;
    private String suitImg;


}
