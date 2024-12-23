package com.icsi518.backend.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class FamilyService {

    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;
    private final FamilyMapper familyMapper;
    private final UserMapper userMapper;
    private final UserService userService;

    @Autowired
    public FamilyService(FamilyRepository familyRepository, UserRepository userRepository, FamilyMapper familyMapper,
            UserMapper userMapper, UserService userService) {
        this.familyRepository = familyRepository;
        this.userRepository = userRepository;
        this.familyMapper = familyMapper;
        this.userMapper = userMapper;
        this.userService = userService;
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
        Family family = familyRepository.findByIdWithMembersSorted(familyId)
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

    @Transactional
    public ResponseEntity<String> removeUserFromFamily(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException("The user does not exist", HttpStatus.NOT_FOUND));

        if (user.getFamily() == null) {
            throw new ApplicationException("The user is not a part of any family", HttpStatus.PRECONDITION_FAILED);
        }

        Family family = user.getFamily();

        if (user.getRole() == Role.ADMIN) {
            long otherUsersCount = family.getMembers().stream()
                    .filter(member -> !member.equals(user))
                    .count();

            if (otherUsersCount > 0) {
                boolean hasOtherAdmins = family.getMembers().stream()
                        .filter(member -> !member.equals(user))
                        .anyMatch(member -> member.getRole() == Role.ADMIN);
                if (!hasOtherAdmins) {
                    throw new ApplicationException(
                            "No other Admins found. Please assign someone else as an admin first.",
                            HttpStatus.CONFLICT);
                }
            }
        }

        user.setFamily(null);
        user.setMembershipStatus(MembershipStatus.NOT_A_MEMBER);
        user.setRole(Role.USER);
        userRepository.save(user);

        family.getMembers().remove(user);

        if (family.getMembers().isEmpty()) {
            familyRepository.delete(family);
        } else {
            familyRepository.save(family);
        }

        log.info("userId: " + userId.toString());
        log.info("loggedInUser: " + userService.getLoggedInUser().toString());

        if (userId.equals(userService.getLoggedInUser())) {
            return ResponseEntity.ok("left successfully");
        }
        return ResponseEntity.ok("User removed successfully");
    }

    public ResponseEntity<String> toggleAdmin(UUID userId) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Role currentRole = user.getRole();
            if (currentRole == Role.ADMIN) {
                user.setRole(Role.USER);
                userRepository.save(user);
                return ResponseEntity.ok("Demoted to User");
            } else {
                user.setRole(Role.ADMIN);
                userRepository.save(user);
                return ResponseEntity.ok("Promoted to Admin");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
}
