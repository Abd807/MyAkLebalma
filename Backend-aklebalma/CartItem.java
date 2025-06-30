package com.mobile.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
public class CartItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal unitPrice;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalPrice;
    
    @Column(name = "cart_id")
    private Long cartId;
    
    @Column(name = "product_id")
    private Long productId;
    
    // Constructeurs
    public CartItem() {}
    
    public CartItem(Integer quantity, BigDecimal unitPrice, Long cartId, Long productId) {
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.cartId = cartId;
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
    
    public Long getCartId() { return cartId; }
    public void setCartId(Long cartId) { this.cartId = cartId; }
    
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    
    // Méthodes utiles
    public void calculateTotal() {
        if (this.quantity != null && this.unitPrice != null) {
            this.totalPrice = this.unitPrice.multiply(BigDecimal.valueOf(this.quantity));
        }
    }
    
    public void updateQuantity(Integer newQuantity) {
        this.quantity = newQuantity;
        this.calculateTotal();
    }
}
