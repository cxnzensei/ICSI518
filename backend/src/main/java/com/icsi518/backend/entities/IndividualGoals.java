package com.icsi518.backend.entities;

import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.icsi518.backend.enums.GoalFrequency;
import com.icsi518.backend.enums.GoalStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "individual_goals")
public class IndividualGoals {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID individualGoalId;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Double goalAmount;

    @Column(nullable = false)
    private Double amountContributed;

    @OneToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @Enumerated(EnumType.STRING)
    private GoalFrequency frequency;

    @Enumerated(EnumType.STRING)
    private GoalStatus status;

    @Column(nullable = false)
    private Date createdDate;

    @Column(nullable = false)
    private Date targetDate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
}