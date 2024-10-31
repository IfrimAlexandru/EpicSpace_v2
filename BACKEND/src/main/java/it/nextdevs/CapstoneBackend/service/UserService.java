package it.nextdevs.CapstoneBackend.service;

import com.cloudinary.Cloudinary;

import it.nextdevs.CapstoneBackend.dto.UserDataDto;
import it.nextdevs.CapstoneBackend.dto.UserDto;
import it.nextdevs.CapstoneBackend.enums.TipoUtente;
import it.nextdevs.CapstoneBackend.exceptions.BadRequestException;
import it.nextdevs.CapstoneBackend.exceptions.NotFoundException;
import it.nextdevs.CapstoneBackend.model.User;
import it.nextdevs.CapstoneBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private JavaMailSenderImpl javaMailSender;

    public Integer saveUser(UserDto userDto) {
        if (getUserByEmail(userDto.getEmail()).isEmpty()) {
            User user = new User();
            user.setNome(userDto.getNome());
            user.setCognome(userDto.getCognome());
            user.setEmail(userDto.getEmail());
            user.setTipoUtente(TipoUtente.USER);
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));

            userRepository.save(user);
            sendMailRegistrazione(userDto.getEmail());

            return user.getIdUtente();
        } else {
            throw new BadRequestException("L'utente con email " + userDto.getEmail() + " già esistente");
        }
    }

    public Page<User> getAllUsers(int page, int size , String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return userRepository.findAll(pageable);
    }

    public Optional<User> getUserById(int id) {
        return userRepository.findById(id);
    }

    public User updateUser(int id, UserDto userDto) {
        Optional<User> userOptional = getUserById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setNome(userDto.getNome());
            user.setCognome(userDto.getCognome());
            user.setEmail(userDto.getEmail());
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
            return userRepository.save(user);
        } else {
            throw new NotFoundException("User with id:" + id + " not found");
        }
    }

    public String deleteUser(int id) {
        Optional<User> userOptional = getUserById(id);

        if (userOptional.isPresent()) {
            userRepository.delete(userOptional.get());
            return "User with id:" + id + " correctly deleted";
        } else {
            throw new NotFoundException("User with id:" + id + " not found");
        }
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public UserDataDto patchUser(Integer id, UserDto userDto) {
        Optional<User> userOptional = getUserById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (userDto.getPassword() != null) {
                user.setPassword(passwordEncoder.encode(userDto.getPassword()));
            }
            if (userDto.getNome() != null) {
                user.setNome(userDto.getNome());
            }
            if (userDto.getCognome() != null) {
                user.setCognome(userDto.getCognome());
            }
            if (userDto.getEmail() != null) {
                user.setEmail(userDto.getEmail());
            }
            if (userDto.getAvatar() != null) {
                user.setAvatar(userDto.getAvatar());
            }
            userRepository.save(user);
            UserDataDto userDataDto = new UserDataDto();
            userDataDto.setNome(user.getNome());
            userDataDto.setCognome(user.getCognome());
            userDataDto.setAvatar(user.getAvatar());
            userDataDto.setEmail(user.getEmail());
            userDataDto.setIdUtente(user.getIdUtente());
            userDataDto.setTipoUtente(user.getTipoUtente());
            return userDataDto;
        } else {
            throw new NotFoundException("Utente con id "+id+" non trovato");
        }
    }

    public UserDataDto patchAvatarUser(Integer id, MultipartFile avatar) throws IOException {
        Optional<User> userOptional = getUserById(id);

        if (userOptional.isPresent()) {
            String url = (String) cloudinary.uploader().upload(avatar.getBytes(), Collections.emptyMap()).get("url");
            User user = userOptional.get();
            user.setAvatar(url);
            userRepository.save(user);
            UserDataDto userDataDto = new UserDataDto();
            userDataDto.setNome(user.getNome());
            userDataDto.setCognome(user.getCognome());
            userDataDto.setAvatar(user.getAvatar());
            userDataDto.setEmail(user.getEmail());
            userDataDto.setIdUtente(user.getIdUtente());
            userDataDto.setTipoUtente(user.getTipoUtente());
            return userDataDto;
        } else {
            throw new NotFoundException("Utente con id "+id+" non trovato");
        }
    }

    private void sendMailRegistrazione(String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Registrazione Utente");
        message.setText("Registrazione Utente avvenuta con successo");

        javaMailSender.send(message);
    }
}
