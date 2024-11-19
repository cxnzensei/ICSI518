package com.icsi518.backend.dtos;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.icsi518.backend.enums.Frequency;
import com.icsi518.backend.enums.ItemType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class BalanceSheetItemDto {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private UUID itemId;
    private String name;
    private ItemType type;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String description;

    private Double amount;
    private Integer frequencyNumber;
    private Frequency frequency;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private MinimalAccountDto account;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonIgnore
    private UUID accountId;
}
