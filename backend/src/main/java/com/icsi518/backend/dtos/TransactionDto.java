package com.icsi518.backend.dtos;

import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.icsi518.backend.enums.TransactionCategory;
import com.icsi518.backend.enums.TransactionType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class TransactionDto {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private UUID transactionId;

    private String name;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date date;

    private Double amount;

    private TransactionType type;

    private TransactionCategory category;

    private Boolean pending;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private UUID accountId;
}
