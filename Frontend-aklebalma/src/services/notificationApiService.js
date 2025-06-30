// src/services/notificationApiService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration de l'API
const API_BASE_URL = 'http://192.168.1.70:8080'; // Remplace par ton IP/URL
// const API_BASE_URL = 'http://192.168.1.100:8080'; // Pour tester sur appareil physique

class NotificationApiService {

    // Récupérer le token d'authentification
    async getAuthToken() {
        try {
            return await AsyncStorage.getItem('userToken');
        } catch (error) {
            console.error('Erreur lors de la récupération du token:', error);
            return null;
        }
    }

    // Récupérer l'ID utilisateur
    async getUserId() {
        try {
            const userId = await AsyncStorage.getItem('userId');
            return userId ? parseInt(userId) : null;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
            return null;
        }
    }

    // Headers par défaut avec authentification
    async getHeaders() {
        const token = await this.getAuthToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    // Gestion des erreurs HTTP
    async handleResponse(response) {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP Error: ${response.status}`);
        }
        return response.json();
    }

    // ===============================
    // RÉCUPÉRATION DES NOTIFICATIONS
    // ===============================

    // Récupérer toutes les notifications d'un utilisateur
    async getUserNotifications(userId = null) {
        try {
            const targetUserId = userId || await this.getUserId();
            if (!targetUserId) throw new Error('ID utilisateur requis');

            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/user/${targetUserId}`,
                { headers }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications:', error);
            throw error;
        }
    }

    // Récupérer les notifications avec pagination
    async getUserNotificationsPaginated(page = 0, size = 10, userId = null) {
        try {
            const targetUserId = userId || await this.getUserId();
            if (!targetUserId) throw new Error('ID utilisateur requis');

            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/user/${targetUserId}/paginated?page=${page}&size=${size}`,
                { headers }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Erreur lors de la récupération paginée:', error);
            throw error;
        }
    }

    // Récupérer les notifications non lues
    async getUnreadNotifications(userId = null) {
        try {
            const targetUserId = userId || await this.getUserId();
            if (!targetUserId) throw new Error('ID utilisateur requis');

            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/user/${targetUserId}/unread`,
                { headers }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Erreur lors de la récupération des non lues:', error);
            throw error;
        }
    }

