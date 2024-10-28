package com.icsi518.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import com.icsi518.backend.entities.Account;
import com.icsi518.backend.entities.User;
import com.icsi518.backend.exceptions.ApplicationException;
import com.icsi518.backend.repositories.AccountRepository;
import com.icsi518.backend.repositories.UserRepository;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Autowired
    public AccountService(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    public Account createAccount(UUID userId, Account account) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException("User not found", HttpStatus.NOT_FOUND));

        account.setUser(user);
        return accountRepository.save(account);
    }

    public List<Account> getAllAccountsByUserId(UUID userId) {
        // User user = userRepository.findById(userId).orElseThrow(() -> new
        // ApplicationException("User not found", HttpStatus.NOT_FOUND));
        // return user.getAccounts();
        return null;
    }

    public Account updateAccount(UUID accountId, Account accountDetails) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ApplicationException("Account not found", HttpStatus.NOT_FOUND));

        account.setName(accountDetails.getName());
        account.setAvailableBalance(accountDetails.getAvailableBalance());
        account.setCurrentBalance(accountDetails.getCurrentBalance());
        account.setOfficialName(accountDetails.getOfficialName());
        account.setMask(accountDetails.getMask());
        account.setInstitutionId(accountDetails.getInstitutionId());
        account.setType(accountDetails.getType());
        account.setSubtype(accountDetails.getSubtype());
        account.setSharableId(accountDetails.getSharableId());

        return accountRepository.save(account);
    }

    public void deleteAccount(UUID accountId) {
        accountRepository.deleteById(accountId);
    }
}
