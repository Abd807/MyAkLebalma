// src/main/java/com/mobile/demo/service/NotificationService.java
package com.mobile.demo.service;

import com.mobile.demo.entity.Notification;
import com.mobile.demo.enums.NotificationType;
import com.mobile.demo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // Créer une nouvelle notification
    public Notification createNotification(String title, String message, NotificationType type, Long userId) {
        Notification notification = new Notification(title, message, type, userId);
        return notificationRepository.save(notification);
    }

    // Créer une notification avec priorité
    public Notification createNotification(String title, String message, NotificationType type,
                                           Long userId, String priority) {
        Notification notification = new Notification(title, message, type, userId);
        notification.setPriority(priority);
        return notificationRepository.save(notification);
    }

    // Créer une notification complète
    public Notification createNotification(String title, String message, NotificationType type,
                                           Long userId, String priority, String actionUrl, String imageUrl) {
        Notification notification = new Notification(title, message, type, userId);
        notification.setPriority(priority);
        notification.setActionUrl(actionUrl);
        notification.setImageUrl(imageUrl);
        return notificationRepository.save(notification);
    }

    // Récupérer toutes les notifications d'un utilisateur
    @Transactional(readOnly = true)
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderBySentDateDesc(userId);
    }

    // Récupérer les notifications avec pagination
    @Transactional(readOnly = true)
    public Page<Notification> getUserNotifications(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository.findByUserIdOrderBySentDateDesc(userId, pageable);
    }

    // Récupérer les notifications non lues
    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderBySentDateDesc(userId);
    }

    // Récupérer les notifications lues
    @Transactional(readOnly = true)
    public List<Notification> getReadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadOrderBySentDateDesc(userId, true);
    }

    // Compter les notifications non lues
    @Transactional(readOnly = true)
    public long getUnreadNotificationsCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    // Récupérer une notification par ID
    @Transactional(readOnly = true)
    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    // Marquer une notification comme lue
    public boolean markAsRead(Long notificationId, Long userId) {
        Optional<Notification> optionalNotification = notificationRepository.findById(notificationId);

        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();

            // Vérifier que la notification appartient bien à l'utilisateur
            if (notification.getUserId().equals(userId)) {
                notification.markAsRead();
                notificationRepository.save(notification);
                return true;
            }
        }
        return false;
    }

    // Marquer toutes les notifications comme lues
    public int markAllAsRead(Long userId) {
        return notificationRepository.markAllAsReadByUserId(userId, LocalDateTime.now());
    }

    // Supprimer une notification
    public boolean deleteNotification(Long notificationId, Long userId) {
        Optional<Notification> optionalNotification = notificationRepository.findById(notificationId);

        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();

            // Vérifier que la notification appartient bien à l'utilisateur
            if (notification.getUserId().equals(userId)) {
                notificationRepository.delete(notification);
                return true;
            }
        }
        return false;
    }

    // Supprimer toutes les notifications lues d'un utilisateur
    public void deleteAllReadNotifications(Long userId) {
        List<Notification> readNotifications = notificationRepository
                .findByUserIdAndIsReadOrderBySentDateDesc(userId, true);
        notificationRepository.deleteAll(readNotifications);
    }

    // Récupérer les notifications par type
    @Transactional(readOnly = true)
    public List<Notification> getNotificationsByType(Long userId, NotificationType type) {
        return notificationRepository.findByUserIdAndTypeOrderBySentDateDesc(userId, type);
    }

    // Récupérer les notifications par priorité
    @Transactional(readOnly = true)
    public List<Notification> getNotificationsByPriority(Long userId, String priority) {
        return notificationRepository.findByUserIdAndPriorityOrderBySentDateDesc(userId, priority);
    }

    // Récupérer les notifications récentes (dernières 24h)
    @Transactional(readOnly = true)
    public List<Notification> getRecentNotifications(Long userId) {
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        return notificationRepository.findRecentNotifications(userId, yesterday);
    }

    // Récupérer les notifications haute priorité non lues
    @Transactional(readOnly = true)
    public List<Notification> getHighPriorityUnreadNotifications(Long userId) {
        return notificationRepository.findHighPriorityUnreadNotifications(userId);
    }

    // Vérifier s'il y a des notifications non lues
    @Transactional(readOnly = true)
    public boolean hasUnreadNotifications(Long userId) {
        return notificationRepository.existsByUserIdAndIsReadFalse(userId);
    }

    // Nettoyer les anciennes notifications (tâche de maintenance)
    public int cleanupOldNotifications() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        return notificationRepository.deleteOldReadNotifications(cutoffDate);
    }

    // Envoyer une notification de commande
    public Notification sendOrderNotification(Long userId, String orderNumber, String status) {
        String title = "Mise à jour de commande";
        String message = String.format("Votre commande #%s est maintenant %s", orderNumber, status);
        return createNotification(title, message, NotificationType.ORDER, userId, "HIGH");
    }

    // Envoyer une notification de paiement
    public Notification sendPaymentNotification(Long userId, String amount, String dueDate) {
        String title = "Échéance de paiement";
        String message = String.format("Votre prochaine échéance de %s est due le %s", amount, dueDate);
        return createNotification(title, message, NotificationType.PAYMENT, userId, "HIGH");
    }

    // Envoyer une notification de promotion
    public Notification sendPromotionNotification(Long userId, String promotionTitle, String description) {
        return createNotification(promotionTitle, description, NotificationType.PROMOTION, userId, "MEDIUM");
    }

    // Envoyer une notification de livraison
    public Notification sendDeliveryNotification(Long userId, String message) {
        String title = "Information de livraison";
        return createNotification(title, message, NotificationType.DELIVERY, userId, "HIGH");
    }

    // Envoyer une notification de sécurité
    public Notification sendSecurityNotification(Long userId, String message) {
        String title = "Alerte de sécurité";
        return createNotification(title, message, NotificationType.SECURITY, userId, "HIGH");
    }
}