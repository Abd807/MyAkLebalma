package com.mobile.demo.entity;

import jakarta.persistence.*;
import com.mobile.demo.enums.PaymentPlanStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_plans")
public class PaymentPlan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Integer numberOfInstallments; // 3, 4, 5, 6, 10
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal installmentAmount;
    
    @Column(nullable = false)
    private LocalDateTime startDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentPlanStatus status = PaymentPlanStatus.ACTIVE;
    
    @Column(name = "order_id")
    private Long orderId;
    
    @Column(name = "user_id")
    private Long userId;
    
    // Informations de suivi
    @Column
    private Integer paidInstallments = 0;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal amountPaid = BigDecimal.ZERO;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal remainingAmount;
    
    // Constructeurs
    public PaymentPlan() {
        this.startDate = LocalDateTime.now();
    }
    
    public PaymentPlan(Integer numberOfInstallments, BigDecimal totalAmount, Long orderId, Long userId) {
        this();
        this.numberOfInstallments = numberOfInstallments;
        this.totalAmount = totalAmount;
        this.orderId = orderId;
        this.userId = userId;
        this.calculateInstallmentAmount();
        this.remainingAmount = totalAmount;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Integer getNumberOfInstallments() { return numberOfInstallments; }
    public void setNumberOfInstallments(Integer numberOfInstallments) { 
        this.numberOfInstallments = numberOfInstallments;
        this.calculateInstallmentAmount();
    }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { 
        this.totalAmount = totalAmount;
        this.calculateInstallmentAmount();
    }
    
    public BigDecimal getInstallmentAmount() { return installmentAmount; }
    public void setInstallmentAmount(BigDecimal installmentAmount) { this.installmentAmount = installmentAmount; }
    
    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }
    
    public PaymentPlanStatus getStatus() { return status; }
    public void setStatus(PaymentPlanStatus status) { this.status = status; }
    
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Integer getPaidInstallments() { return paidInstallments; }
    public void setPaidInstallments(Integer paidInstallments) { this.paidInstallments = paidInstallments; }
    
    public BigDecimal getAmountPaid() { return amountPaid; }
    public void setAmountPaid(BigDecimal amountPaid) { this.amountPaid = amountPaid; }
    
    public BigDecimal getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; }
    
    // Méthodes utiles
    private void calculateInstallmentAmount() {
        if (this.totalAmount != null && this.numberOfInstallments != null && this.numberOfInstallments > 0) {
            this.installmentAmount = this.totalAmount.divide(BigDecimal.valueOf(this.numberOfInstallments), 2, BigDecimal.ROUND_HALF_UP);
        }
    }
    
    public boolean checkEligibility(BigDecimal creditLimit) {
        return this.totalAmount.compareTo(creditLimit) <= 0;
    }
    
    public void recordPayment(BigDecimal amount) {
        this.amountPaid = this.amountPaid.add(amount);
        this.remainingAmount = this.totalAmount.subtract(this.amountPaid);
        this.paidInstallments++;
        
        if (this.remainingAmount.compareTo(BigDecimal.ZERO) <= 0) {
            this.status = PaymentPlanStatus.COMPLETED;
        }
    }
    
    public boolean isCompleted() {
        return this.status == PaymentPlanStatus.COMPLETED;
    }
}
