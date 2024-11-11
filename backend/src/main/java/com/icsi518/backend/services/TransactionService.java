package com.icsi518.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import com.icsi518.backend.entities.Account;
import com.icsi518.backend.entities.Transaction;
import com.icsi518.backend.exceptions.ApplicationException;
import com.icsi518.backend.repositories.AccountRepository;
import com.icsi518.backend.repositories.TransactionRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository; 

    @Autowired
    public TransactionService(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public Transaction createTransaction(UUID accountId, Transaction transaction) {
        try {
            Account account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new ApplicationException("Account not found", HttpStatus.NOT_FOUND));

            transaction.setAccount(account);
            return transactionRepository.save(transaction);
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Transactional
    public List<Transaction> getAllTransactionsByAccountId(UUID accountId) {
        return transactionRepository.findByAccount_AccountId(accountId);
    }

    @Transactional
    public Transaction updateTransaction(UUID transactionId, Transaction transactionDetails) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ApplicationException("Transaction not found", HttpStatus.NOT_FOUND));

        transaction.setAmount(transactionDetails.getAmount());
        transaction.setCategory(transactionDetails.getCategory());
        transaction.setDate(transactionDetails.getDate());
        transaction.setName(transactionDetails.getName());
        transaction.setPending(transactionDetails.getPending());
        transaction.setType(transactionDetails.getType());

        return transactionRepository.save(transaction);
    }

    @Transactional
    public void deleteTransaction(UUID transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ApplicationException("The transaction does not exist", HttpStatus.NOT_FOUND));
        transaction.setAccount(null);
        transactionRepository.deleteById(transactionId);
    }
}
