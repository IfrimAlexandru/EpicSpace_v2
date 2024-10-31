package it.nextdevs.CapstoneBackend.service;

import it.nextdevs.CapstoneBackend.model.NaveSpaziale;
import it.nextdevs.CapstoneBackend.repository.NaveSpazialeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NaveSpazialeService {

    @Autowired
    private NaveSpazialeRepository naveSpazialeRepository;

    public List<NaveSpaziale> getAllNaviSpaziali() {
        return naveSpazialeRepository.findAll();
    }

    public Optional<NaveSpaziale> getNaveSpazialeById(Integer id) {
        return naveSpazialeRepository.findById(id);
    }

    public NaveSpaziale saveNaveSpaziale(NaveSpaziale naveSpaziale) {
        return naveSpazialeRepository.save(naveSpaziale);
    }

    public void deleteNaveSpaziale(Integer id) {
        naveSpazialeRepository.deleteById(id);
    }
}