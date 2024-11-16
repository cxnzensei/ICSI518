package com.icsi518.backend.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icsi518.backend.entities.IndividualGoal;

@Repository
public interface IndividualGoalRepository extends JpaRepository<IndividualGoal, UUID> {

    List<IndividualGoal> findByAccount_AccountIdIn(List<UUID> accountIds);

}
