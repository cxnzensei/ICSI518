package com.icsi518.backend.repositories;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.icsi518.backend.entities.Family;

@Repository
public interface FamilyRepository extends JpaRepository<Family, UUID> {

    @Query("SELECT f from Family f LEFT JOIN FETCH f.members m WHERE f.id = :familyId ORDER BY m.firstName ASC")
    Optional<Family> findByIdWithMembersSorted(UUID familyId);

}
