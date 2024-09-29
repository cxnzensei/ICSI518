package com.icsi518.backend.controllers;

import com.icsi518.backend.dtos.UserDto;
import com.icsi518.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public List<UserDto> getAllUsers() {
        return userService.findAllUsers();
    }

    @PutMapping("/update/{id}")
    public UserDto updateUser(@PathVariable("id") UUID userId, @RequestPart UserDto body) {
        return userService.updateUser(userId, body);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable("id") UUID userId) {
        return userService.deleteUser(userId);
    }
}
