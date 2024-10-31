package it.nextdevs.CapstoneBackend.controller;

import it.nextdevs.CapstoneBackend.model.NaveSpaziale;
import it.nextdevs.CapstoneBackend.model.Pianeta;
import it.nextdevs.CapstoneBackend.model.TutaSpaziale;
import it.nextdevs.CapstoneBackend.model.User;
import it.nextdevs.CapstoneBackend.repository.NaveSpazialeRepository;
import it.nextdevs.CapstoneBackend.repository.PianetaRepository;
import it.nextdevs.CapstoneBackend.repository.TutaSpazialeRepository;
import it.nextdevs.CapstoneBackend.repository.UserRepository;
import it.nextdevs.CapstoneBackend.service.FileUploadService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class FileUploadController {

    @Autowired
    private PianetaRepository pianetaRepository;

    @Autowired
    private NaveSpazialeRepository naveSpazialeRepository;

    @Autowired
    private TutaSpazialeRepository tutaSpazialeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileUploadService fileUploadService;

    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PatchMapping(value = "/uploadPianetaImage/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadPianetaImage(@PathVariable Integer id, @RequestParam("file") MultipartFile file) throws IOException {
        Optional<Pianeta> pianetaOptional = pianetaRepository.findById(id);

        if (pianetaOptional.isPresent()) {
            String url = fileUploadService.uploadFile(file);
            Pianeta pianeta = pianetaOptional.get();
            pianeta.setImmagine(url);
            pianetaRepository.save(pianeta);

            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PatchMapping(value = "/uploadNaveSpazialeImage/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadNaveSpazialeImage(@PathVariable Integer id, @RequestParam("file") MultipartFile file) throws IOException {
        logger.info("Received request to upload image for NaveSpaziale ID: {}", id);

        Optional<NaveSpaziale> naveSpazialeOptional = naveSpazialeRepository.findById(id);

        if (naveSpazialeOptional.isPresent()) {
            String url = fileUploadService.uploadFile(file);
            logger.info("Uploaded file to: {}", url);

            NaveSpaziale naveSpaziale = naveSpazialeOptional.get();
            naveSpaziale.setImmagine(url);
            naveSpazialeRepository.save(naveSpaziale);

            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            return ResponseEntity.ok(response);
        } else {
            logger.error("NaveSpaziale with ID: {} not found", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PatchMapping(value = "/uploadTutaSpazialeImageFront/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadTutaSpazialeImageFront(@PathVariable Integer id, @RequestParam("file") MultipartFile file) throws IOException {
        Optional<TutaSpaziale> tutaSpazialeOptional = tutaSpazialeRepository.findById(id);

        if (tutaSpazialeOptional.isPresent()) {
            String url = fileUploadService.uploadFile(file);
            TutaSpaziale tutaSpaziale = tutaSpazialeOptional.get();
            tutaSpaziale.setImmagineFronte(url);
            tutaSpazialeRepository.save(tutaSpaziale);

            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PatchMapping(value = "/uploadTutaSpazialeImageBack/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadTutaSpazialeImageBack(@PathVariable Integer id, @RequestParam("file") MultipartFile file) throws IOException {
        Optional<TutaSpaziale> tutaSpazialeOptional = tutaSpazialeRepository.findById(id);

        if (tutaSpazialeOptional.isPresent()) {
            String url = fileUploadService.uploadFile(file);
            TutaSpaziale tutaSpaziale = tutaSpazialeOptional.get();
            tutaSpaziale.setImmagineRetro(url);
            tutaSpazialeRepository.save(tutaSpaziale);

            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    @PatchMapping(value = "/uploadAvatar/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadAvatar(@PathVariable Integer id, @RequestParam("file") MultipartFile file) throws IOException {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            String url = fileUploadService.uploadFile(file);
            User user = userOptional.get();
            user.setAvatar(url);
            userRepository.save(user);

            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
