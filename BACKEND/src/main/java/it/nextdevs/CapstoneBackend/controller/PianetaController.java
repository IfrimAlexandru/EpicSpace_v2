package it.nextdevs.CapstoneBackend.controller;

import it.nextdevs.CapstoneBackend.model.Pianeta;
import it.nextdevs.CapstoneBackend.repository.PianetaRepository;
import it.nextdevs.CapstoneBackend.service.PianetaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/pianeti")
public class PianetaController {

    @Autowired
    private PianetaService pianetaService;

    @GetMapping
    public List<Pianeta> getAllPianeti() {
        return pianetaService.getAllPianeti();
    }

    @GetMapping("/{id}")
    public Optional<Pianeta> getPianetaById(@PathVariable Integer id) {
        return pianetaService.getPianetaById(id);
    }

    @PostMapping
    public Pianeta createPianeta(@RequestBody Pianeta pianeta) {
        return pianetaService.savePianeta(pianeta);
    }

    @DeleteMapping("/{id}")
    public void deletePianeta(@PathVariable Integer id) {
        pianetaService.deletePianeta(id);
    }
}