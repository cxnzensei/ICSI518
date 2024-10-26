package com.icsi518.backend.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.icsi518.backend.entities.Family;

public interface FamilyRepository extends JpaRepository<Family, UUID> {

}
