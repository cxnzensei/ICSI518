package com.icsi518.backend.controllers;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.icsi518.backend.dtos.IndividualGoalDto;
import com.icsi518.backend.entities.IndividualGoal.IndividualGoalView;
import com.icsi518.backend.services.IndividualGoalService;

@RestController
@RequestMapping("/api/v1/individual-goals")
public class IndividualGoalController {

    @Autowired
    private IndividualGoalService individualGoalService;

    @GetMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<IndividualGoalView>> getIndividualGoalsByUserId(@RequestParam UUID userId) {
        return ResponseEntity.ok(individualGoalService.getIndividualGoalsByUserId(userId));
    }

    @PostMapping(path = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<IndividualGoalDto> createIndividualGoal(@RequestParam UUID userId,
            @RequestBody IndividualGoalDto individualGoalDto) {
        IndividualGoalDto savedGoal = individualGoalService.createIndividualGoal(userId, individualGoalDto);
        return ResponseEntity.ok(savedGoal);
    }

    @DeleteMapping(path = "/delete/{goalId}")
    public ResponseEntity<Void> deleteIndividualGoal(@PathVariable UUID goalId) {
        individualGoalService.deleteIndividualGoal(goalId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping(path = "/update/{goalId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<IndividualGoalDto> updateIndividualGoal(@PathVariable UUID goalId,
            @RequestBody Map<String, Object> updates) {
        IndividualGoalDto updatedGoal = individualGoalService.updateIndividualGoal(goalId, updates);
        return ResponseEntity.ok(updatedGoal);
    }

}
