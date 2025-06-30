package com.mobile.demo.entity;

import jakarta.persistence.*;
import com.mobile.demo.enums.OrderStatus;
import com.mobile.demo.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String orderNumber;
    
    @Column(nullable = false)
    private LocalDateTime orderDate;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    @Column
    private LocalDateTime deliveryDate;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "delivery_address_id")
    private Long deliveryAddressId;
    
    // Constructeurs
    public Order() {
        this.orderDate = LocalDateTime.now();
        this.generateOrderNumber();
    }
    
    public Order(Long userId, BigDecimal totalAmount) {
        this();
        this.userId = userId;
        this.totalAmount = totalAmount;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    
    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    
    public LocalDateTime getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDateTime deliveryDate) { this.deliveryDate = deliveryDate; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getDeliveryAddressId() { return deliveryAddressId; }
    public void setDeliveryAddressId(Long deliveryAddressId) { this.deliveryAddressId = deliveryAddressId; }
    
    // Méthodes utiles
    private void generateOrderNumber() {
        this.orderNumber = "AKL-" + System.currentTimeMillis();
    }
    
    public void confirmOrder() {
        this.status = OrderStatus.CONFIRMED;
    }
    
    public void shipOrder() {
        this.status = OrderStatus.SHIPPED;
    }
    
    public void deliverOrder() {
        this.status = OrderStatus.DELIVERED;
        this.deliveryDate = LocalDateTime.now();
    }
}
