package com.icsi518.backend.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icsi518.backend.entities.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {

    List<Account> findByUser_UserId(UUID userId);
}
