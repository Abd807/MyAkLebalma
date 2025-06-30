// src/main/java/com/mobile/demo/enums/NotificationType.java
package com.mobile.demo.enums;

public enum NotificationType {
    ORDER("Commande"),
    PAYMENT("Paiement"),
    DELIVERY("Livraison"),
    PROMOTION("Promotion"),
    ACCOUNT("Compte"),
    SECURITY("Sécurité"),
    SYSTEM("Système"),
    INSTALLATION("Installation"),
    SUPPORT("Support"),
    CREDIT("Crédit");

    private final String displayName;

    NotificationType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}