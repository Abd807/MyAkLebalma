// src/main/java/com/mobile/demo/controller/NotificationController.java
package com.mobile.demo.controller;

import com.mobile.demo.entity.Notification;
import com.mobile.demo.enums.NotificationType;
import com.mobile.demo.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // DTO pour créer une notification
    public static class CreateNotificationRequest {
        private String title;
        private String message;
        private NotificationType type;
        private Long userId;
        private String priority = "MEDIUM";
        private String actionUrl;
        private String imageUrl;

        // Getters et Setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public NotificationType getType() { return type; }
        public void setType(NotificationType type) { this.type = type; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }

        public String getActionUrl() { return actionUrl; }
        public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }

    // Récupérer toutes les notifications d'un utilisateur
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Long userId) {
        try {
            List<Notification> notifications = notificationService.getUserNotifications(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Récupérer les notifications avec pagination
    @GetMapping("/user/{userId}/paginated")
    public ResponseEntity<Page<Notification>> getUserNotificationsPaginated(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<Notification> notifications = notificationService.getUserNotifications(userId, page, size);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Récupérer les notifications non lues
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable Long userId) {
        try {
            List<Notification> notifications = notificationService.getUnreadNotifications(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Récupérer les notifications lues
    @GetMapping("/user/{userId}/read")
    public ResponseEntity<List<Notification>> getReadNotifications(@PathVariable Long userId) {
        try {
            List<Notification> notifications = notificationService.getReadNotifications(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Compter les notifications non lues
    @GetMapping("/user/{userId}/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadNotificationsCount(@PathVariable Long userId) {
        try {
            long count = notificationService.getUnreadNotificationsCount(userId);
            Map<String, Long> response = new HashMap<>();
            response.put("unreadCount", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Récupérer une notification par ID
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        try {
            Optional<Notification> notification = notificationService.getNotificationById(id);
            return notification.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Créer une nouvelle notification
    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody CreateNotificationRequest request) {
        try {
            Notification notification = notificationService.createNotification(
                    request.getTitle(),
                    request.getMessage(),
                    request.getType(),
                    request.getUserId(),
                    request.getPriority(),
                    request.getActionUrl(),
                    request.getImageUrl()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Marquer une notification comme lue
    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable Long id,
            @RequestParam Long userId) {
        try {
            boolean success = notificationService.markAsRead(id, userId);
            Map<String, String> response = new HashMap<>();

            if (success) {
                response.put("message", "Notification marquée comme lue");
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Notification non trouvée ou non autorisée");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Erreur lors du marquage");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Marquer toutes les notifications comme lues
    @PutMapping("/user/{userId}/mark-all-read")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@PathVariable Long userId) {
        try {
            int updatedCount = notificationService.markAllAsRead(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Toutes les notifications ont été marquées comme lues");
            response.put("updatedCount", updatedCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Erreur lors du marquage");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Supprimer une notification
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNotification(
            @PathVariable Long id,
            @RequestParam Long userId) {
        try {
            boolean success = notificationService.deleteNotification(id, userId);
            Map<String, String> response = new HashMap<>();

            if (success) {
                response.put("message", "Notification supprimée avec succès");
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Notification non trouvée ou non autorisée");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Erreur lors de la suppression");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Supprimer toutes les notifications lues
    @DeleteMapping("/user/{userId}/read")
    public ResponseEntity<Map<String, String>> deleteAllReadNotifications(@PathVariable Long userId) {
        try {
            notificationService.deleteAllReadNotifications(userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Toutes les notifications lues ont été supprimées");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Erreur lors de la suppression");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Récupérer les notifications par type
    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<Notification>> getNotificationsByType(
            @PathVariable Long userId,
            @PathVariable NotificationType type) {
        try {
            List<Notification> notifications = notificationService.getNotificationsByType(userId, type);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Récupérer les notifications par priorité
    @GetMapping("/user/{userId}/priority/{priority}")
    public ResponseEntity<List<Notification>> getNotificationsByPriority(
            @PathVariable Long userId,
            @PathVariable String priority) {
        try {
            List<Notification> notifications = notificationService.getNotificationsByPriority(userId, priority);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Récupérer les notifications récentes (24h)
    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<List<Notification>> getRecentNotifications(@PathVariable Long userId) {
        try {
            List<Notification> notifications = notificationService.getRecentNotifications(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Récupérer les notifications haute priorité non lues
    @GetMapping("/user/{userId}/high-priority-unread")
    public ResponseEntity<List<Notification>> getHighPriorityUnreadNotifications(@PathVariable Long userId) {
        try {
            List<Notification> notifications = notificationService.getHighPriorityUnreadNotifications(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Vérifier s'il y a des notifications non lues
    @GetMapping("/user/{userId}/has-unread")
    public ResponseEntity<Map<String, Boolean>> hasUnreadNotifications(@PathVariable Long userId) {
        try {
            boolean hasUnread = notificationService.hasUnreadNotifications(userId);
            Map<String, Boolean> response = new HashMap<>();
            response.put("hasUnread", hasUnread);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoint d'administration pour nettoyer les anciennes notifications
    @DeleteMapping("/admin/cleanup")
    public ResponseEntity<Map<String, Object>> cleanupOldNotifications() {
        try {
            int deletedCount = notificationService.cleanupOldNotifications();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Nettoyage effectué avec succès");
            response.put("deletedCount", deletedCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Erreur lors du nettoyage");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Endpoints pour envoyer des notifications spécifiques
    @PostMapping("/send/order")
    public ResponseEntity<Notification> sendOrderNotification(
            @RequestParam Long userId,
            @RequestParam String orderNumber,
            @RequestParam String status) {
        try {
            Notification notification = notificationService.sendOrderNotification(userId, orderNumber, status);
            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/send/payment")
    public ResponseEntity<Notification> sendPaymentNotification(
            @RequestParam Long userId,
            @RequestParam String amount,
            @RequestParam String dueDate) {
        try {
            Notification notification = notificationService.sendPaymentNotification(userId, amount, dueDate);
            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/send/promotion")
    public ResponseEntity<Notification> sendPromotionNotification(
            @RequestParam Long userId,
            @RequestParam String title,
            @RequestParam String description) {
        try {
            Notification notification = notificationService.sendPromotionNotification(userId, title, description);
            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}