package com.mobile.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 2000)
    private String description;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;
    
    @Column(nullable = false)
    private Integer stockQuantity = 0;
    
    @Column
    private String imageUrl;
    
    @Column
    private String brand;
    
    @Column
    private String model;
    
    @Column(nullable = false)
    private Boolean isAvailable = true;
    
    @Column(nullable = false)
    private LocalDateTime dateAdded;
    
    @Column(name = "category_id")
    private Long categoryId;
    
    // Constructeurs
    public Product() {
        this.dateAdded = LocalDateTime.now();
    }
    
    public Product(String name, String description, BigDecimal price, Integer stockQuantity) {
        this();
        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    
    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    
    public LocalDateTime getDateAdded() { return dateAdded; }
    public void setDateAdded(LocalDateTime dateAdded) { this.dateAdded = dateAdded; }
    
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    
    // Méthodes utiles
    public void updateStock(Integer quantity) {
        this.stockQuantity = Math.max(0, this.stockQuantity - quantity);
        this.isAvailable = this.stockQuantity > 0;
    }
    
    public boolean checkAvailability(Integer requestedQuantity) {
        return this.stockQuantity >= requestedQuantity && this.isAvailable;
    }
    
    public BigDecimal applyDiscount(BigDecimal discountPercentage) {
        BigDecimal discount = this.price.multiply(discountPercentage.divide(BigDecimal.valueOf(100)));
        return this.price.subtract(discount);
    }
}
