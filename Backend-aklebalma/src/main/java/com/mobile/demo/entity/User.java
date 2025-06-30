package com.mobile.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    private LocalDateTime dateCreated;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(precision = 15, scale = 2)
    private BigDecimal purchasingPower = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    private BigDecimal remainingToPay = BigDecimal.ZERO;

    @Column(name = "role")
    private String role;

    // Constructeur
    public User() {
        this.dateCreated = LocalDateTime.now();
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public LocalDateTime getDateCreated() { return dateCreated; }
    public void setDateCreated(LocalDateTime dateCreated) { this.dateCreated = dateCreated; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public BigDecimal getPurchasingPower() { return purchasingPower; }
    public void setPurchasingPower(BigDecimal purchasingPower) { this.purchasingPower = purchasingPower; }

    public BigDecimal getRemainingToPay() { return remainingToPay; }
    public void setRemainingToPay(BigDecimal remainingToPay) { this.remainingToPay = remainingToPay; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    // Méthodes utiles
    public String getFullName() {
        return firstName + " " + lastName;
    }
}