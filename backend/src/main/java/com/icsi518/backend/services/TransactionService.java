package com.icsi518.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import com.icsi518.backend.dtos.TransactionDto;
import com.icsi518.backend.entities.Account;
import com.icsi518.backend.entities.Transaction;
import com.icsi518.backend.entities.Transaction.TransactionView;
import com.icsi518.backend.enums.TransactionType;
import com.icsi518.backend.exceptions.ApplicationException;
import com.icsi518.backend.mappers.TransactionMapper;
import com.icsi518.backend.repositories.AccountRepository;
import com.icsi518.backend.repositories.TransactionRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper; 

    @Autowired
    public TransactionService(AccountRepository accountRepository, TransactionRepository transactionRepository, TransactionMapper transactionMapper) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.transactionMapper = transactionMapper;
    }

    @Transactional
    public TransactionDto createTransaction(UUID accountId, TransactionDto transaction) {
        try {
            log.info("Fetching account with ID: {}", accountId);
            Account account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new ApplicationException("Account not found", HttpStatus.NOT_FOUND));

            log.info("Mapping DTO to entity");
            Transaction transaction2 = transactionMapper.toEntity(transaction);

            log.info("Updating account balance");
            if(transaction2.getType() == TransactionType.DEBIT) {
                account.setCurrentBalance(account.getCurrentBalance()-transaction2.getAmount());
            }
            else {
                account.setCurrentBalance(account.getCurrentBalance()+transaction2.getAmount());
            }

            log.info("Saving account and transaction");
            Account savedAccount = accountRepository.save(account);
            transaction2.setAccount(savedAccount);
            return transactionMapper.toTransactionDto(transactionRepository.save(transaction2));
        } catch (Exception e) {
            log.error("Error creating transaction: {}", e.getMessage(), e);
            throw new ApplicationException(e.getMessage(), HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Transactional
    public List<TransactionDto> getAllTransactionsByAccountId(UUID accountId) {
        List<Transaction> transactions = transactionRepository.findByAccount_AccountIdOrderByDateDesc(accountId);
        return transactions.stream().map(transactionMapper::toTransactionDto).collect(Collectors.toList());
    }

    @Transactional
    public void deleteTransaction(UUID transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ApplicationException("The transaction does not exist", HttpStatus.NOT_FOUND));
        transaction.setAccount(null);
        transactionRepository.deleteById(transactionId);
    }

    @Transactional
    public List<TransactionView> getAllTransactions(UUID userId) {
        List<Account> accounts = accountRepository.findByUser_UserId(userId);
        List<UUID> accountIds = accounts.stream().map(Account::getAccountId).collect(Collectors.toList());
        return transactionRepository.findByAccount_AccountIdIn(accountIds);
    }
}
