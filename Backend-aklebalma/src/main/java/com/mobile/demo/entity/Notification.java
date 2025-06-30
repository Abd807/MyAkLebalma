package com.mobile.demo.entity;

import jakarta.persistence.*;
import com.mobile.demo.enums.NotificationType;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, length = 1000)
    private String message;
    
    @Column(nullable = false)
    private LocalDateTime sentDate;
    
    @Column(nullable = false)
    private Boolean isRead = false;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;
    
    @Column(name = "user_id")
    private Long userId;
    
    // Informations optionnelles
    @Column
    private String actionUrl; // Lien vers une action spécifique
    
    @Column
    private LocalDateTime readDate;
    
    @Column
    private String imageUrl; // Icône ou image de la notification
    
    // Priorité (HIGH, MEDIUM, LOW)
    @Column
    private String priority = "MEDIUM";
    
    // Constructeurs
    public Notification() {
        this.sentDate = LocalDateTime.now();
    }
    
    public Notification(String title, String message, NotificationType type, Long userId) {
        this();
        this.title = title;
        this.message = message;
        this.type = type;
        this.userId = userId;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public LocalDateTime getSentDate() { return sentDate; }
    public void setSentDate(LocalDateTime sentDate) { this.sentDate = sentDate; }
    
    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    
    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }
    
    public LocalDateTime getReadDate() { return readDate; }
    public void setReadDate(LocalDateTime readDate) { this.readDate = readDate; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    // Méthodes utiles
    public void markAsRead() {
        this.isRead = true;
        this.readDate = LocalDateTime.now();
    }
    
    public boolean isUnread() {
        return !this.isRead;
    }
    
    public boolean isHighPriority() {
        return "HIGH".equals(this.priority);
    }
}
