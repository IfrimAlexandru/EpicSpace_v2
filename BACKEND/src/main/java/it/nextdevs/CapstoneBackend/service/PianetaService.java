package it.nextdevs.CapstoneBackend.service;

import it.nextdevs.CapstoneBackend.model.Pianeta;
import it.nextdevs.CapstoneBackend.repository.PianetaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class PianetaService {

        @Autowired
        private PianetaRepository pianetaRepository;

        public List<Pianeta> getAllPianeti() {
            return pianetaRepository.findAll();
        }

        public Optional<Pianeta> getPianetaById(Integer id) {
            return pianetaRepository.findById(id);
        }

        public Pianeta savePianeta(Pianeta pianeta) {
            return pianetaRepository.save(pianeta);
        }

        public void deletePianeta(Integer id) {
            pianetaRepository.deleteById(id);
        }
    }

