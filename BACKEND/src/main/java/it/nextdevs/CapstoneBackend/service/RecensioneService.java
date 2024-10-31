package it.nextdevs.CapstoneBackend.service;

import it.nextdevs.CapstoneBackend.model.Recensione;
import it.nextdevs.CapstoneBackend.model.User;
import it.nextdevs.CapstoneBackend.repository.RecensioneRepository;
import it.nextdevs.CapstoneBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecensioneService {

    @Autowired
    private RecensioneRepository recensioneRepository;

    @Autowired
    private UserRepository userRepository;

    public Recensione saveRecensione(String text, Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Recensione recensione = new Recensione();
        recensione.setText(text);
        recensione.setUser(user);
        return recensioneRepository.save(recensione);
    }

    public List<Recensione> getAllRecensioni() {
        return recensioneRepository.findAll();
    }

    public void deleteRecensione(Integer id) {
        recensioneRepository.deleteById(id);
    }
}
