package com.icsi518.backend.services;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.icsi518.backend.dtos.IndividualGoalDto;
import com.icsi518.backend.entities.Account;
import com.icsi518.backend.entities.IndividualGoal;
import com.icsi518.backend.enums.Frequency;
import com.icsi518.backend.enums.GoalStatus;
import com.icsi518.backend.exceptions.ApplicationException;
import com.icsi518.backend.mappers.IndividualGoalMapper;
import com.icsi518.backend.repositories.AccountRepository;
import com.icsi518.backend.repositories.IndividualGoalRepository;

import jakarta.transaction.Transactional;

@Service
public class IndividualGoalService {

    @Autowired
    private IndividualGoalRepository individualGoalRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private IndividualGoalMapper individualGoalMapper;

    @Autowired
    private BalanceSheetItemService balanceSheetItemService;

    public List<IndividualGoalDto> getIndividualGoalsByUserId(UUID userId) {
        List<Account> accounts = accountRepository.findByUser_UserId(userId);
        List<UUID> accountIds = accounts.stream().map(Account::getAccountId).collect(Collectors.toList());

        if (accounts.isEmpty()) {
            return List.of();
        } else {
            List<IndividualGoal> goals = individualGoalRepository.findByAccount_AccountIdIn(accountIds);
            return goals.stream().map(individualGoalMapper::toDto).collect(Collectors.toList());
        }
    }

    @Transactional
    public IndividualGoalDto createIndividualGoal(IndividualGoalDto individualGoalDto) {
        balanceSheetItemService.validateFrequency(individualGoalDto.getFrequency(),
                individualGoalDto.getFrequencyNumber());

        Account account = accountRepository.findById(individualGoalDto.getAccountId())
                .orElseThrow(() -> new ApplicationException("Account not found", HttpStatus.NOT_FOUND));

        IndividualGoal individualGoal = individualGoalMapper.toEntity(individualGoalDto);
        individualGoal.setAccount(account);
        individualGoal.setFamilyGoal(null);
        individualGoal.setCreatedDate(new Date());
        individualGoal.setPercentage(100.0);
        individualGoal.setStatus(GoalStatus.ACTIVE);
        IndividualGoal savedGoal = individualGoalRepository.save(individualGoal);
        return individualGoalMapper.toDto(savedGoal);
    }

    @Transactional
    public void deleteIndividualGoal(UUID goalId) {
        IndividualGoal individualGoal = individualGoalRepository.findById(goalId)
                .orElseThrow(() -> new ApplicationException("Individual goal not found", HttpStatus.NOT_FOUND));
        individualGoal.setAccount(null);
        individualGoalRepository.deleteById(goalId);
    }

    @Transactional
    public IndividualGoalDto updateIndividualGoal(UUID goalId, Map<String, String> updates) {
        IndividualGoal individualGoal = individualGoalRepository.findById(goalId)
                .orElseThrow(() -> new ApplicationException("Individual goal not found", HttpStatus.NOT_FOUND));

        ObjectMapper objectMapper = new ObjectMapper();
        IndividualGoalDto individualGoalDto = objectMapper.convertValue(updates, IndividualGoalDto.class);

        individualGoalMapper.updateEntityFromDto(individualGoalDto, individualGoal);

        if (updates.containsKey("frequency") || updates.containsKey("frequencyNumber")) {
            Frequency frequency = updates.containsKey("frequency") ? Frequency.valueOf(updates.get("frequency"))
                    : individualGoal.getFrequency();
            Integer frequencyNumber = updates.containsKey("frequencyNumber")
                    ? Integer.valueOf(updates.get("frequencyNumber"))
                    : individualGoal.getFrequencyNumber();
            balanceSheetItemService.validateFrequency(frequency, frequencyNumber);
            individualGoal.setFrequency(frequency);
            individualGoal.setFrequencyNumber(frequencyNumber);
        }

        if (updates.containsKey("accountId")) {
            UUID accountId = UUID.fromString(updates.get("accountId"));
            Account account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new ApplicationException("Account not found", HttpStatus.NOT_FOUND));
            individualGoal.setAccount(account);
        }

        IndividualGoal updatedGoal = individualGoalRepository.save(individualGoal);
        return individualGoalMapper.toDto(updatedGoal);
    }
}
