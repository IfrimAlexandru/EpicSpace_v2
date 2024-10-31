package it.nextdevs.CapstoneBackend.init;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.nextdevs.CapstoneBackend.dto.SpaceData;
import it.nextdevs.CapstoneBackend.model.NaveSpaziale;
import it.nextdevs.CapstoneBackend.model.Pianeta;
import it.nextdevs.CapstoneBackend.model.TutaSpaziale;
import it.nextdevs.CapstoneBackend.repository.NaveSpazialeRepository;
import it.nextdevs.CapstoneBackend.repository.PianetaRepository;
import it.nextdevs.CapstoneBackend.repository.TutaSpazialeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private PianetaRepository pianetaRepository;

    @Autowired
    private TutaSpazialeRepository tutaSpazialeRepository;

    @Autowired
    private NaveSpazialeRepository naveSpazialeRepository;

    @Override
    public void run(String... args) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            SpaceData spaceData = objectMapper.readValue(new File("src/main/resources/data.json"), SpaceData.class);

            // Verifica e salva i pianeti
            List<Pianeta> pianeti = spaceData.getPianeti();
            for (Pianeta pianeta : pianeti) {
                if (!pianetaRepository.existsByNome(pianeta.getNome())) {
                    pianetaRepository.save(pianeta);
                }
            }

            // Verifica e salva le tute spaziali
            List<TutaSpaziale> tuteSpaziali = spaceData.getTuteSpaziali();
            for (TutaSpaziale tuta : tuteSpaziali) {
                if (!tutaSpazialeRepository.existsByNome(tuta.getNome())) {
                    tutaSpazialeRepository.save(tuta);
                }
            }

            // Verifica e salva le navi spaziali
            List<NaveSpaziale> naviSpaziali = spaceData.getNaviSpaziali();
            for (NaveSpaziale nave : naviSpaziali) {
                if (!naveSpazialeRepository.existsByNome(nave.getNome())) {
                    naveSpazialeRepository.save(nave);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
