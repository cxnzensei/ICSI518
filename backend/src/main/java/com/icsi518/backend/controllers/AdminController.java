package com.icsi518.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    @GetMapping("")
    public ResponseEntity<String> getHello() {
        return new ResponseEntity<>("Super User Privileges", HttpStatus.OK);
    }
}
