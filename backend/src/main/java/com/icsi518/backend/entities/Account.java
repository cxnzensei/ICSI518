package com.icsi518.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.icsi518.backend.enums.AccountType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID accountId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private AccountType type;

    @Column(nullable = false)
    private Double availableBalance;

    @Column(nullable = false)
    private Double currentBalance;

    @Column(nullable = false)
    private String institution;

    @Column(nullable = false)
    private String accountNumber;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    @JsonIgnore
    private User user;
}
