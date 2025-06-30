package com.mobile.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "agencies")
public class Agency {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String address;
    
    @Column
    private String phoneNumber;
    
    @Column
    private String email;
    
    @Column
    private Double latitude;
    
    @Column
    private Double longitude;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    // Informations supplémentaires
    @Column
    private String city;
    
    @Column
    private String region;
    
    @Column
    private String openingHours;
    
    @Column
    private String services; // Services disponibles dans cette agence
    
    @Column
    private String manager; // Nom du responsable
    
    // Constructeurs
    public Agency() {}
    
    public Agency(String name, String address, String phoneNumber, String email) {
        this.name = name;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    
    public String getOpeningHours() { return openingHours; }
    public void setOpeningHours(String openingHours) { this.openingHours = openingHours; }
    
    public String getServices() { return services; }
    public void setServices(String services) { this.services = services; }
    
    public String getManager() { return manager; }
    public void setManager(String manager) { this.manager = manager; }
    
    // Méthodes utiles
    public String getFullContactInfo() {
        return name + " - " + phoneNumber + " - " + email;
    }
    
    public boolean hasCoordinates() {
        return latitude != null && longitude != null;
    }
    
    public String getLocationString() {
        if (hasCoordinates()) {
            return latitude + "," + longitude;
        }
        return "Coordonnées non disponibles";
    }
}
