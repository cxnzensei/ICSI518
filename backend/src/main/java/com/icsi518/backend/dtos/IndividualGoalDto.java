package com.icsi518.backend.dtos;

import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.icsi518.backend.enums.Frequency;
import com.icsi518.backend.enums.GoalStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class IndividualGoalDto {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private UUID individualGoalId;
    private String name;
    private Double goalAmount;
    private Double amountContributed;
    private String description;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private MinimalAccountDto account;

    private Integer frequencyNumber;
    private Frequency frequency;
    private Boolean autoContribute;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private GoalStatus status;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date createdDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date targetDate;
}