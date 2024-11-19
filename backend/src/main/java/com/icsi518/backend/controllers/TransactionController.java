package com.icsi518.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.icsi518.backend.dtos.TransactionDto;
import com.icsi518.backend.entities.Transaction.TransactionView;
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
    public ResponseEntity<TransactionDto> createTransaction(@PathVariable UUID accountId, @RequestBody TransactionDto transaction) {
        return ResponseEntity.ok(transactionService.createTransaction(accountId, transaction));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<TransactionDto>> getAllTransactionsByAccountId(@PathVariable("accountId") UUID accountId) {
        List<TransactionDto> transactions = transactionService.getAllTransactionsByAccountId(accountId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/account-all")
    public ResponseEntity<List<TransactionView>> getAllTransactions(@RequestParam("userId") UUID userId) {
        List<TransactionView> transactions = transactionService.getAllTransactions(userId);
        return ResponseEntity.ok(transactions);
    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<String> deleteTransaction(@PathVariable UUID transactionId) {
        transactionService.deleteTransaction(transactionId);
        return ResponseEntity.ok("Transaction deleted successfully");
    }
}
