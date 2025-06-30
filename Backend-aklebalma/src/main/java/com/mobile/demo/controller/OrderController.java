package com.mobile.demo.controller;

import com.mobile.demo.entity.Order;
import com.mobile.demo.entity.User;
import com.mobile.demo.enums.OrderStatus;
import com.mobile.demo.service.OrderService;
import com.mobile.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    // GET /api/users/{userId}/orders - Récupérer les commandes d'un utilisateur
    @GetMapping("/users/{userId}/orders")
    public ResponseEntity<?> getUserOrders(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "orderDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        try {
            System.out.println("📋 GET /api/users/" + userId + "/orders");
            System.out.println("📄 Page: " + page + ", Limit: " + limit);

            // TEMPORAIRE: Créer des commandes de test s'il n'y en a pas
            createTestOrdersIfEmpty(userId);

            // Vérifier que l'utilisateur existe
            User user = userService.findById(userId);
            if (user == null) {
                System.out.println("❌ Utilisateur non trouvé: " + userId);
                return ResponseEntity.notFound().build();
            }

            // Créer la pagination (Spring commence à 0)
            Sort sort = sortDir.equalsIgnoreCase("desc")
                    ? Sort.by(sortBy).descending()
                    : Sort.by(sortBy).ascending();

            Pageable pageable = PageRequest.of(page - 1, limit, sort);

            // Récupérer les commandes
            Page<Order> ordersPage = orderService.findOrdersByUserId(userId, pageable);
            List<Order> orders = ordersPage.getContent();

            System.out.println("✅ " + orders.size() + " commandes trouvées pour user " + userId);

            // Préparer la réponse avec format compatible frontend
            Map<String, Object> response = new HashMap<>();
            response.put("orders", orders);
            response.put("currentPage", page);
            response.put("totalPages", ordersPage.getTotalPages());
            response.put("totalElements", ordersPage.getTotalElements());
            response.put("hasNext", ordersPage.hasNext());
            response.put("hasPrevious", ordersPage.hasPrevious());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ Erreur getUserOrders: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors du chargement des commandes");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // Méthode temporaire pour créer des commandes de test
    private void createTestOrdersIfEmpty(Long userId) {
        try {
            long orderCount = orderService.countOrdersByUserId(userId);
            if (orderCount == 0) {
                System.out.println("🧪 Création de commandes de test pour user " + userId);

                // Créer 3 commandes de test
                Order order1 = new Order(userId, new java.math.BigDecimal("850000"));
                order1.setStatus(com.mobile.demo.enums.OrderStatus.DELIVERED);
                orderService.saveOrder(order1);

                Order order2 = new Order(userId, new java.math.BigDecimal("450000"));
                order2.setStatus(com.mobile.demo.enums.OrderStatus.SHIPPED);
                orderService.saveOrder(order2);

                Order order3 = new Order(userId, new java.math.BigDecimal("85000"));
                order3.setStatus(com.mobile.demo.enums.OrderStatus.PENDING);
                orderService.saveOrder(order3);

                System.out.println("✅ 3 commandes de test créées");
            }
        } catch (Exception e) {
            System.out.println("⚠️ Erreur création commandes test: " + e.getMessage());
        }
    }

    // GET /api/orders/{orderId} - Récupérer une commande spécifique
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId) {
        try {
            System.out.println("🔍 GET /api/orders/" + orderId);

            Order order = orderService.findById(orderId);
            if (order == null) {
                System.out.println("❌ Commande non trouvée: " + orderId);
                return ResponseEntity.notFound().build();
            }

            System.out.println("✅ Commande trouvée: " + order.getOrderNumber());
            return ResponseEntity.ok(order);

        } catch (Exception e) {
            System.out.println("❌ Erreur getOrderById: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors du chargement de la commande");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // POST /api/orders - Créer une nouvelle commande
    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> orderData) {
        try {
            System.out.println("📦 POST /api/orders");
            System.out.println("📋 Order data: " + orderData);

            Order newOrder = orderService.createOrder(orderData);

            System.out.println("✅ Commande créée: " + newOrder.getOrderNumber());
            return ResponseEntity.ok(newOrder);

        } catch (Exception e) {
            System.out.println("❌ Erreur createOrder: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors de la création de la commande");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // PUT /api/orders/{orderId}/cancel - Annuler une commande
    @PutMapping("/orders/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> cancelData
    ) {
        try {
            System.out.println("❌ PUT /api/orders/" + orderId + "/cancel");

            String reason = cancelData.get("reason");
            Order cancelledOrder = orderService.cancelOrder(orderId, reason);

            System.out.println("✅ Commande annulée: " + cancelledOrder.getOrderNumber());
            return ResponseEntity.ok(cancelledOrder);

        } catch (Exception e) {
            System.out.println("❌ Erreur cancelOrder: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors de l'annulation de la commande");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // PUT /api/orders/{orderId}/status - Mettre à jour le statut (admin)
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> statusData
    ) {
        try {
            System.out.println("🔄 PUT /api/orders/" + orderId + "/status");

            String status = statusData.get("status");
            String trackingNumber = statusData.get("trackingNumber");

            Order updatedOrder = orderService.updateOrderStatus(orderId, status, trackingNumber);

            System.out.println("✅ Statut mis à jour: " + updatedOrder.getStatus());
            return ResponseEntity.ok(updatedOrder);

        } catch (Exception e) {
            System.out.println("❌ Erreur updateOrderStatus: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors de la mise à jour du statut");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // GET /api/orders/{orderId}/tracking - Récupérer le suivi d'une commande
    @GetMapping("/orders/{orderId}/tracking")
    public ResponseEntity<?> getOrderTracking(@PathVariable Long orderId) {
        try {
            System.out.println("📍 GET /api/orders/" + orderId + "/tracking");

            Map<String, Object> trackingInfo = orderService.getOrderTracking(orderId);

            System.out.println("✅ Suivi récupéré pour commande: " + orderId);
            return ResponseEntity.ok(trackingInfo);

        } catch (Exception e) {
            System.out.println("❌ Erreur getOrderTracking: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors du récupération du suivi");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // PUT /api/orders/{orderId}/confirm-delivery - Confirmer la livraison
    @PutMapping("/orders/{orderId}/confirm-delivery")
    public ResponseEntity<?> confirmDelivery(
            @PathVariable Long orderId,
            @RequestBody Map<String, Object> deliveryData
    ) {
        try {
            System.out.println("✅ PUT /api/orders/" + orderId + "/confirm-delivery");

            Integer rating = (Integer) deliveryData.get("rating");
            String review = (String) deliveryData.get("review");

            Order confirmedOrder = orderService.confirmDelivery(orderId, rating, review);

            System.out.println("✅ Livraison confirmée: " + confirmedOrder.getOrderNumber());
            return ResponseEntity.ok(confirmedOrder);

        } catch (Exception e) {
            System.out.println("❌ Erreur confirmDelivery: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors de la confirmation de livraison");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // GET /api/orders - Récupérer toutes les commandes (admin)
    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        try {
            System.out.println("📋 GET /api/orders (admin)");

            Sort sort = sortDir.equalsIgnoreCase("desc")
                    ? Sort.by(sortBy).descending()
                    : Sort.by(sortBy).ascending();

            Pageable pageable = PageRequest.of(page - 1, limit, sort);

            Page<Order> ordersPage;
            if (status != null && !status.isEmpty()) {
                ordersPage = orderService.findOrdersByStatus(status, pageable);
            } else {
                ordersPage = orderService.findAllOrders(pageable);
            }

            List<Order> orders = ordersPage.getContent();
            System.out.println("✅ " + orders.size() + " commandes trouvées (admin)");

            Map<String, Object> response = new HashMap<>();
            response.put("orders", orders);
            response.put("currentPage", page);
            response.put("totalPages", ordersPage.getTotalPages());
            response.put("totalElements", ordersPage.getTotalElements());
            response.put("hasNext", ordersPage.hasNext());
            response.put("hasPrevious", ordersPage.hasPrevious());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ Erreur getAllOrders: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors du chargement des commandes admin");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // GET /api/orders/stats - Statistiques des commandes (admin)
    @GetMapping("/orders/stats")
    public ResponseEntity<?> getOrderStats(
            @RequestParam(defaultValue = "month") String period
    ) {
        try {
            System.out.println("📊 GET /api/orders/stats");

            Map<String, Object> stats = orderService.getOrderStatistics(period);

            System.out.println("✅ Statistiques générées pour période: " + period);
            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            System.out.println("❌ Erreur getOrderStats: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors du calcul des statistiques");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}