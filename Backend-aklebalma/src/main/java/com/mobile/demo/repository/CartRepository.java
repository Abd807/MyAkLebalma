package com.mobile.demo.repository;

import com.mobile.demo.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    // Récupérer le panier d'un utilisateur
    Cart findByUserId(Long userId);

    // Vérifier si un utilisateur a un panier
    boolean existsByUserId(Long userId);

    // Supprimer le panier d'un utilisateur
    @Modifying
    @Transactional
    void deleteByUserId(Long userId);

    // Récupérer les paniers anciens (pour nettoyage)
    @Query("SELECT c FROM Cart c WHERE c.updatedAt < :cutoffDate")
    List<Cart> findOldCarts(@Param("cutoffDate") LocalDateTime cutoffDate);

    // Compter les paniers
    long countByUserId(Long userId);
}