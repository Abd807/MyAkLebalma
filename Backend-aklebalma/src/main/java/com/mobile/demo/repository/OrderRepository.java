package com.mobile.demo.repository;

import com.mobile.demo.entity.Order;
import com.mobile.demo.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Récupérer les commandes d'un utilisateur (triées par date décroissante)
    Page<Order> findByUserIdOrderByOrderDateDesc(Long userId, Pageable pageable);

    // Récupérer commandes par statut
    Page<Order> findByStatusOrderByOrderDateDesc(OrderStatus status, Pageable pageable);

    // Récupérer toutes les commandes triées par date
    Page<Order> findAllByOrderByOrderDateDesc(Pageable pageable);

    // Récupérer commandes après une date (pour les stats)
    List<Order> findByOrderDateAfter(LocalDateTime date);

    // Récupérer commandes d'un utilisateur avec un statut spécifique
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);

    // Recherche par numéro de commande
    Order findByOrderNumber(String orderNumber);

    // Compter les commandes d'un utilisateur
    long countByUserId(Long userId);

    // Compter les commandes par statut
    long countByStatus(OrderStatus status);

    // Requête personnalisée pour récupérer les commandes récentes d'un utilisateur
    @Query("SELECT o FROM Order o WHERE o.userId = :userId AND o.orderDate >= :date ORDER BY o.orderDate DESC")
    List<Order> findRecentOrdersByUserId(@Param("userId") Long userId, @Param("date") LocalDateTime date);

    // Requête pour calculer le total des ventes sur une période
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate AND o.status != 'CANCELLED'")
    Double calculateTotalSalesBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Requête pour les commandes en attente de traitement
    @Query("SELECT o FROM Order o WHERE o.status IN ('PENDING', 'CONFIRMED') ORDER BY o.orderDate ASC")
    List<Order> findPendingOrders();

    // Requête pour les commandes livrées dans une période
    @Query("SELECT o FROM Order o WHERE o.status = 'DELIVERED' AND o.deliveryDate BETWEEN :startDate AND :endDate")
    List<Order> findDeliveredOrdersBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}