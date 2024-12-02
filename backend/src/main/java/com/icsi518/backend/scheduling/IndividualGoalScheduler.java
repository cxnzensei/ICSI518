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
import com.icsi518.backend.entities.IndividualGoal;
import com.icsi518.backend.enums.Frequency;
import com.icsi518.backend.enums.GoalStatus;
import com.icsi518.backend.enums.TransactionCategory;
import com.icsi518.backend.enums.TransactionType;
import com.icsi518.backend.repositories.AccountRepository;
import com.icsi518.backend.repositories.IndividualGoalRepository;
import com.icsi518.backend.services.TransactionService;

@Configuration
public class IndividualGoalScheduler {

    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Autowired
    private IndividualGoalRepository individualGoalRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionService transactionService;

    @Scheduled(cron = "0 0 0 * * *")
    public void scheduleIndividualGoals() {
        System.out.println("Cron Task :: Execution Time - " + dateTimeFormatter.format(LocalDateTime.now()));

        List<IndividualGoal> individualGoals = individualGoalRepository.findAll();
        for (IndividualGoal goal : individualGoals) {
            if (goal.getAutoContribute() && shouldRun(goal) && goal.getStatus() == GoalStatus.ACTIVE) {
                processIndividualGoal(goal);
            }
        }
    }

    private boolean shouldRun(IndividualGoal goal) {
        LocalDateTime now = LocalDateTime.now();
        Frequency frequency = goal.getFrequency();
        int frequencyNumber = goal.getFrequencyNumber();
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

    private void processIndividualGoal(IndividualGoal goal) {
        Account account = goal.getAccount();
        if (account != null) {
            double amount = goal.getAmountContributed();
            account.setAvailableBalance(account.getAvailableBalance() - amount);
            account.setCurrentBalance(account.getCurrentBalance() - amount);
            goal.setAmountContributed(goal.getAmountContributed() + amount);
            individualGoalRepository.save(goal);
            accountRepository.save(account);

            TransactionDto transactionDto = TransactionDto.builder().name(goal.getName() + "(goal)").date(new Date())
                    .amount(amount).type(TransactionType.DEBIT).category(TransactionCategory.GOALS).pending(false)
                    .accountId(account.getAccountId()).build();

            transactionService.createTransaction(account.getAccountId(), transactionDto);

            System.out.println("Updated Goal and Account :: " + goal.getName() + " - Contributed: "
                    + goal.getAmountContributed() + ", Account Available Balance: " + account.getAvailableBalance()
                    + ", Current Balance: " + account.getCurrentBalance());
        }
    }
}