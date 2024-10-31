package it.nextdevs.CapstoneBackend.controller;


import it.nextdevs.CapstoneBackend.dto.AuthDataDto;
import it.nextdevs.CapstoneBackend.dto.UserDto;
import it.nextdevs.CapstoneBackend.dto.UserLoginDto;
import it.nextdevs.CapstoneBackend.exceptions.BadRequestException;
import it.nextdevs.CapstoneBackend.service.AuthService;
import it.nextdevs.CapstoneBackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
//@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;



    @PostMapping("/auth/register")
    public Integer saveUser(@RequestBody @Validated UserDto userDto, BindingResult bindingResult) {
        if(bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult.getAllErrors().stream()
                    .map(ObjectError::getDefaultMessage).reduce("",((s1, s2) -> s1+s2)));
        }
        return userService.saveUser(userDto);
    }

    @PostMapping("/auth/login")
    public AuthDataDto login(@RequestBody @Validated UserLoginDto userLoginDto, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(ObjectError::getDefaultMessage).
                    reduce("", (s, s2) -> s+s2));
        }

        return authService.authenticateUserAndCreateToken(userLoginDto);
    }





}
