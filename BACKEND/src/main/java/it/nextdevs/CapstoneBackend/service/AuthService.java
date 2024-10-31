package it.nextdevs.CapstoneBackend.service;



import it.nextdevs.CapstoneBackend.dto.AuthDataDto;
import it.nextdevs.CapstoneBackend.dto.UserDataDto;
import it.nextdevs.CapstoneBackend.dto.UserLoginDto;
import it.nextdevs.CapstoneBackend.exceptions.UnauthorizedException;
import it.nextdevs.CapstoneBackend.model.User;
import it.nextdevs.CapstoneBackend.security.JwtTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtTool jwtTool;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthDataDto authenticateUserAndCreateToken(UserLoginDto userLoginDTO) {
        Optional<User> userOptional = userService.getUserByEmail(userLoginDTO.getEmail());
        if (userOptional.isEmpty()) {
            throw new UnauthorizedException("Error in authorization, relogin!");
        } else {
            User user = userOptional.get();
            if (passwordEncoder.matches(userLoginDTO.getPassword(), user.getPassword())) {
                AuthDataDto authDataDto = new AuthDataDto();
                authDataDto.setAccessToken(jwtTool.createToken(user));
                UserDataDto userDataDto = new UserDataDto();
                userDataDto.setNome(user.getNome());
                userDataDto.setCognome(user.getCognome());
                userDataDto.setAvatar(user.getAvatar());
                userDataDto.setEmail(user.getEmail());
                userDataDto.setUsername(user.getUsername());
                userDataDto.setIdUtente(user.getIdUtente());
                userDataDto.setTipoUtente(user.getTipoUtente());
                authDataDto.setUser(userDataDto);
                return authDataDto;
            } else {
                throw new UnauthorizedException("Error in authorization, relogin!");
            }
        }
    }
}
