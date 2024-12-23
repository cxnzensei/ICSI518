package com.icsi518.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/messages")
    public ResponseEntity<String> homeController() {
        return ResponseEntity.ok("Spring Boot Backend for WealthWise!");
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> adminController() {
        return ResponseEntity.ok("WealthWise Family Admin test!");
    }
}
