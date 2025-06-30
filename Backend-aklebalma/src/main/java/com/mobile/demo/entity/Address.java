package com.mobile.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "addresses")
public class Address {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String street;
    
    @Column(nullable = false)
    private String city;
    
    @Column
    private String region;
    
    @Column
    private String postalCode;
    
    @Column(nullable = false)
    private String country = "Sénégal";
    
    @Column(nullable = false)
    private Boolean isDefault = false;
    
    @Column(name = "user_id")
    private Long userId;
    
    // Constructeurs
    public Address() {}
    
    public Address(String street, String city, String region, String country) {
        this.street = street;
        this.city = city;
        this.region = region;
        this.country = country;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    
    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    
    public Boolean getIsDefault() { return isDefault; }
    public void setIsDefault(Boolean isDefault) { this.isDefault = isDefault; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    // Méthodes utiles
    public String getFullAddress() {
        return street + ", " + city + (region != null ? ", " + region : "") + ", " + country;
    }
    
    public void setAsDefault() {
        this.isDefault = true;
    }
}
