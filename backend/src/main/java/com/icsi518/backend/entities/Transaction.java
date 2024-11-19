package com.icsi518.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.icsi518.backend.entities.Account.MinimalAccountView;
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
    private Date date;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private TransactionType type;

    @Column(nullable = false)
    private TransactionCategory category;

    @Column(nullable = false)
    private Boolean pending;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "account_id", referencedColumnName = "accountId")
    @JsonIgnore
    private Account account;

    public interface TransactionView {
        
        UUID getTransactionId();

        String getName();

        Date getDate();

        Double getAmount();

        TransactionType getType();

        TransactionCategory getCategory();

        Boolean getPending();

        MinimalAccountView getAccount();
    }
}
