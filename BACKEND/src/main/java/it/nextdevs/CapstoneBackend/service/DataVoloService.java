package it.nextdevs.CapstoneBackend.service;

import it.nextdevs.CapstoneBackend.model.DataVolo;
import it.nextdevs.CapstoneBackend.repository.DataVoloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataVoloService {

    @Autowired
    private DataVoloRepository dataVoloRepository;

    public List<DataVolo> findAll() {
        return dataVoloRepository.findAll();
    }

    public DataVolo save(DataVolo dataVolo) {
        return dataVoloRepository.save(dataVolo);
    }

    public void deleteById(Integer id) {
        dataVoloRepository.deleteById(id);
    }
}
