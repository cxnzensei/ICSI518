package com.icsi518.backend.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icsi518.backend.entities.FamilyGoal;

@Repository
public interface FamilyGoalRepository extends JpaRepository<FamilyGoal, UUID> {

}
