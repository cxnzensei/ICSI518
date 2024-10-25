package com.icsi518.backend.dtos;

import java.util.UUID;

import com.icsi518.backend.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserDto {

    private UUID id;
    private String firstName;
    private String lastName;
    private String emailId;
    private Role role;
}
