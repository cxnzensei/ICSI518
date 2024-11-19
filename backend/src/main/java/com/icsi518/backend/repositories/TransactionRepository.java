package com.icsi518.backend.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icsi518.backend.entities.Transaction;
import com.icsi518.backend.entities.Transaction.TransactionView;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {    
    List<Transaction> findByAccount_AccountIdOrderByDateDesc(UUID accountId);
    List<TransactionView> findByAccount_AccountIdIn(List<UUID> accountIds);
}
