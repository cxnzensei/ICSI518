package com.icsi518.backend.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.icsi518.backend.dtos.FamilyDto;
import com.icsi518.backend.dtos.FamilyMinimalDto;
import com.icsi518.backend.dtos.UserMinimalDto;
import com.icsi518.backend.entities.Family;
import com.icsi518.backend.enums.MembershipStatus;
import com.icsi518.backend.enums.Role;
import com.icsi518.backend.entities.User;
import com.icsi518.backend.exceptions.ApplicationException;
import com.icsi518.backend.mappers.FamilyMapper;
import com.icsi518.backend.mappers.UserMapper;
import com.icsi518.backend.repositories.FamilyRepository;
import com.icsi518.backend.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class FamilyService {

    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;
    private final FamilyMapper familyMapper;
    private final UserMapper userMapper;

    @Autowired
    public FamilyService(FamilyRepository familyRepository, UserRepository userRepository, FamilyMapper familyMapper,
            UserMapper userMapper) {
        this.familyRepository = familyRepository;
        this.userRepository = userRepository;
        this.familyMapper = familyMapper;
        this.userMapper = userMapper;
    }

    @Transactional
    public UserMinimalDto addUserToFamily(String userEmail, UUID familyId) {
        User user = userRepository.findByEmailId(userEmail)
                .orElseThrow(() -> new ApplicationException("User not found", HttpStatus.NOT_FOUND));

        if (user.getFamily() != null) {
            throw new ApplicationException("User is already part of another family", HttpStatus.PRECONDITION_FAILED);
        }

        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new ApplicationException("Family not found", HttpStatus.NOT_FOUND));

        user.setMembershipStatus(MembershipStatus.PENDING);
        user.setFamily(family);
        User savedUser = userRepository.save(user);

        List<User> members = family.getMembers();
        members.add(savedUser);
        family.setMembers(members);
        familyRepository.save(family);

        return userMapper.toUserMinimalDto(savedUser);
    }

    @Transactional
    public FamilyDto getFamilyById(UUID familyId) {
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new ApplicationException("Family not found", HttpStatus.NOT_FOUND));

        FamilyDto familyDto = familyMapper.toFamilyDto(family);

        List<UserMinimalDto> memberDtos = family.getMembers().stream().map(userMapper::toUserMinimalDto)
                .collect(Collectors.toList());
        familyDto.setMembers(memberDtos);
        return familyDto;
    }

    @Transactional
    public FamilyMinimalDto createFamily(String familyName, UUID createdByUserId) {
        User user = userRepository.findById(createdByUserId)
                .orElseThrow(() -> new ApplicationException("The user does not exist", HttpStatus.NOT_FOUND));

        Family family = new Family();
        family.setFamilyName(familyName);
        family.setCreationDate(LocalDateTime.now());
        List<User> members = new ArrayList<>();
        members.add(user);
        family.setMembers(members);
        Family savedFamily = familyRepository.save(family);

        user.setFamily(savedFamily);
        user.setRole(Role.ADMIN);
        user.setMembershipStatus(MembershipStatus.ACCEPTED);
        userRepository.save(user);

        return familyMapper.toFamilyMinimalDto(savedFamily);
    }

}
