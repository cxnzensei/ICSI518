package com.icsi518.backend.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.icsi518.backend.entities.User;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmailId(String emailId);

    List<User> findByFamily_FamilyId(UUID familyId);
}
