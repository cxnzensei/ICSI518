package com.icsi518.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
    private String appwriteId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String paymentChannel;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private Boolean pending;

    @Column(nullable = false)
    private String category;

    private String date;

    private String image;

    private String createdAt;

    private String channel;

    private String senderBankId;

    private String receiverBankId;

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
