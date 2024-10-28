package com.icsi518.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.icsi518.backend.entities.Account;
import com.icsi518.backend.services.AccountService;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {
    
    @Autowired
    private AccountService accountService;

    @PostMapping("/{userId}")
    public ResponseEntity<Account> createAccount(@PathVariable UUID userId, @RequestBody Account account) {
        return ResponseEntity.ok(accountService.createAccount(userId, account));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Account>> getAllAccountsByUserId(@PathVariable("userId") UUID userId) {
        log.info("userId for this GET request is " + userId.toString());
        return ResponseEntity.ok(accountService.getAllAccountsByUserId(userId));
    }

    @PutMapping("/{accountId}")
    public ResponseEntity<Account> updateAccount(@PathVariable UUID accountId, @RequestBody Account accountDetails) {
        return ResponseEntity.ok(accountService.updateAccount(accountId, accountDetails));
    }

    @DeleteMapping("/{accountId}")
    public ResponseEntity<String> deleteAccount(@PathVariable UUID accountId) {
        accountService.deleteAccount(accountId);
        return ResponseEntity.ok("Account deleted successfully");
    }
}
