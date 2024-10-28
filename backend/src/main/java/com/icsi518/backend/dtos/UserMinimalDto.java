package com.icsi518.backend.dtos;

import java.util.UUID;

import com.icsi518.backend.enums.MembershipStatus;
import com.icsi518.backend.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserMinimalDto {

    private UUID userId;
    private String firstName;
    private String lastName;
    private String emailId;
    private Role role;
    private MembershipStatus membershipStatus;
}
