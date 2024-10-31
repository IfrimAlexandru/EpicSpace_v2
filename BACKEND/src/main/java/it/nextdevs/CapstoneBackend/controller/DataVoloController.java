package it.nextdevs.CapstoneBackend.controller;

import it.nextdevs.CapstoneBackend.model.DataVolo;
import it.nextdevs.CapstoneBackend.service.DataVoloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DataVoloController {

    @Autowired
    private DataVoloService dataVoloService;

    @GetMapping("/dates")
    public List<DataVolo> getAllDates() {
        return dataVoloService.findAll();
    }

    @PostMapping("/dates")
    public DataVolo createDate(@RequestBody DataVolo dataDisponibile) {
        return dataVoloService.save(dataDisponibile);
    }

    @PutMapping("/dates/{id}")
    public DataVolo updateDate(@PathVariable Integer id, @RequestBody DataVolo dataDisponibile) {
        dataDisponibile.setId(id);
        return dataVoloService.save(dataDisponibile);
    }

    @DeleteMapping("/dates/{id}")
    public void deleteDate(@PathVariable Integer id) {
        dataVoloService.deleteById(id);
    }
}