// src/main/java/com/mobile/demo/repository/NotificationRepository.java
package com.mobile.demo.repository;

import com.mobile.demo.entity.Notification;
import com.mobile.demo.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Trouver toutes les notifications d'un utilisateur (triées par date décroissante)
    List<Notification> findByUserIdOrderBySentDateDesc(Long userId);

    // Trouver les notifications d'un utilisateur avec pagination
    Page<Notification> findByUserIdOrderBySentDateDesc(Long userId, Pageable pageable);

    // Trouver les notifications non lues d'un utilisateur
    List<Notification> findByUserIdAndIsReadFalseOrderBySentDateDesc(Long userId);

    // Compter les notifications non lues d'un utilisateur
    long countByUserIdAndIsReadFalse(Long userId);

    // Trouver les notifications par type pour un utilisateur
    List<Notification> findByUserIdAndTypeOrderBySentDateDesc(Long userId, NotificationType type);

    // Trouver les notifications par priorité pour un utilisateur
    List<Notification> findByUserIdAndPriorityOrderBySentDateDesc(Long userId, String priority);

    // Trouver les notifications récentes (dernières 24h)
    @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.sentDate >= :since ORDER BY n.sentDate DESC")
    List<Notification> findRecentNotifications(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    // Marquer toutes les notifications d'un utilisateur comme lues
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readDate = :readDate WHERE n.userId = :userId AND n.isRead = false")
    int markAllAsReadByUserId(@Param("userId") Long userId, @Param("readDate") LocalDateTime readDate);

    // Supprimer les anciennes notifications lues (plus de 30 jours)
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.isRead = true AND n.sentDate < :cutoffDate")
    int deleteOldReadNotifications(@Param("cutoffDate") LocalDateTime cutoffDate);

    // Trouver les notifications par statut de lecture
    List<Notification> findByUserIdAndIsReadOrderBySentDateDesc(Long userId, Boolean isRead);

    // Trouver les notifications haute priorité non lues
    @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.isRead = false AND n.priority = 'HIGH' ORDER BY n.sentDate DESC")
    List<Notification> findHighPriorityUnreadNotifications(@Param("userId") Long userId);

    // Statistiques des notifications par type pour un utilisateur
    @Query("SELECT n.type, COUNT(n) FROM Notification n WHERE n.userId = :userId GROUP BY n.type")
    List<Object[]> getNotificationStatsByType(@Param("userId") Long userId);

    // Vérifier s'il existe des notifications non lues
    boolean existsByUserIdAndIsReadFalse(Long userId);
}
