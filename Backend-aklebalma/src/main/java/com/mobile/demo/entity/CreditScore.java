package com.mobile.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "credit_scores")
public class CreditScore {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Integer score = 0; // 0-1000
    
    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal creditLimit = BigDecimal.ZERO;
    
    @Column(nullable = false)
    private LocalDateTime lastUpdated;
    
    @Column
    private String riskLevel; // LOW, MEDIUM, HIGH
    
    @Column(name = "user_id")
    private Long userId;
    
    // Constructeur
    public CreditScore() {
        this.lastUpdated = LocalDateTime.now();
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    
    public BigDecimal getCreditLimit() { return creditLimit; }
    public void setCreditLimit(BigDecimal creditLimit) { this.creditLimit = creditLimit; }
    
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
    
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    // Méthode utile
    public boolean checkEligibility(BigDecimal amount) {
        return this.creditLimit.compareTo(amount) >= 0 && this.score >= 300;
    }
}
