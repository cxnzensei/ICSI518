package com.icsi518.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.icsi518.backend.dtos.AccountDto;
import com.icsi518.backend.entities.Account.MinimalAccountView;
import com.icsi518.backend.repositories.AccountRepository;
import com.icsi518.backend.services.AccountService;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private AccountRepository accountRepository;

    @PostMapping("/{userId}")
    public ResponseEntity<AccountDto> createAccount(@PathVariable UUID userId, @RequestBody AccountDto accountDto) {
        return ResponseEntity.ok(accountService.createAccount(userId, accountDto));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AccountDto>> getAllAccountsByUserId(@PathVariable("userId") UUID userId) {
        List<AccountDto> accounts = accountService.getAllAccountsByUserId(userId);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/user-minimal/{userId}")
    public ResponseEntity<List<MinimalAccountView>> getAccountsByUserId(@PathVariable("userId") UUID userId) {
        return ResponseEntity.ok(accountRepository.findMinimalAccountsByUser_UserId(userId));
    }

    @PutMapping("/{accountId}")
    public ResponseEntity<AccountDto> updateAccount(@PathVariable UUID accountId, @RequestBody Map<String, Object> updateMap) {
        return ResponseEntity.ok(accountService.updateAccount(accountId, updateMap));
    }

    @DeleteMapping("/{accountId}")
    public ResponseEntity<String> deleteAccount(@PathVariable UUID accountId) {
        accountService.deleteAccount(accountId);
        return ResponseEntity.ok("Account deleted successfully");
    }
}
