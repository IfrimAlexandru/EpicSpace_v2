package it.nextdevs.CapstoneBackend.controller;

import it.nextdevs.CapstoneBackend.model.NaveSpaziale;
import it.nextdevs.CapstoneBackend.repository.NaveSpazialeRepository;
import it.nextdevs.CapstoneBackend.service.NaveSpazialeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/navi_spaziali")
public class NaveSpazialeController {

    @Autowired
    private NaveSpazialeService naveSpazialeService;

    @GetMapping
    public List<NaveSpaziale> getAllNaviSpaziali() {
        return naveSpazialeService.getAllNaviSpaziali();
    }

    @GetMapping("/{id}")
    public Optional<NaveSpaziale> getNaveSpazialeById(@PathVariable Integer id) {
        return naveSpazialeService.getNaveSpazialeById(id);
    }

    @PostMapping
    public NaveSpaziale createNaveSpaziale(@RequestBody NaveSpaziale naveSpaziale) {
        return naveSpazialeService.saveNaveSpaziale(naveSpaziale);
    }

    @PatchMapping("/{id}")
    public NaveSpaziale updateNaveSpaziale(@PathVariable Integer id, @RequestBody NaveSpaziale naveSpaziale) {
        naveSpaziale.setId(id);
        return naveSpazialeService.saveNaveSpaziale(naveSpaziale);
    }

    @DeleteMapping("/{id}")
    public void deleteNaveSpaziale(@PathVariable Integer id) {
        naveSpazialeService.deleteNaveSpaziale(id);
    }
}