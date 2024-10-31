package it.nextdevs.CapstoneBackend.controller;

import it.nextdevs.CapstoneBackend.dto.BigliettoDto;
import it.nextdevs.CapstoneBackend.model.Biglietto;
import it.nextdevs.CapstoneBackend.service.BigliettoService;
import it.nextdevs.CapstoneBackend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/biglietti")
public class BigliettoController {

    @Autowired
    private BigliettoService bigliettoService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/submit-order")
    public Integer submitOrder(@RequestBody BigliettoDto bigliettoDto) {
        Biglietto biglietto = bigliettoService.createBiglietto(bigliettoDto);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        String formattedDate = biglietto.getDataPrenotazione().format(formatter);

        // Log the shipImg value to verify it
        System.out.println("Ship Image URL: " + bigliettoDto.getShipImg());

        return emailService.sendTicketEmail(
                biglietto.getEmail(),
                biglietto.getBuyerName(),
                biglietto.getPlanet(),
                biglietto.getShip(),
                biglietto.getSuit(),
                formattedDate,
                bigliettoDto.getShipImg(),
                bigliettoDto.getSuitImg(),
                bigliettoDto.getPlanetImg()
        );
    }

    @GetMapping("/booked-trips-by-email/{email}")
    public List<Biglietto> getBookedTripsByEmail(@PathVariable String email) {
        return bigliettoService.getBookedTripsByEmail(email);
    }
}
