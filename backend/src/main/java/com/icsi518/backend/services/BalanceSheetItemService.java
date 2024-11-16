package com.icsi518.backend.services;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.icsi518.backend.dtos.BalanceSheetItemDto;
import com.icsi518.backend.entities.Account;
import com.icsi518.backend.entities.BalanceSheetItem;
import com.icsi518.backend.entities.BalanceSheetItem.BalanceSheetItemView;
import com.icsi518.backend.enums.Frequency;
import com.icsi518.backend.exceptions.ApplicationException;
import com.icsi518.backend.mappers.BalanceSheetItemMapper;
import com.icsi518.backend.repositories.AccountRepository;
import com.icsi518.backend.repositories.BalanceSheetItemRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BalanceSheetItemService {

    @Autowired
    private BalanceSheetItemRepository balanceSheetItemRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BalanceSheetItemMapper balanceSheetItemMapper;

    public List<BalanceSheetItemView> getBalanceSheetItemsByUserId(UUID userId) {
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
    public BalanceSheetItemDto createBalanceSheetItem(UUID accountId, BalanceSheetItemDto balanceSheetItemDto) {
        validateFrequency(balanceSheetItemDto.getFrequency(), balanceSheetItemDto.getFrequencyNumber());
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ApplicationException("Account not found", HttpStatus.NOT_FOUND));

        BalanceSheetItem balanceSheetItem = balanceSheetItemMapper.toEntity(balanceSheetItemDto);
        balanceSheetItem.setAccount(account);
        BalanceSheetItem savedItem = balanceSheetItemRepository.save(balanceSheetItem);
        return balanceSheetItemMapper.toDto(savedItem);
    }

    @Transactional
    public BalanceSheetItemDto updateBalanceSheetItem(UUID itemId, Map<String, String> updates) {
        BalanceSheetItem balanceSheetItem = balanceSheetItemRepository.findById(itemId)
                .orElseThrow(() -> new ApplicationException("Balance sheet item not found", HttpStatus.NOT_FOUND));

        ObjectMapper objectMapper = new ObjectMapper();
        BalanceSheetItemDto balanceSheetItemDto = objectMapper.convertValue(updates, BalanceSheetItemDto.class);

        balanceSheetItemMapper.updateEntityFromDto(balanceSheetItemDto, balanceSheetItem);

        if (updates.containsKey("frequency") || updates.containsKey("frequencyNumber")) {
            Frequency frequency = updates.containsKey("frequency") ? Frequency.valueOf(updates.get("frequency"))
                    : balanceSheetItem.getFrequency();
            Integer frequencyNumber = updates.containsKey("frequencyNumber")
                    ? Integer.valueOf(updates.get("frequencyNumber"))
                    : balanceSheetItem.getFrequencyNumber();
            validateFrequency(frequency, frequencyNumber);
            balanceSheetItem.setFrequency(frequency);
            balanceSheetItem.setFrequencyNumber(frequencyNumber);
        }

        if (updates.containsKey("accountId")) {
            UUID accountId = UUID.fromString(updates.get("accountId"));
            Account account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new ApplicationException("Account not found", HttpStatus.NOT_FOUND));
            balanceSheetItem.setAccount(account);
        }

        BalanceSheetItem updatedItem = balanceSheetItemRepository.save(balanceSheetItem);
        return balanceSheetItemMapper.toDto(updatedItem);
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
