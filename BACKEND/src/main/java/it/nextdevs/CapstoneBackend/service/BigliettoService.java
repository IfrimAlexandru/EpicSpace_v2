package it.nextdevs.CapstoneBackend.service;

import it.nextdevs.CapstoneBackend.dto.BigliettoDto;
import it.nextdevs.CapstoneBackend.model.Biglietto;
import it.nextdevs.CapstoneBackend.repository.BigliettoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BigliettoService {

    private final BigliettoRepository bigliettoRepository;
    private final EmailService emailService;

    @Autowired
    public BigliettoService(BigliettoRepository bigliettoRepository, EmailService emailService) {
        this.bigliettoRepository = bigliettoRepository;
        this.emailService = emailService;
    }

    public List<Biglietto> getAllBiglietti() {
        return bigliettoRepository.findAll();
    }

    public Optional<Biglietto> getBigliettoById(Integer id) {
        return bigliettoRepository.findById(id);
    }

    public Biglietto createBiglietto(BigliettoDto bigliettoDto) {
        Biglietto biglietto = mapDtoToEntity(bigliettoDto);
        return bigliettoRepository.save(biglietto);
    }

    public List<Biglietto> getBookedTripsByEmail(String email) {
        return bigliettoRepository.findByEmail(email);
    }

    public Optional<Biglietto> updateBiglietto(Integer id, BigliettoDto bigliettoDto) {
        return bigliettoRepository.findById(id).map(biglietto -> {
            biglietto.setBuyerName(bigliettoDto.getBuyerName());
            biglietto.setEmail(bigliettoDto.getEmail());
            biglietto.setPlanet(bigliettoDto.getPlanet());
            biglietto.setShip(bigliettoDto.getShip());
            biglietto.setSuit(bigliettoDto.getSuit());
            return bigliettoRepository.save(biglietto);
        });
    }

    public void deleteBiglietto(Integer id) {
        bigliettoRepository.deleteById(id);
    }

    private Biglietto mapDtoToEntity(BigliettoDto bigliettoDto) {
        Biglietto biglietto = new Biglietto();
        biglietto.setBuyerName(bigliettoDto.getBuyerName());
        biglietto.setEmail(bigliettoDto.getEmail());
        biglietto.setPlanet(bigliettoDto.getPlanet());
        biglietto.setShip(bigliettoDto.getShip());
        biglietto.setSuit(bigliettoDto.getSuit());
        biglietto.setShipImg(bigliettoDto.getShipImg());
        biglietto.setSuitImg(bigliettoDto.getSuitImg());
        biglietto.setPlanetImg(bigliettoDto.getPlanetImg());
        biglietto.setDataPrenotazione(bigliettoDto.getDataPrenotazione());
        biglietto.setUserId(bigliettoDto.getUserId()); // Imposta userId
        return biglietto;
    }
}
