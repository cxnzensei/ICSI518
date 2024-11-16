package com.icsi518.backend.entities;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.icsi518.backend.entities.Account.MinimalAccountView;
import com.icsi518.backend.enums.Frequency;
import com.icsi518.backend.enums.ItemType;

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
@Table(name = "balance_sheet_items")
public class BalanceSheetItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID itemId;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemType type;

    private String description;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private Integer frequencyNumber;

    @Column(nullable = false)
    private Frequency frequency;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "account_id", referencedColumnName = "accountId")
    @JsonIgnore
    private Account account;

    public interface BalanceSheetItemView {

        UUID getItemId();

        String getName();

        ItemType getType();

        String getDescription();

        Double getAmount();

        Integer getFrequencyNumber();

        Frequency getFrequency();

        MinimalAccountView getAccount();

    }
}
