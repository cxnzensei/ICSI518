package com.icsi518.backend.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.icsi518.backend.entities.IndividualGoal;
import com.icsi518.backend.entities.IndividualGoal.IndividualGoalView;

@Repository
public interface IndividualGoalRepository extends JpaRepository<IndividualGoal, UUID> {

    List<IndividualGoalView> findByAccount_AccountIdInAndFamilyGoalIsNull(List<UUID> accountIds);
    // List<IndividualGoalView> findByUser_UserIdInAndFamilyGoalIsNull(UUID userId);

    @Query("SELECT i FROM IndividualGoal i WHERE i.user.userId = :userId")
    List<IndividualGoalView> findIndividualGoalsByUserId(UUID userId);

}
