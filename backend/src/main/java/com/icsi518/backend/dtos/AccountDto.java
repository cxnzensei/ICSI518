package com.icsi518.backend.dtos;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.icsi518.backend.enums.AccountType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class AccountDto {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private UUID accountId;
    
    private String name;
    private AccountType type;
    private Double availableBalance;
    private Double currentBalance;
    private String institution;
    private String accountNumber;
}