    // Récupérer les notifications lues
    async getReadNotifications(userId = null) {
        try {
            const targetUserId = userId || await this.getUserId();
            if (!targetUserId) throw new Error('ID utilisateur requis');

            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/user/${targetUserId}/read`,
                { headers }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Erreur lors de la récupération des lues:', error);
            throw error;
        }
    }

    // Compter les notifications non lues
    async getUnreadNotificationsCount(userId = null) {
        try {
            const targetUserId = userId || await this.getUserId();
            if (!targetUserId) throw new Error('ID utilisateur requis');

            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/user/${targetUserId}/unread/count`,
                { headers }
            );

            const data = await this.handleResponse(response);
            return data.unreadCount || 0;
        } catch (error) {
            console.error('Erreur lors du comptage des non lues:', error);
            return 0;
        }
    }

    // Récupérer une notification par ID
    async getNotificationById(notificationId) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/${notificationId}`,
                { headers }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Erreur lors de la récupération de la notification:', error);
            throw error;
        }
    }

    // ===============================
    // ACTIONS SUR LES NOTIFICATIONS
    // ===============================

    // Marquer une notification comme lue
    async markAsRead(notificationId, userId = null) {
        try {
            const targetUserId = userId || await this.getUserId();
            if (!targetUserId) throw new Error('ID utilisateur requis');

            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/${notificationId}/read?userId=${targetUserId}`,
                {
                    method: 'PUT',
                    headers
                }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Erreur lors du marquage comme lu:', error);
            throw error;
        }
    }

    // Marquer toutes les notifications comme lues
    async markAllAsRead(userId = null) {
        try {
            const targetUserId = userId || await this.getUserId();
            if (!targetUserId) throw new Error('ID utilisateur requis');

            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/user/${targetUserId}/mark-all-read`,
                {
                    method: 'PUT',
                    headers
                }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Erreur lors du marquage global:', error);
            throw error;
        }
    }

    // Supprimer une notification
    async deleteNotification(notificationId, userId = null) {
        try {
            const targetUserId = userId || await this.getUserId();
            if (!targetUserId) throw new Error('ID utilisateur requis');

            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/${notificationId}?userId=${targetUserId}`,
                {
                    method: 'DELETE',
                    headers
                }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            throw error;
        }
    }

    // Supprimer toutes les notifications lues
    async deleteAllReadNotifications(userId = null) {
        try {
            const targetUserId = userId || await this.getUserId();
            if (!targetUserId) throw new Error('ID utilisateur requis');

            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/user/${targetUserId}/read`,
                {
                    method: 'DELETE',
                    headers
                }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Erreur lors de la suppression des lues:', error);
            throw error;
        }
    }

    // ===============================
    // FILTRES ET RECHERCHES
    // ===============================

    // Récupérer les notifications par type
    async getNotificationsByType(type, userId = null) {
        try {
            const targetUserId = userId || await this.getUserId();
            if (!targetUserId) throw new Error('ID utilisateur requis');

            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/user/${targetUserId}/type/${type}`,
                { headers }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Erreur lors de la récupération par type:', error);
            throw error;
        }
    }

    // Récupérer les notifications par priorité
    async getNotificationsByPriority(priority, userId = null) {
        try {
            const targetUserId = userId || await this.getUserId();
            if (!targetUserId) throw new Error('ID utilisateur requis');

            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/user/${targetUserId}/priority/${priority}`,
                { headers }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Erreur lors de la récupération par priorité:', error);
            throw error;
        }
    }

    // Récupérer les notifications récentes (24h)
    async getRecentNotifications(userId = null) {
        try {
            const targetUserId = userId || await this.getUserId();
            if (!targetUserId) throw new Error('ID utilisateur requis');

            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/user/${targetUserId}/recent`,
                { headers }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Erreur lors de la récupération des récentes:', error);
            throw error;
        }
    }

    // Récupérer les notifications haute priorité non lues
    async getHighPriorityUnreadNotifications(userId = null) {
        try {
            const targetUserId = userId || await this.getUserId();
            if (!targetUserId) throw new Error('ID utilisateur requis');

            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/user/${targetUserId}/high-priority-unread`,
                { headers }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Erreur lors de la récupération haute priorité:', error);
            throw error;
        }
    }

    // Vérifier s'il y a des notifications non lues
    async hasUnreadNotifications(userId = null) {
        try {
            const targetUserId = userId || await this.getUserId();
            if (!targetUserId) throw new Error('ID utilisateur requis');

            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/user/${targetUserId}/has-unread`,
                { headers }
            );

            const data = await this.handleResponse(response);
            return data.hasUnread || false;
        } catch (error) {
            console.error('Erreur lors de la vérification:', error);
            return false;
        }
    }

    // ===============================
    // CRÉATION DE NOTIFICATIONS
    // ===============================

    // Créer une notification générale
    async createNotification(notificationData) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications`,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(notificationData)
                }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Erreur lors de la création:', error);
            throw error;
        }
    }

    // Envoyer une notification de commande
    async sendOrderNotification(userId, orderNumber, status) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/send/order?userId=${userId}&orderNumber=${orderNumber}&status=${status}`,
                {
                    method: 'POST',
                    headers
                }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Erreur lors de l\'envoi notification commande:', error);
            throw error;
        }
    }

    // Envoyer une notification de paiement
    async sendPaymentNotification(userId, amount, dueDate) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/send/payment?userId=${userId}&amount=${amount}&dueDate=${dueDate}`,
                {
                    method: 'POST',
                    headers
                }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Erreur lors de l\'envoi notification paiement:', error);
            throw error;
        }
    }

    // Envoyer une notification de promotion
    async sendPromotionNotification(userId, title, description) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/send/promotion?userId=${userId}&title=${title}&description=${description}`,
                {
                    method: 'POST',
                    headers
                }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Erreur lors de l\'envoi notification promotion:', error);
            throw error;
        }
    }

    // ===============================
    // MÉTHODES UTILITAIRES
    // ===============================

    // Convertir le format de date du backend
    formatNotificationDate(notification) {
        return {
            ...notification,
            timestamp: notification.sentDate,
            isRead: notification.isRead || false,
            relatedEntity: this.mapTypeToEntity(notification.type),
            relatedEntityId: notification.id,
            icon: this.getIconForType(notification.type),
            color: this.getColorForType(notification.type)
        };
    }

    // Mapper le type backend vers l'entité frontend
    mapTypeToEntity(type) {
        const mapping = {
            'ORDER': 'ORDER',
            'PAYMENT': 'PAYMENT',
            'DELIVERY': 'ORDER',
            'PROMOTION': 'PRODUCT',
            'ACCOUNT': 'USER',
            'SECURITY': 'USER',
            'SYSTEM': 'USER',
            'INSTALLATION': 'ORDER',
            'SUPPORT': 'USER',
            'CREDIT': 'USER'
        };
        return mapping[type] || 'USER';
    }

    // Obtenir l'icône pour un type
    getIconForType(type) {
        const icons = {
            'ORDER': '📦',
            'PAYMENT': '💳',
            'DELIVERY': '🚚',
            'PROMOTION': '🎉',
            'ACCOUNT': '👤',
            'SECURITY': '🔐',
            'SYSTEM': '⚙️',
            'INSTALLATION': '🔧',
            'SUPPORT': '💬',
            'CREDIT': '💰'
        };
        return icons[type] || '🔔';
    }

    // Obtenir la couleur pour un type
    getColorForType(type) {
        const colors = {
            'ORDER': '#10b981',
            'PAYMENT': '#f59e0b',
            'DELIVERY': '#3b82f6',
            'PROMOTION': '#8b5cf6',
            'ACCOUNT': '#6b7280',
            'SECURITY': '#ef4444',
            'SYSTEM': '#64748b',
            'INSTALLATION': '#f97316',
            'SUPPORT': '#06b6d4',
            'CREDIT': '#84cc16'
        };
        return colors[type] || '#6b7280';
    }

    // Traitement en lot des notifications
    async processNotifications(notifications) {
        return notifications.map(notification =>
            this.formatNotificationDate(notification)
        );
    }
}

// Export de l'instance singleton
export default new NotificationApiService();