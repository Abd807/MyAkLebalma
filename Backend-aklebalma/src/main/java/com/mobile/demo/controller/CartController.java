package com.mobile.demo.controller;

import com.mobile.demo.entity.Cart;
import com.mobile.demo.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    // GET /api/users/{userId}/cart - Récupérer le panier d'un utilisateur
    @GetMapping("/users/{userId}/cart")
    public ResponseEntity<?> getUserCart(@PathVariable Long userId) {
        try {
            System.out.println("🛒 GET /api/users/" + userId + "/cart");

            Map<String, Object> cartSummary = cartService.getCartSummary(userId);

            System.out.println("✅ Panier récupéré pour user " + userId);
            return ResponseEntity.ok(cartSummary);

        } catch (Exception e) {
            System.out.println("❌ Erreur getUserCart: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors du chargement du panier");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // PUT /api/users/{userId}/cart - Mettre à jour le total du panier
    @PutMapping("/users/{userId}/cart")
    public ResponseEntity<?> updateCart(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> requestData
    ) {
        try {
            System.out.println("💰 PUT /api/users/" + userId + "/cart");

            BigDecimal totalAmount = new BigDecimal(requestData.get("totalAmount").toString());
            System.out.println("💰 Nouveau total: " + totalAmount);

            Cart updatedCart = cartService.updateCartTotal(userId, totalAmount);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Panier mis à jour");
            response.put("cart", updatedCart);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ Erreur updateCart: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors de la mise à jour du panier");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // DELETE /api/users/{userId}/cart - Vider le panier
    @DeleteMapping("/users/{userId}/cart")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        try {
            System.out.println("🧹 DELETE /api/users/" + userId + "/cart");

            cartService.clearCart(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Panier vidé");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ Erreur clearCart: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors du vidage du panier");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}