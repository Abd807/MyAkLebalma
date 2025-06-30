package com.mobile.demo.service;

import com.mobile.demo.entity.Order;
import com.mobile.demo.enums.OrderStatus;
import com.mobile.demo.enums.PaymentStatus;
import com.mobile.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // Récupérer les commandes d'un utilisateur
    public Page<Order> findOrdersByUserId(Long userId, Pageable pageable) {
        System.out.println("📋 Service: Recherche commandes pour user " + userId);
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId, pageable);
    }

    // Sauvegarder une commande
    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    // Compter les commandes d'un utilisateur
    public long countOrdersByUserId(Long userId) {
        try {
            return orderRepository.countByUserId(userId);
        } catch (Exception e) {
            System.out.println("⚠️ Erreur count orders: " + e.getMessage());
            return 0;
        }
    }

    // Récupérer une commande par ID
    public Order findById(Long orderId) {
        System.out.println("🔍 Service: Recherche commande " + orderId);
        return orderRepository.findById(orderId).orElse(null);
    }

    // Créer une nouvelle commande
    public Order createOrder(Map<String, Object> orderData) {
        System.out.println("📦 Service: Création nouvelle commande");

        Long userId = Long.valueOf(orderData.get("userId").toString());
        BigDecimal totalAmount = new BigDecimal(orderData.get("totalAmount").toString());

        Order order = new Order(userId, totalAmount);

        // Optionnel: adresse de livraison
        if (orderData.containsKey("deliveryAddressId")) {
            Long addressId = Long.valueOf(orderData.get("deliveryAddressId").toString());
            order.setDeliveryAddressId(addressId);
        }

        return orderRepository.save(order);
    }

    // Annuler une commande
    public Order cancelOrder(Long orderId, String reason) {
        System.out.println("❌ Service: Annulation commande " + orderId);

        Order order = findById(orderId);
        if (order == null) {
            throw new RuntimeException("Commande non trouvée: " + orderId);
        }

        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new RuntimeException("Impossible d'annuler une commande déjà livrée");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    // Mettre à jour le statut d'une commande
    public Order updateOrderStatus(Long orderId, String status, String trackingNumber) {
        System.out.println("🔄 Service: Mise à jour statut " + orderId + " -> " + status);

        Order order = findById(orderId);
        if (order == null) {
            throw new RuntimeException("Commande non trouvée: " + orderId);
        }

        try {
            OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(newStatus);

            // Si livré, marquer la date de livraison
            if (newStatus == OrderStatus.DELIVERED) {
                order.deliverOrder();
            }

            return orderRepository.save(order);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Statut invalide: " + status);
        }
    }

    // Obtenir le suivi d'une commande
    public Map<String, Object> getOrderTracking(Long orderId) {
        System.out.println("📍 Service: Suivi commande " + orderId);

        Order order = findById(orderId);
        if (order == null) {
            throw new RuntimeException("Commande non trouvée: " + orderId);
        }

        Map<String, Object> tracking = new HashMap<>();
        tracking.put("orderId", orderId);
        tracking.put("orderNumber", order.getOrderNumber());
        tracking.put("currentStatus", translateStatus(order.getStatus()));
        tracking.put("statusCode", order.getStatus().toString());

        // Générer un numéro de suivi fictif
        tracking.put("trackingNumber", "TRK-" + order.getOrderNumber().substring(4));

        // Date de livraison estimée (5 jours après la commande)
        LocalDateTime estimatedDelivery = order.getOrderDate().plusDays(5);
        tracking.put("estimatedDelivery", estimatedDelivery.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

        // Historique fictif basé sur le statut
        List<Map<String, String>> history = generateTrackingHistory(order);
        tracking.put("history", history);

        return tracking;
    }

    // Confirmer la livraison
    public Order confirmDelivery(Long orderId, Integer rating, String review) {
        System.out.println("✅ Service: Confirmation livraison " + orderId);

        Order order = findById(orderId);
        if (order == null) {
            throw new RuntimeException("Commande non trouvée: " + orderId);
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new RuntimeException("Seules les commandes livrées peuvent être confirmées");
        }

        // Ici vous pourriez ajouter une entité Review/Rating
        // Pour l'instant, on ne fait que confirmer
        System.out.println("📝 Note: " + rating + ", Avis: " + review);

        return order;
    }

    // Récupérer commandes par statut (admin)
    public Page<Order> findOrdersByStatus(String status, Pageable pageable) {
        System.out.println("📋 Service: Recherche commandes par statut " + status);

        try {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            return orderRepository.findByStatusOrderByOrderDateDesc(orderStatus, pageable);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Statut invalide: " + status);
        }
    }

    // Récupérer toutes les commandes (admin)
    public Page<Order> findAllOrders(Pageable pageable) {
        System.out.println("📋 Service: Récupération toutes commandes (admin)");
        return orderRepository.findAllByOrderByOrderDateDesc(pageable);
    }

    // Statistiques des commandes
    public Map<String, Object> getOrderStatistics(String period) {
        System.out.println("📊 Service: Calcul statistiques pour " + period);

        LocalDateTime startDate;
        switch (period.toLowerCase()) {
            case "day":
                startDate = LocalDateTime.now().minusDays(1);
                break;
            case "week":
                startDate = LocalDateTime.now().minusWeeks(1);
                break;
            case "month":
                startDate = LocalDateTime.now().minusMonths(1);
                break;
            case "year":
                startDate = LocalDateTime.now().minusYears(1);
                break;
            default:
                startDate = LocalDateTime.now().minusMonths(1);
        }

        List<Order> orders = orderRepository.findByOrderDateAfter(startDate);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", orders.size());
        stats.put("period", period);
        stats.put("startDate", startDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

        // Calcul du chiffre d'affaires
        BigDecimal totalRevenue = orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalRevenue", totalRevenue);

        // Répartition par statut
        Map<String, Long> statusCount = new HashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            long count = orders.stream()
                    .filter(order -> order.getStatus() == status)
                    .count();
            statusCount.put(status.toString(), count);
        }
        stats.put("statusBreakdown", statusCount);

        return stats;
    }

    // Méthodes utilitaires
    private String translateStatus(OrderStatus status) {
        switch (status) {
            case PENDING:
                return "En attente";
            case CONFIRMED:
                return "Confirmée";
            case SHIPPED:
                return "Expédiée";
            case DELIVERED:
                return "Livrée";
            case CANCELLED:
                return "Annulée";
            default:
                return status.toString();
        }
    }

    private List<Map<String, String>> generateTrackingHistory(Order order) {
        List<Map<String, String>> history = new ArrayList<>();

        // Commande créée
        Map<String, String> created = new HashMap<>();
        created.put("date", order.getOrderDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
        created.put("description", "Commande créée et confirmée");
        history.add(created);

        // Ajouter des étapes selon le statut actuel
        if (order.getStatus().ordinal() >= OrderStatus.CONFIRMED.ordinal()) {
            Map<String, String> confirmed = new HashMap<>();
            confirmed.put("date", order.getOrderDate().plusHours(1).format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            confirmed.put("description", "Commande confirmée par le vendeur");
            history.add(confirmed);
        }

        if (order.getStatus().ordinal() >= OrderStatus.SHIPPED.ordinal()) {
            Map<String, String> preparing = new HashMap<>();
            preparing.put("date", order.getOrderDate().plusHours(6).format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            preparing.put("description", "Préparation de votre commande");
            history.add(preparing);
        }

        if (order.getStatus().ordinal() >= OrderStatus.SHIPPED.ordinal()) {
            Map<String, String> shipped = new HashMap<>();
            shipped.put("date", order.getOrderDate().plusDays(1).format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            shipped.put("description", "Colis expédié - En cours de livraison");
            history.add(shipped);
        }

        if (order.getStatus() == OrderStatus.DELIVERED && order.getDeliveryDate() != null) {
            Map<String, String> delivered = new HashMap<>();
            delivered.put("date", order.getDeliveryDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            delivered.put("description", "Colis livré avec succès");
            history.add(delivered);
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            Map<String, String> cancelled = new HashMap<>();
            cancelled.put("date", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            cancelled.put("description", "Commande annulée");
            history.add(cancelled);
        }

        return history;
    }
}