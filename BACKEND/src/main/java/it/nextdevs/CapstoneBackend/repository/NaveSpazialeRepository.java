package it.nextdevs.CapstoneBackend.repository;

import it.nextdevs.CapstoneBackend.model.NaveSpaziale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NaveSpazialeRepository extends JpaRepository<NaveSpaziale, Integer> {
    boolean existsByNome(String nome);
}
