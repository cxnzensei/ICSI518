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
@Table(name = "accounts")
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

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    @JsonIgnore
    private User user;
}
