package com.icsi518.backend.controllers;

import com.icsi518.backend.dtos.LoginDto;
import com.icsi518.backend.dtos.RegisterDto;
import com.icsi518.backend.dtos.UserDto;
import com.icsi518.backend.services.AuthenticationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin("http://localhost:3000")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<UserDto> loginUser(@RequestBody LoginDto loginRequestDto,
            HttpServletResponse response) {
        return authenticationService.loginUser(loginRequestDto, response);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@RequestBody RegisterDto registerDto, HttpServletResponse response) {
        return authenticationService.registerUser(registerDto, response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }

        String jwtCookie = String.format(
                "jwt=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
        response.setHeader("Set-Cookie", jwtCookie);

        return new ResponseEntity<>("Logged out successfully", HttpStatus.OK);
    }

    @PostMapping("/update_password")
    public ResponseEntity<String> updatePassword(@RequestBody LinkedHashMap<String, String> body) {
        authenticationService.updatePassword(body);
        return new ResponseEntity<>("UPDATED", HttpStatus.OK);
    }
}
