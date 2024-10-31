package it.nextdevs.CapstoneBackend.service;

import it.nextdevs.CapstoneBackend.model.TutaSpaziale;
import it.nextdevs.CapstoneBackend.repository.TutaSpazialeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TutaSpazialeService {

    @Autowired
    private TutaSpazialeRepository tutaSpazialeRepository;

    public List<TutaSpaziale> getAllTuteSpaziali() {
        return tutaSpazialeRepository.findAll();
    }

    public Optional<TutaSpaziale> getTutaSpazialeById(Integer id) {
        return tutaSpazialeRepository.findById(id);
    }

    public TutaSpaziale saveTutaSpaziale(TutaSpaziale tutaSpaziale) {
        return tutaSpazialeRepository.save(tutaSpaziale);
    }

    public void deleteTutaSpaziale(Integer id) {
        tutaSpazialeRepository.deleteById(id);
    }
}
