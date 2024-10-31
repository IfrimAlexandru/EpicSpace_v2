package it.nextdevs.CapstoneBackend.dto;

import lombok.Data;

import java.time.LocalDate;


@Data
public class BigliettoDto {
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
