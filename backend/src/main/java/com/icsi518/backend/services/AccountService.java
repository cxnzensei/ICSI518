package com.icsi518.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.icsi518.backend.dtos.AccountDto;
import com.icsi518.backend.entities.Account;
import com.icsi518.backend.entities.User;
import com.icsi518.backend.exceptions.ApplicationException;
import com.icsi518.backend.mappers.AccountMapper;
import com.icsi518.backend.repositories.AccountRepository;
import com.icsi518.backend.repositories.UserRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final AccountMapper accountMapper;

    @Autowired
    public AccountService(AccountRepository accountRepository, UserRepository userRepository, AccountMapper accountMapper) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.accountMapper = accountMapper;
    }

    @Transactional
    public AccountDto createAccount(UUID userId, AccountDto account) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ApplicationException("User not found", HttpStatus.NOT_FOUND));
            Account account2 = accountMapper.toEntity(account);
            account2.setUser(user);
            return accountMapper.toAccountDto(accountRepository.save(account2));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Transactional
    public List<AccountDto> getAllAccountsByUserId(UUID userId) {
        List<Account> accounts = accountRepository.findByUser_UserId(userId);
        return accounts.stream().map(accountMapper::toAccountDto).collect(Collectors.toList());
    }

    @Transactional
    public AccountDto updateAccount(UUID accountId, Map<String, Object> updateMap) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ApplicationException("Account not found", HttpStatus.NOT_FOUND));

        ObjectMapper objectMapper = new ObjectMapper();
        AccountDto accountDto = objectMapper.convertValue(updateMap, AccountDto.class);
        accountMapper.updateEntityFromDto(accountDto, account);

        Account updatedAccount = accountRepository.save(account);
        return accountMapper.toAccountDto(updatedAccount);
    }

    @Transactional
    public void deleteAccount(UUID accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ApplicationException("The account does not exist", HttpStatus.NOT_FOUND));

        account.setUser(null);
        accountRepository.deleteById(accountId);
    }
}
