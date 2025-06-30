package com.mobile.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal unitPrice;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalPrice;
    
    @Column(name = "order_id")
    private Long orderId;
    
    @Column(name = "product_id")
    private Long productId;
    
    // Informations du produit au moment de la commande
    @Column
    private String productName;
    
    @Column
    private String productBrand;
    
    @Column
    private String productModel;
    
    // Constructeurs
    public OrderItem() {}
    
    public OrderItem(Integer quantity, BigDecimal unitPrice, Long orderId, Long productId) {
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.orderId = orderId;
        this.productId = productId;
        this.calculateTotal();
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { 
        this.quantity = quantity;
        this.calculateTotal();
    }
    
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { 
        this.unitPrice = unitPrice;
        this.calculateTotal();
    }
    
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
    
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    
    public String getProductBrand() { return productBrand; }
    public void setProductBrand(String productBrand) { this.productBrand = productBrand; }
    
    public String getProductModel() { return productModel; }
    public void setProductModel(String productModel) { this.productModel = productModel; }
    
    // Méthodes utiles
    public void calculateTotal() {
        if (this.quantity != null && this.unitPrice != null) {
            this.totalPrice = this.unitPrice.multiply(BigDecimal.valueOf(this.quantity));
        }
    }
    
    public BigDecimal getSubtotal() {
        return this.totalPrice;
    }
}
