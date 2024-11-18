package com.icsi518.backend.services;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icsi518.backend.dtos.FamilyGoalDto;
import com.icsi518.backend.entities.Family;
import com.icsi518.backend.entities.FamilyGoal;
import com.icsi518.backend.entities.IndividualGoal;
import com.icsi518.backend.entities.User;
import com.icsi518.backend.entities.FamilyGoal.FamilyGoalView;
import com.icsi518.backend.enums.GoalStatus;
import com.icsi518.backend.enums.MembershipStatus;
import com.icsi518.backend.exceptions.ApplicationException;
import com.icsi518.backend.mappers.FamilyGoalMapper;
import com.icsi518.backend.mappers.IndividualGoalMapper;
import com.icsi518.backend.repositories.FamilyGoalRepository;
import com.icsi518.backend.repositories.FamilyRepository;
import com.icsi518.backend.repositories.IndividualGoalRepository;
import com.icsi518.backend.repositories.UserRepository;

@Service
public class FamilyGoalService {

        @Autowired
        private FamilyGoalRepository familyGoalRepository;

        @Autowired
        private FamilyGoalMapper familyGoalMapper;

        @Autowired
        private FamilyRepository familyRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private IndividualGoalRepository individualGoalRepository;

        @Autowired
        private IndividualGoalMapper individualGoalMapper;

        @Autowired
        private BalanceSheetItemService balanceSheetItemService;

        @Transactional(readOnly = true)
        public List<FamilyGoalView> getFamilyGoalsByFamilyId(UUID familyId) {
                return familyGoalRepository.findByFamily_FamilyId(familyId);
        }

        @Transactional
        public FamilyGoalDto createFamilyGoal(UUID familyId, FamilyGoalDto familyGoalDto) {

                balanceSheetItemService.validateFrequency(familyGoalDto.getFrequency(),
                                familyGoalDto.getFrequencyNumber());

                Family family = familyRepository.findById(familyId)
                                .orElseThrow(() -> new ApplicationException("Family not found", HttpStatus.NOT_FOUND));

                FamilyGoal familyGoal = familyGoalMapper.toEntity(familyGoalDto);
                familyGoal.setCreatedDate(new Date());
                familyGoal.setStatus(GoalStatus.ACTIVE);
                familyGoal.setFamily(family);

                FamilyGoal savedFamilyGoal = familyGoalRepository.save(familyGoal);

                List<User> familyMembers = userRepository.findByFamily_FamilyId(familyId);

                List<User> acceptedFamilyMembers = familyMembers.stream()
                                .filter(member -> member.getMembershipStatus() == MembershipStatus.ACCEPTED)
                                .collect(Collectors.toList());

                int acceptedMemberCount = acceptedFamilyMembers.size();
                double individualGoalAmountForAccepted = savedFamilyGoal.getGoalAmount() / acceptedMemberCount;
                double percentageForAccepted = 100.0 / acceptedMemberCount;

                List<IndividualGoal> individualGoals = familyMembers.stream()
                                .map(member -> IndividualGoal.builder()
                                                .name(savedFamilyGoal.getName())
                                                .goalAmount(member.getMembershipStatus() == MembershipStatus.ACCEPTED
                                                                ? individualGoalAmountForAccepted
                                                                : 0.0)
                                                .amountContributed(0.0)
                                                .description(savedFamilyGoal.getDescription())
                                                .user(member)
                                                .account(null)
                                                .frequencyNumber(savedFamilyGoal.getFrequencyNumber())
                                                .frequency(savedFamilyGoal.getFrequency())
                                                .autoContribute(false)
                                                .status(savedFamilyGoal.getStatus())
                                                .createdDate(new Date())
                                                .targetDate(savedFamilyGoal.getTargetDate())
                                                .percentage(member.getMembershipStatus() == MembershipStatus.ACCEPTED
                                                                ? percentageForAccepted
                                                                : 0.0)
                                                .familyGoal(savedFamilyGoal)
                                                .build())
                                .collect(Collectors.toList());

                List<IndividualGoal> savedIndividualGoals = individualGoalRepository.saveAll(individualGoals);

                FamilyGoalDto resultDto = familyGoalMapper.toDto(savedFamilyGoal);
                resultDto.setIndividualGoals(
                                savedIndividualGoals.stream().map(individualGoalMapper::toDto)
                                                .collect(Collectors.toList()));

                return resultDto;

        }

}
