package com.icsi518.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class SignupDto {

    private String firstName;
    private String lastName;
    private String emailId;
    private char[] password;
}
