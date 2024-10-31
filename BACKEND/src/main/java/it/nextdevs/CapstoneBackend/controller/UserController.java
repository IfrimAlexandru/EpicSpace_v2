package it.nextdevs.CapstoneBackend.controller;


import it.nextdevs.CapstoneBackend.dto.UserDataDto;
import it.nextdevs.CapstoneBackend.dto.UserDto;
import it.nextdevs.CapstoneBackend.exceptions.BadRequestException;
import it.nextdevs.CapstoneBackend.exceptions.NotFoundException;
import it.nextdevs.CapstoneBackend.model.User;
import it.nextdevs.CapstoneBackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/users")
    @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
    public Page<User> getAllUser(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam (defaultValue = "15") int size,
                                 @RequestParam (defaultValue = "id") String sortBy) {
        return userService.getAllUsers(page, size, sortBy);
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
    public User getUserById(@PathVariable int id) throws NotFoundException {
        Optional<User> userOptional = userService.getUserById(id);
        if (userOptional.isPresent()) {
            return userOptional.get();
        } else {
            throw new NotFoundException("User con id: "+id+" non trovata");
        }
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN, 'USER')")
    public User updateUser(@PathVariable int id, @RequestBody @Validated UserDto userDto, BindingResult bindingResult) throws NotFoundException {
        if(bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult.getAllErrors().stream()
                    .map(e -> e.getDefaultMessage()).reduce("",((s1,s2) -> s1+s2)));
        }
        return userService.updateUser(id, userDto);
    }

    @PatchMapping("/users/{id}")
    public UserDataDto patchUser(@PathVariable int id, @RequestBody UserDto userDto) {
        return userService.patchUser(id, userDto);
    }

    @PatchMapping(value = "/users/{id}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UserDataDto patchAvatarUser(@PathVariable int id, @RequestParam("file") MultipartFile avatar) throws IOException {
        return userService.patchAvatarUser(id, avatar);
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String deleteUser(@PathVariable int id) throws NotFoundException {
        return userService.deleteUser(id);
    }
//    @PatchMapping ("/users/{id}")
//    @ResponseStatus(HttpStatus.OK)
//    @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
//    public String patchAvatarUser(@RequestBody MultipartFile avatar, @PathVariable int id) throws IOException {
//        return userService.patchAvatarUser(id, avatar);
//
//    }

}
