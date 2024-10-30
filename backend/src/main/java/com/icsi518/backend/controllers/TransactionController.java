package com.icsi518.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.icsi518.backend.entities.Transaction;
import com.icsi518.backend.services.TransactionService;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;

    @PostMapping("/{accountId}")
    public ResponseEntity<Transaction> createTransaction(@PathVariable UUID accountId, @RequestBody Transaction transaction) {
        return ResponseEntity.ok(transactionService.createTransaction(accountId, transaction));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Transaction>> getAllTransactionsByAccountId(@PathVariable("accountId") UUID accountId) {
        List<Transaction> transactions = transactionService.getAllTransactionsByAccountId(accountId);
        return ResponseEntity.ok(transactions);
    }

    @PutMapping("/{transactionId}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable UUID transactionId, @RequestBody Transaction transactionDetails) {
        return ResponseEntity.ok(transactionService.updateTransaction(transactionId, transactionDetails));
    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<String> deleteTransaction(@PathVariable UUID transactionId) {
        transactionService.deleteTransaction(transactionId);
        return ResponseEntity.ok("Transaction deleted successfully");
    }
}
