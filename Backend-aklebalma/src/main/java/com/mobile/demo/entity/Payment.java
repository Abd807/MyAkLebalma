package com.mobile.demo.entity;

import jakarta.persistence.*;
import com.mobile.demo.enums.PaymentStatus;
import com.mobile.demo.enums.PaymentMethod;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;
    
    @Column
    private LocalDateTime paymentDate;
    
    @Column(nullable = false)
    private LocalDateTime dueDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column
    private PaymentMethod method;
    
    @Column
    private String transactionId;
    
    @Column(name = "payment_plan_id")
    private Long paymentPlanId;
    
    @Column(name = "user_id")
    private Long userId;
    
    // Numéro de la tranche (1ère, 2ème, 3ème, etc.)
    @Column
    private Integer installmentNumber;
    
    // Informations de suivi
    @Column
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime reminderSentAt;
    
    // Constructeurs
    public Payment() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Payment(BigDecimal amount, LocalDateTime dueDate, Long paymentPlanId, Long userId, Integer installmentNumber) {
        this();
        this.amount = amount;
        this.dueDate = dueDate;
        this.paymentPlanId = paymentPlanId;
        this.userId = userId;
        this.installmentNumber = installmentNumber;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }
    
    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
    
    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }
    
    public PaymentMethod getMethod() { return method; }
    public void setMethod(PaymentMethod method) { this.method = method; }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    
    public Long getPaymentPlanId() { return paymentPlanId; }
    public void setPaymentPlanId(Long paymentPlanId) { this.paymentPlanId = paymentPlanId; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Integer getInstallmentNumber() { return installmentNumber; }
    public void setInstallmentNumber(Integer installmentNumber) { this.installmentNumber = installmentNumber; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getReminderSentAt() { return reminderSentAt; }
    public void setReminderSentAt(LocalDateTime reminderSentAt) { this.reminderSentAt = reminderSentAt; }
    
    // Méthodes utiles
    public void processPayment(PaymentMethod method, String transactionId) {
        this.paymentDate = LocalDateTime.now();
        this.method = method;
        this.transactionId = transactionId;
        this.status = PaymentStatus.COMPLETED;
    }
    
    public void markAsPaid() {
        this.paymentDate = LocalDateTime.now();
        this.status = PaymentStatus.COMPLETED;
    }
    
    public void sendReminder() {
        this.reminderSentAt = LocalDateTime.now();
    }
    
    public boolean isOverdue() {
        return LocalDateTime.now().isAfter(this.dueDate) && this.status != PaymentStatus.COMPLETED;
    }
    
    public boolean isPending() {
        return this.status == PaymentStatus.PENDING;
    }
}
