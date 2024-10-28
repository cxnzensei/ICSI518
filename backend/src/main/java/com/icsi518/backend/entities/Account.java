package com.icsi518.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID accountId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String appwriteItemId;

    @Column(nullable = false)
    private Double availableBalance;

    @Column(nullable = false)
    private Double currentBalance;

    @Column(nullable = false)
    private String officialName;

    @Column(nullable = false, length = 4)
    private String mask;

    @Column(nullable = false)
    private String institutionId;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String subtype;

    @Column(nullable = false, unique = true)
    private String sharableId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
