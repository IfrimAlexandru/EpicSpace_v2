package it.nextdevs.CapstoneBackend.repository;

import it.nextdevs.CapstoneBackend.model.TutaSpaziale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TutaSpazialeRepository extends JpaRepository<TutaSpaziale, Integer> {
    boolean existsByNome(String nome);
}
