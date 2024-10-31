package it.nextdevs.CapstoneBackend.repository;

import it.nextdevs.CapstoneBackend.model.Pianeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PianetaRepository extends JpaRepository<Pianeta, Integer> {
    boolean existsByNome(String nome);
}
