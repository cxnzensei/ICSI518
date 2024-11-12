package com.icsi518.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.icsi518.backend.enums.TransactionCategory;
import com.icsi518.backend.enums.TransactionType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID transactionId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String date;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private TransactionType type;

    @Column(nullable = false)
    private TransactionCategory category; // if this is enum TransactionCategory then categories will be static (potential problem: i`` then user will only be able to filter by GOALS rather than specific goal (ex: GOAL 1, GOAL 2, etc))

    @Column(nullable = false)
    private Boolean pending;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "account_id", referencedColumnName = "accountId")
    @JsonIgnore
    private Account account;

    @Transient
    private UUID accountId;

    @PostLoad
    private void setAccountId() {
        if (account != null) {
            this.accountId = account.getAccountId();
        }
    }
}
