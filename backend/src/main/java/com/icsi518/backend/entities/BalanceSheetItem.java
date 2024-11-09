package com.icsi518.backend.entities;

import java.util.Date;
import java.util.UUID;

import com.icsi518.backend.enums.ItemType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
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

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private Date transactionDate;

    @OneToOne
    @JoinColumn(name = "account_id")
    private Account account;
}
