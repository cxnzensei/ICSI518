package com.icsi518.backend.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.icsi518.backend.dtos.FamilyGoalDto;
import com.icsi518.backend.entities.FamilyGoal.FamilyGoalView;
import com.icsi518.backend.services.FamilyGoalService;

@RestController
@RequestMapping("/api/v1/family-goals")
public class FamilyGoalController {

    @Autowired
    private FamilyGoalService familyGoalService;

    @GetMapping(path = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<FamilyGoalView>> getFamilyGoalsByFamilyId(@RequestParam UUID familyId) {
        return ResponseEntity.ok(familyGoalService.getFamilyGoalsByFamilyId(familyId));
    }

    @PostMapping(path = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FamilyGoalDto> createFamilyGoal(@RequestParam UUID familyId,
            @RequestBody FamilyGoalDto familyGoalDto) {
        return ResponseEntity.ok(familyGoalService.createFamilyGoal(familyId, familyGoalDto));
    }
}
