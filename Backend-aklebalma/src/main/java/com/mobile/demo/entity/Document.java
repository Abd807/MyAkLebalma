package com.mobile.demo.entity;

import jakarta.persistence.*;
import com.mobile.demo.enums.DocumentType;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
public class Document {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String fileName;
    
    @Column(nullable = false)
    private String fileType; // pdf, jpg, png, etc.
    
    @Column(nullable = false)
    private String fileUrl;
    
    @Column(nullable = false)
    private LocalDateTime uploadDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType type;
    
    @Column(name = "user_id")
    private Long userId;
    
    // Informations de validation
    @Column
    private Boolean isValidated = false;
    
    @Column
    private LocalDateTime validatedDate;
    
    @Column
    private String validatedBy;
    
    @Column
    private String rejectionReason;
    
    // Informations techniques
    @Column
    private Long fileSize; // en bytes
    
    @Column
    private String mimeType;
    
    // Constructeurs
    public Document() {
        this.uploadDate = LocalDateTime.now();
    }
    
    public Document(String fileName, String fileType, String fileUrl, DocumentType type, Long userId) {
        this();
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileUrl = fileUrl;
        this.type = type;
        this.userId = userId;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    
    public LocalDateTime getUploadDate() { return uploadDate; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }
    
    public DocumentType getType() { return type; }
    public void setType(DocumentType type) { this.type = type; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Boolean getIsValidated() { return isValidated; }
    public void setIsValidated(Boolean isValidated) { this.isValidated = isValidated; }
    
    public LocalDateTime getValidatedDate() { return validatedDate; }
    public void setValidatedDate(LocalDateTime validatedDate) { this.validatedDate = validatedDate; }
    
    public String getValidatedBy() { return validatedBy; }
    public void setValidatedBy(String validatedBy) { this.validatedBy = validatedBy; }
    
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
    
    // Méthodes utiles
    public void validate(String validator) {
        this.isValidated = true;
        this.validatedDate = LocalDateTime.now();
        this.validatedBy = validator;
        this.rejectionReason = null;
    }
    
    public void reject(String reason) {
        this.isValidated = false;
        this.rejectionReason = reason;
    }
    
    public String getFileSizeFormatted() {
        if (fileSize == null) return "Inconnu";
        if (fileSize < 1024) return fileSize + " B";
        if (fileSize < 1024 * 1024) return (fileSize / 1024) + " KB";
        return (fileSize / (1024 * 1024)) + " MB";
    }
}
