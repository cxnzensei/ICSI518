package com.icsi518.backend.scheduling;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoField;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;

import com.icsi518.backend.dtos.TransactionDto;
import com.icsi518.backend.entities.Account;
import com.icsi518.backend.entities.BalanceSheetItem;
import com.icsi518.backend.enums.Frequency;
import com.icsi518.backend.enums.ItemType;
import com.icsi518.backend.enums.TransactionCategory;
import com.icsi518.backend.enums.TransactionType;
import com.icsi518.backend.repositories.AccountRepository;
import com.icsi518.backend.repositories.BalanceSheetItemRepository;
import com.icsi518.backend.services.TransactionService;

@Configuration
public class BalanceSheetItemScheduler {

    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BalanceSheetItemRepository balanceSheetItemRepository;

    @Autowired
    private TransactionService transactionService;

    @Scheduled(cron = "0 0 0 * * *")
    public void scheduleBalanceSheetItems() {
        System.out.println("Cron Task :: Execution Time - " + dateTimeFormatter.format(LocalDateTime.now()));

        List<BalanceSheetItem> balanceSheetItems = balanceSheetItemRepository.findAll();
        for (BalanceSheetItem item : balanceSheetItems) {
            if (shouldRun(item)) {
                processBalanceSheetItem(item);
            }
        }
    }

    private boolean shouldRun(BalanceSheetItem item) {
        LocalDateTime now = LocalDateTime.now();
        Frequency frequency = item.getFrequency();
        int frequencyNumber = item.getFrequencyNumber();
        switch (frequency) {
            case DAILY:
                return true;
            case WEEKLY:
                return now.getDayOfWeek().getValue() == frequencyNumber;
            case BIWEEKLY:
                return (now.getDayOfWeek().getValue() == frequencyNumber)
                        && (now.get(ChronoField.ALIGNED_WEEK_OF_YEAR) % 2 == 1);
            case MONTHLY:
                return now.getDayOfMonth() == frequencyNumber;
            case EMPTY:
            default:
                return false;
        }
    }

    private void processBalanceSheetItem(BalanceSheetItem item) {
        Account account = item.getAccount();
        if (account != null) {
            double amount = item.getAmount();
            TransactionCategory category = item.getType() == ItemType.ASSET ? TransactionCategory.ASSETS
                    : TransactionCategory.LIABILITIES;
            TransactionType type = item.getType() == ItemType.ASSET ? TransactionType.CREDIT
                    : TransactionType.DEBIT;
            if (type == TransactionType.CREDIT) {
                account.setAvailableBalance(account.getAvailableBalance() + amount);
                account.setCurrentBalance(account.getCurrentBalance() + amount);
            } else {
                account.setAvailableBalance(account.getAvailableBalance() - amount);
                account.setCurrentBalance(account.getCurrentBalance() - amount);
            }
            accountRepository.save(account);

            TransactionDto transactionDto = TransactionDto.builder().name("Balance Sheet Update").date(new Date())
                    .amount(amount).type(type).category(category).pending(false)
                    .accountId(account.getAccountId()).build();
            transactionService.createTransaction(account.getAccountId(),
                    transactionDto);
            System.out.println("Updated Account :: " +
                    account.getName() + " - Available Balance: " +
                    account.getAvailableBalance() + ", Current Balance: " +
                    account.getCurrentBalance());
        }
    }
}