package com.icsi518.backend.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icsi518.backend.entities.FamilyGoal;
import com.icsi518.backend.entities.FamilyGoal.FamilyGoalView;

@Repository
public interface FamilyGoalRepository extends JpaRepository<FamilyGoal, UUID> {

    List<FamilyGoalView> findByFamily_FamilyId(UUID familyId);
}
