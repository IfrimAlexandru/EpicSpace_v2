package it.nextdevs.CapstoneBackend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RecensioneDto {

    @NotNull(message = "Il testo della recensione non può essere nullo")
    @Size(max = 500, message = "Il testo della recensione non può superare i 500 caratteri")
    private String text;
}
