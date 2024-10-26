package com.icsi518.backend.controllers;

import java.net.URI;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icsi518.backend.dtos.FamilyDto;
import com.icsi518.backend.dtos.FamilyMinimalDto;
import com.icsi518.backend.services.FamilyService;
import com.icsi518.backend.services.UserService;

@RestController
@RequestMapping("/api/v1/families")
public class FamilyController {

    private final FamilyService familyService;
    private final UserService userService;

    @Autowired
    public FamilyController(FamilyService familyService, UserService userService) {
        this.userService = userService;
        this.familyService = familyService;
    }

    @PostMapping("/create")
    public ResponseEntity<FamilyMinimalDto> createFamily(@RequestBody Map<String, String> familyMap) {
        String familyName = familyMap.get("familyName");
        FamilyMinimalDto family = familyService.createFamily(familyName, userService.getLoggedInUser());
        return ResponseEntity.created(URI.create("/users/" + family.getId())).body(family);
    }

    @GetMapping(value = "/{familyId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FamilyDto> getFamilyById(@PathVariable UUID familyId) {
        FamilyDto familyDto = familyService.getFamilyById(familyId);
        return ResponseEntity.ok(familyDto);
    }
}
