package com.icsi518.backend.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.icsi518.backend.entities.Account;
import com.icsi518.backend.entities.BalanceSheetItem;
import com.icsi518.backend.enums.Frequency;
import com.icsi518.backend.exceptions.ApplicationException;
import com.icsi518.backend.repositories.AccountRepository;
import com.icsi518.backend.repositories.BalanceSheetItemRepository;

import jakarta.transaction.Transactional;

@Service
public class BalanceSheetItemService {

    @Autowired
    private BalanceSheetItemRepository balanceSheetItemRepository;

    @Autowired
    private AccountRepository accountRepository;

    public List<BalanceSheetItem> getBalanceSheetItemsByUserId(UUID userId) {
        List<Account> accounts = accountRepository.findByUser_UserId(userId);
        List<UUID> accountIds = accounts.stream().map(Account::getAccountId).collect(Collectors.toList());

        if (accounts.isEmpty()) {
            return List.of();
        } else {
            return balanceSheetItemRepository.findByAccount_AccountIdIn(accountIds);
        }
    }

    @Transactional
    public void deleteBalanceSheetItem(UUID itemId) {
        BalanceSheetItem balanceSheetItem = balanceSheetItemRepository.findById(itemId)
                .orElseThrow(() -> new ApplicationException("Balance sheet item not found", HttpStatus.NOT_FOUND));
        balanceSheetItem.setAccount(null);
        balanceSheetItemRepository.deleteById(itemId);
    }

    @Transactional
    public BalanceSheetItem createBalanceSheetItem(UUID accountId, BalanceSheetItem balanceSheetItem) {
        validateFrequency(balanceSheetItem.getFrequency(), balanceSheetItem.getFrequencyNumber());
        Optional<Account> account = accountRepository.findById(accountId);
        if (account.isPresent()) {
            balanceSheetItem.setAccount(account.get());
            return balanceSheetItemRepository.save(balanceSheetItem);
        } else {
            throw new ApplicationException("Account not found", HttpStatus.NOT_FOUND);
        }
    }

    @Transactional
    public BalanceSheetItem updateBalanceSheetItem(UUID itemId, BalanceSheetItem balanceSheetItemDetails) {
        BalanceSheetItem balanceSheetItem = balanceSheetItemRepository.findById(itemId)
                .orElseThrow(() -> new ApplicationException("Balance sheet item not found", HttpStatus.NOT_FOUND));

        validateFrequency(balanceSheetItemDetails.getFrequency(), balanceSheetItemDetails.getFrequencyNumber());

        balanceSheetItem.setAccount(balanceSheetItemDetails.getAccount());
        balanceSheetItem.setAmount(balanceSheetItemDetails.getAmount());
        balanceSheetItem.setDescription(balanceSheetItemDetails.getDescription());
        balanceSheetItem.setFrequency(balanceSheetItemDetails.getFrequency());
        balanceSheetItem.setFrequencyNumber(balanceSheetItemDetails.getFrequencyNumber());
        balanceSheetItem.setName(balanceSheetItemDetails.getName());
        balanceSheetItem.setType(balanceSheetItemDetails.getType());

        return balanceSheetItemRepository.save(balanceSheetItem);
    }

    public void validateFrequency(Frequency frequency, int frequencyNumber) {
        switch (frequency) {
            case WEEKLY:
            case BIWEEKLY:
                if (frequencyNumber > 7) {
                    throw new ApplicationException(
                            "Frequency number cannot be greater than 7 (number of day) for WEEKLY or BIWEEKLY",
                            HttpStatus.UNPROCESSABLE_ENTITY);
                }
                break;

            case DAILY:
                if (frequencyNumber > 24) {
                    throw new ApplicationException(
                            "Frequency number cannot be greater than 24 (number of hour) for DAILY",
                            HttpStatus.UNPROCESSABLE_ENTITY);
                }
                break;

            case MONTHLY:
                if (frequencyNumber > 28) {
                    throw new ApplicationException(
                            "Frequency number cannot be greater than 28 (number of date) for MONTHLY",
                            HttpStatus.UNPROCESSABLE_ENTITY);
                }
                break;

            default:
                throw new ApplicationException(
                        "Unsupported Frequency type",
                        HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }
}
