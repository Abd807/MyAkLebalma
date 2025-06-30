package com.mobile.demo.service;

import com.mobile.demo.entity.Cart;
import com.mobile.demo.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    // Récupérer le panier d'un utilisateur
    public Cart getUserCart(Long userId) {
        System.out.println("🛒 Service: Récupération panier pour user " + userId);

        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
            // Créer un panier vide s'il n'existe pas
            cart = new Cart();
            cart.setUserId(userId);
            cart = cartRepository.save(cart);
            System.out.println("✅ Nouveau panier créé pour user " + userId);
        }

        return cart;
    }

    // Mettre à jour le montant total du panier
    public Cart updateCartTotal(Long userId, BigDecimal totalAmount) {
        System.out.println("💰 Service: Mise à jour montant panier - User: " + userId + ", Total: " + totalAmount);

        Cart cart = getUserCart(userId);
        cart.setTotalAmount(totalAmount);
        cart.setUpdatedAt(LocalDateTime.now());

        return cartRepository.save(cart);
    }

    // Vider le panier
    public void clearCart(Long userId) {
        System.out.println("🧹 Service: Vidage du panier - User: " + userId);

        Cart cart = cartRepository.findByUserId(userId);
        if (cart != null) {
            cart.setTotalAmount(BigDecimal.ZERO);
            cart.setUpdatedAt(LocalDateTime.now());
            cartRepository.save(cart);
        }
    }

    // Obtenir le résumé du panier
    public Map<String, Object> getCartSummary(Long userId) {
        System.out.println("📊 Service: Résumé du panier - User: " + userId);

        Cart cart = getUserCart(userId);

        Map<String, Object> summary = new HashMap<>();
        summary.put("userId", userId);
        summary.put("totalAmount", cart.getTotalAmount());
        summary.put("isEmpty", cart.getTotalAmount().compareTo(BigDecimal.ZERO) == 0);
        summary.put("createdAt", cart.getCreatedAt());
        summary.put("updatedAt", cart.getUpdatedAt());

        // Calcul des frais de livraison
        BigDecimal shippingFee = cart.getTotalAmount().compareTo(BigDecimal.valueOf(50000)) >= 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(5000);

        BigDecimal finalTotal = cart.getTotalAmount().add(shippingFee);

        summary.put("shippingFee", shippingFee);
        summary.put("finalTotal", finalTotal);
        summary.put("freeShippingThreshold", 50000);
        summary.put("isEligibleForFreeShipping", cart.getTotalAmount().compareTo(BigDecimal.valueOf(50000)) >= 0);

        return summary;
    }

    // Supprimer complètement le panier
    public void deleteCart(Long userId) {
        System.out.println("🗑️ Service: Suppression du panier - User: " + userId);
        cartRepository.deleteByUserId(userId);
    }
}