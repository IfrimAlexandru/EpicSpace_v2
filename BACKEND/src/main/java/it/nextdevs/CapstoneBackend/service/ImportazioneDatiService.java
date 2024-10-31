package it.nextdevs.CapstoneBackend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.nextdevs.CapstoneBackend.model.NaveSpaziale;
import it.nextdevs.CapstoneBackend.model.Pianeta;
import it.nextdevs.CapstoneBackend.model.TutaSpaziale;
import it.nextdevs.CapstoneBackend.repository.NaveSpazialeRepository;
import it.nextdevs.CapstoneBackend.repository.PianetaRepository;
import it.nextdevs.CapstoneBackend.repository.TutaSpazialeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class ImportazioneDatiService {

    @Autowired
    private NaveSpazialeRepository naveSpazialeRepository;

    @Autowired
    private PianetaRepository pianetaRepository;

    @Autowired
    private TutaSpazialeRepository tutaSpazialeRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public void importaNaviSpaziali(String json) throws IOException {
        List<NaveSpaziale> naviSpaziali = objectMapper.readValue(json, new TypeReference<List<NaveSpaziale>>() {});
        naviSpaziali = naviSpaziali.stream().map(naveSpaziale -> {
            NaveSpaziale naveSpazialeoff = new NaveSpaziale();
            naveSpazialeoff.setNome(naveSpaziale.getNome());
            naveSpazialeoff.setDescrizione(naveSpaziale.getDescrizione());
            naveSpazialeoff.setProduttore(naveSpaziale.getProduttore());
            naveSpazialeoff.setCapacitaEquipaggio(naveSpaziale.getCapacitaEquipaggio());

            return naveSpazialeoff;

        }).toList();
        naveSpazialeRepository.saveAll(naviSpaziali);
    }

    public void importaPianeti(String json) throws IOException {
        List<Pianeta> pianeti = objectMapper.readValue(json, new TypeReference<List<Pianeta>>() {});
        pianeti = pianeti.stream().map(pianeta -> {
            Pianeta pianetaOff = new Pianeta();
            pianetaOff.setNome(pianeta.getNome());
            pianetaOff.setDescrizione(pianeta.getDescrizione());
            pianetaOff.setDistanzaDallaTerraKm(pianeta.getDistanzaDallaTerraKm());
            pianetaOff.setTempoDiVoloOre(pianeta.getTempoDiVoloOre());
            pianetaOff.setPrezzoDelVoloEuro(pianeta.getPrezzoDelVoloEuro());

            return pianetaOff;

        }).toList();
        System.err.println(pianeti);
        pianetaRepository.saveAll(pianeti);
    }

    public void importaTuteSpaziali(String json) throws IOException {
        List<TutaSpaziale> tuteSpaziali = objectMapper.readValue(json, new TypeReference<List<TutaSpaziale>>() {});
        tuteSpaziali = tuteSpaziali.stream().map(tutaSpaziale -> {
            TutaSpaziale tutaSpazialeOff = new TutaSpaziale();
            tutaSpazialeOff.setNome(tutaSpaziale.getNome());
            tutaSpazialeOff.setDescrizione(tutaSpaziale.getDescrizione());

            return tutaSpazialeOff;

        }).toList();
        tutaSpazialeRepository.saveAll(tuteSpaziali);
    }
}