package it.nextdevs.CapstoneBackend.controller;

import it.nextdevs.CapstoneBackend.model.TutaSpaziale;
import it.nextdevs.CapstoneBackend.repository.TutaSpazialeRepository;
import it.nextdevs.CapstoneBackend.service.TutaSpazialeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tute_spaziali")
public class TutaSpazialeController {

    @Autowired
    private TutaSpazialeService tutaSpazialeService;

    @GetMapping
    public List<TutaSpaziale> getAllTuteSpaziali() {
        return tutaSpazialeService.getAllTuteSpaziali();
    }

    @GetMapping("/{id}")
    public Optional<TutaSpaziale> getTutaSpazialeById(@PathVariable Integer id) {
        return tutaSpazialeService.getTutaSpazialeById(id);
    }

    @PostMapping
    public TutaSpaziale createTutaSpaziale(@RequestBody TutaSpaziale tutaSpaziale) {
        return tutaSpazialeService.saveTutaSpaziale(tutaSpaziale);
    }

    @PatchMapping("/{id}")
    public TutaSpaziale updateTutaSpaziale(@PathVariable Integer id, @RequestBody TutaSpaziale tutaSpaziale) {
        tutaSpaziale.setId(id);
        return tutaSpazialeService.saveTutaSpaziale(tutaSpaziale);
    }

    @DeleteMapping("/{id}")
    public void deleteTutaSpaziale(@PathVariable Integer id) {
        tutaSpazialeService.deleteTutaSpaziale(id);
    }


}
