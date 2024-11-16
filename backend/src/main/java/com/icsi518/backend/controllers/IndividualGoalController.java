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
import org.springframework.web.bind.annotation.RestController;

import com.icsi518.backend.dtos.IndividualGoalDto;
import com.icsi518.backend.services.IndividualGoalService;

@RestController
@RequestMapping("/api/v1/individual-goals")
public class IndividualGoalController {

    @Autowired
    private IndividualGoalService individualGoalService;

    @GetMapping(path = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<IndividualGoalDto>> getIndividualGoalsByUserId(@PathVariable UUID userId) {
        List<IndividualGoalDto> goals = individualGoalService.getIndividualGoalsByUserId(userId);
        if (goals.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(goals);
        }
    }

    @PostMapping(path = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<IndividualGoalDto> createIndividualGoal(@RequestBody IndividualGoalDto individualGoalDto) {
        IndividualGoalDto savedGoal = individualGoalService.createIndividualGoal(individualGoalDto);
        return ResponseEntity.ok(savedGoal);
    }

    @DeleteMapping(path = "/delete/{goalId}")
    public ResponseEntity<Void> deleteIndividualGoal(@PathVariable UUID goalId) {
        individualGoalService.deleteIndividualGoal(goalId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping(path = "/update/{goalId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<IndividualGoalDto> updateBalanceSheetItem(@PathVariable UUID goalId,
            @RequestBody Map<String, String> updates) {
        IndividualGoalDto updatedGoal = individualGoalService.updateIndividualGoal(goalId, updates);
        return ResponseEntity.ok(updatedGoal);
    }

}
