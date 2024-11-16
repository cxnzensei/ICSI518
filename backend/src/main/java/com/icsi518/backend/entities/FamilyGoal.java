package com.icsi518.backend.entities;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.icsi518.backend.dtos.IndividualGoalDto;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "family_goals")
public class FamilyGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID familyGoalId;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Double goalAmount;

    @Column(nullable = false)
    private Integer frequencyNumber;

    private String description;

    @Enumerated(EnumType.STRING)
    private Frequency frequency;

    @Enumerated(EnumType.STRING)
    private GoalStatus status;

    @Column(nullable = false)
    private Date createdDate;

    @Column(nullable = false)
    private Date targetDate;

    @ManyToOne
    @JoinColumn(name = "family_id", nullable = false)
    private Family family;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "family_goal_id")
    private List<IndividualGoal> individualGoals;

    public interface FamilyGoalView {

        UUID getFamilyGoalId();

        String getName();

        Double getGoalAmount();

        Integer getFrequencyNumber();

        String getDescription();

        Frequency getFrequency();

        GoalStatus getStatus();

        Date getCreatedDate();

        Date getTargetDate();

        List<IndividualGoalDto> getIndividualGoals();
    }
}
