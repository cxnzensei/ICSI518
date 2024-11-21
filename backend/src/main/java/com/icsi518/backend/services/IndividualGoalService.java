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
import com.icsi518.backend.entities.IndividualGoal.IndividualGoalView;
import com.icsi518.backend.entities.User;
import com.icsi518.backend.enums.Frequency;
import com.icsi518.backend.enums.GoalStatus;
import com.icsi518.backend.exceptions.ApplicationException;
import com.icsi518.backend.mappers.IndividualGoalMapper;
import com.icsi518.backend.repositories.AccountRepository;
import com.icsi518.backend.repositories.IndividualGoalRepository;
import com.icsi518.backend.repositories.UserRepository;

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

    @Autowired
    private UserRepository userRepository;

    public List<IndividualGoalView> getIndividualGoalsByUserId(UUID userId) {
        List<Account> accounts = accountRepository.findByUser_UserId(userId);
        List<UUID> accountIds = accounts.stream().map(Account::getAccountId).collect(Collectors.toList());

        if (accounts.isEmpty()) {
            return List.of();
        } else {
            return individualGoalRepository.findByAccount_AccountIdInAndFamilyGoalIsNull(accountIds);
        }
    }

    @Transactional
    public IndividualGoalDto createIndividualGoal(UUID userId, IndividualGoalDto individualGoalDto) {
        if (individualGoalDto.getAutoContribute()) {
            balanceSheetItemService.validateFrequency(individualGoalDto.getFrequency(),
                    individualGoalDto.getFrequencyNumber());
        }

        Account account = null;
        User user = null;

        if (individualGoalDto.getAccountId() != null) {
            account = accountRepository.findById(individualGoalDto.getAccountId())
                    .orElseThrow(() -> new ApplicationException("Account not found", HttpStatus.NOT_FOUND));
        } else {
            user = userRepository.findById(userId)
                    .orElseThrow(() -> new ApplicationException("User not found", HttpStatus.NOT_FOUND));
        }

        IndividualGoal individualGoal = individualGoalMapper.toEntity(individualGoalDto);
        if (account != null) {
            individualGoal.setAccount(account);
        } else {
            individualGoal.setUser(user);
        }
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
    public IndividualGoalDto updateIndividualGoal(UUID goalId, Map<String, Object> updates) {
        IndividualGoal individualGoal = individualGoalRepository.findById(goalId)
                .orElseThrow(() -> new ApplicationException("Individual goal not found", HttpStatus.NOT_FOUND));

        if (individualGoal.getFamilyGoal().getFamilyGoalId().toString() != null) {
            throw new ApplicationException("Individual goals belonging to family goals cannot be updated",
                    HttpStatus.CONFLICT);
        }

        if (updates.containsKey("accountId")) {
            UUID accountId = UUID.fromString((String) updates.get("accountId"));
            Account account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new ApplicationException("Account not found", HttpStatus.NOT_FOUND));
            individualGoal.setAccount(account);
            updates.remove("accountId");
        }

        ObjectMapper objectMapper = new ObjectMapper();
        IndividualGoalDto individualGoalDto = objectMapper.convertValue(updates, IndividualGoalDto.class);
        individualGoalMapper.updateEntityFromDto(individualGoalDto, individualGoal);

        if (updates.containsKey("frequency") || updates.containsKey("frequencyNumber")) {
            Frequency frequency = updates.containsKey("frequency")
                    ? Frequency.valueOf((String) updates.get("frequency"))
                    : individualGoal.getFrequency();
            Integer frequencyNumber = updates.containsKey("frequencyNumber")
                    ? Integer.valueOf((String) updates.get("frequencyNumber"))
                    : individualGoal.getFrequencyNumber();
            balanceSheetItemService.validateFrequency(frequency, frequencyNumber);
            individualGoal.setFrequency(frequency);
            individualGoal.setFrequencyNumber(frequencyNumber);
        }
        IndividualGoal updatedGoal = individualGoalRepository.save(individualGoal);
        return individualGoalMapper.toDto(updatedGoal);
    }
}
