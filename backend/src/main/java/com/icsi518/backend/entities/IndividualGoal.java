package com.icsi518.backend.entities;

import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.icsi518.backend.entities.Account.MinimalAccountView;
import com.icsi518.backend.enums.Frequency;
import com.icsi518.backend.enums.GoalStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Builder
@Table(name = "individual_goals")
public class IndividualGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID individualGoalId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double goalAmount;

    @Column(nullable = false)
    private Double amountContributed;

    private String description;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "account_id", referencedColumnName = "accountId")
    private Account account;

    @Column(nullable = false)
    private Integer frequencyNumber;

    @Enumerated(EnumType.STRING)
    private Frequency frequency;

    @Column(nullable = false)
    private Boolean autoContribute;

    @Enumerated(EnumType.STRING)
    private GoalStatus status;

    @Column(nullable = false)
    private Date createdDate;

    @Column(nullable = false)
    private Date targetDate;

    @Column(nullable = false)
    private Double percentage;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "family_goal_id", referencedColumnName = "familyGoalId")
    @JsonIgnore
    private FamilyGoal familyGoal;

    public interface IndividualGoalView {

        UUID getIndividualGoalId();

        String getName();

        Double getGoalAmount();

        Double getAmountContributed();

        String getDescription();

        MinimalAccountView getAccount();

        Integer getFrequencyNumber();

        Frequency getFrequency();

        Boolean getAutoContribute();

        GoalStatus getStatus();

        Date getCreatedDate();

        Date getTargetDate();

        Double getPercentage();
    }
}