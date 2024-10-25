package com.icsi518.backend.controllers;

import java.net.URI;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icsi518.backend.configurations.UserAuthProvider;
import com.icsi518.backend.dtos.CredentialsDto;
import com.icsi518.backend.dtos.SignupDto;
import com.icsi518.backend.dtos.UserDto;
import com.icsi518.backend.services.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private final UserService userService;
    private final UserAuthProvider userAuthProvider;

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody CredentialsDto credentialsDto, HttpServletResponse response) {
        UserDto user = userService.login(credentialsDto);
        String token = userAuthProvider.createToken(user);
        String jwtCookie = String.format("jwt=%s; Path=/; HttpOnly; SameSite=Lax; Max-Age=%d", token, 24 * 60 * 60);
        response.setHeader("Set-Cookie", jwtCookie);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody SignupDto signupDto, HttpServletResponse response) {
        UserDto user = userService.register(signupDto);
        String token = userAuthProvider.createToken(user);
        String jwtCookie = String.format("jwt=%s; Path=/; HttpOnly; SameSite=Lax; Max-Age=%d", token, 24 * 60 * 60);
        response.setHeader("Set-Cookie", jwtCookie);
        return ResponseEntity.created(URI.create("/users/" + user.getId())).body(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
            SecurityContextHolder.clearContext();
        }
        String jwtCookie = String.format("jwt=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
        response.setHeader("Set-Cookie", jwtCookie);
        return new ResponseEntity<>("Logged out successfully", HttpStatus.OK);
    }

}
