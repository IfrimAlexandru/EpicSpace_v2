package it.nextdevs.CapstoneBackend.dto;

import it.nextdevs.CapstoneBackend.model.NaveSpaziale;
import it.nextdevs.CapstoneBackend.model.Pianeta;
import it.nextdevs.CapstoneBackend.model.TutaSpaziale;
import lombok.Data;

import java.util.List;

@Data
public class SpaceData {
    private List<Pianeta> pianeti;
    private List<TutaSpaziale> tuteSpaziali;
    private List<NaveSpaziale> naviSpaziali;


}
