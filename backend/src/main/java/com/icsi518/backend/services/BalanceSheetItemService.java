package com.icsi518.backend.services;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.icsi518.backend.dtos.BalanceSheetItemDto;
import com.icsi518.backend.entities.Account;
import com.icsi518.backend.entities.BalanceSheetItem;
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

    public List<BalanceSheetItemDto> getBalanceSheetItemsByUserId(UUID userId) {
        List<Account> accounts = accountRepository.findByUser_UserId(userId);
        List<UUID> accountIds = accounts.stream().map(Account::getAccountId).collect(Collectors.toList());

        if (accounts.isEmpty()) {
            return List.of();
        } else {
            List<BalanceSheetItem> items = balanceSheetItemRepository.findByAccount_AccountIdIn(accountIds);
            return items.stream().map(balanceSheetItemMapper::toDto).collect(Collectors.toList());
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
    public BalanceSheetItemDto createBalanceSheetItem(BalanceSheetItemDto balanceSheetItemDto) {
        validateFrequency(balanceSheetItemDto.getFrequency(), balanceSheetItemDto.getFrequencyNumber());
        Account account = accountRepository.findById(balanceSheetItemDto.getAccountId())
                .orElseThrow(() -> new ApplicationException("Account not found", HttpStatus.NOT_FOUND));

        BalanceSheetItem balanceSheetItem = balanceSheetItemMapper.toEntity(balanceSheetItemDto);
        balanceSheetItem.setAccount(account);
        BalanceSheetItem savedItem = balanceSheetItemRepository.save(balanceSheetItem);
        return balanceSheetItemMapper.toDto(savedItem);
    }

    @Transactional
    public BalanceSheetItemDto updateBalanceSheetItem(UUID itemId, BalanceSheetItemDto balanceSheetItemDto) {
        BalanceSheetItem balanceSheetItem = balanceSheetItemRepository.findById(itemId)
                .orElseThrow(() -> new ApplicationException("Balance sheet item not found", HttpStatus.NOT_FOUND));

        validateFrequency(balanceSheetItemDto.getFrequency(), balanceSheetItemDto.getFrequencyNumber());

        balanceSheetItemMapper.updateEntityFromDto(balanceSheetItemDto, balanceSheetItem);

        balanceSheetItem.setItemId(itemId);

        Account account = accountRepository.findById(balanceSheetItemDto.getAccountId())
                .orElseThrow(() -> new ApplicationException("Account not found", HttpStatus.NOT_FOUND));

        balanceSheetItem.setAccount(account);

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
