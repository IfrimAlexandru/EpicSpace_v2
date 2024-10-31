package it.nextdevs.CapstoneBackend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Recensione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 500)
    private String text;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


}

