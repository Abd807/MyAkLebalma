import { apiClient } from './apiClient';

export const orderService = {
    // Créer une nouvelle commande
    async createOrder(orderData) {
        try {
            console.log('📦 Creating order:', orderData);
            const response = await apiClient.post('/orders', orderData);
            console.log('✅ Order created successfully:', response.id);
            return response;
        } catch (error) {
            console.error('❌ Failed to create order:', error.message);
            throw new Error(`Erreur création commande: ${error.message}`);
        }
    },

    // Récupérer toutes les commandes d'un utilisateur
    async getUserOrders(userId, page = 1, limit = 10) {
        try {
            console.log('📋 Getting orders for user:', userId);
            const response = await apiClient.get(`/users/${userId}/orders?page=${page}&limit=${limit}`);
            console.log(`✅ Loaded ${response.orders?.length || 0} orders`);
            return response;
        } catch (error) {
            console.error('❌ Failed to load user orders:', error.message);
            throw new Error(`Erreur chargement commandes: ${error.message}`);
        }
    },

    // Récupérer une commande spécifique
    async getOrderById(orderId) {
        try {
            console.log('🔍 Getting order details:', orderId);
            const response = await apiClient.get(`/orders/${orderId}`);
            console.log('✅ Order loaded:', response.orderNumber);
            return response;
        } catch (error) {
            console.error('❌ Failed to load order:', error.message);
            throw new Error(`Erreur chargement commande: ${error.message}`);
        }
    },

    // Annuler une commande
    async cancelOrder(orderId, reason = '') {
        try {
            console.log('❌ Cancelling order:', orderId);
            const response = await apiClient.put(`/orders/${orderId}/cancel`, {
                reason: reason
            });
            console.log('✅ Order cancelled successfully');
            return response;
        } catch (error) {
            console.error('❌ Failed to cancel order:', error.message);
            throw new Error(`Erreur annulation commande: ${error.message}`);
        }
    },

    // Mettre à jour le statut d'une commande (admin)
    async updateOrderStatus(orderId, status, trackingNumber = '') {
        try {
            console.log('🔄 Updating order status:', orderId, status);
            const response = await apiClient.put(`/orders/${orderId}/status`, {
                status: status,
                trackingNumber: trackingNumber
            });
            console.log('✅ Order status updated successfully');
            return response;
        } catch (error) {
            console.error('❌ Failed to update order status:', error.message);
            throw new Error(`Erreur mise à jour statut: ${error.message}`);
        }
    },

    // Obtenir le suivi d'une commande
    async getOrderTracking(orderId) {
        try {
            console.log('📍 Getting order tracking:', orderId);
            const response = await apiClient.get(`/orders/${orderId}/tracking`);
            console.log('✅ Tracking info loaded');
            return response;
        } catch (error) {
            console.error('❌ Failed to load tracking:', error.message);
            throw new Error(`Erreur suivi commande: ${error.message}`);
        }
    },

    // Confirmer la réception d'une commande
    async confirmOrderDelivery(orderId, rating = null, review = '') {
        try {
            console.log('✅ Confirming order delivery:', orderId);
            const response = await apiClient.put(`/orders/${orderId}/confirm-delivery`, {
                rating: rating,
                review: review
            });
            console.log('✅ Delivery confirmed successfully');
            return response;
        } catch (error) {
            console.error('❌ Failed to confirm delivery:', error.message);
            throw new Error(`Erreur confirmation livraison: ${error.message}`);
        }
    },

    // Retourner un produit
    async requestReturn(orderId, itemId, reason, description = '') {
        try {
            console.log('🔄 Requesting return for item:', itemId);
            const response = await apiClient.post(`/orders/${orderId}/returns`, {
                itemId: itemId,
                reason: reason,
                description: description
            });
            console.log('✅ Return request submitted');
            return response;
        } catch (error) {
            console.error('❌ Failed to request return:', error.message);
            throw new Error(`Erreur demande retour: ${error.message}`);
        }
    },

    // Récupérer toutes les commandes (admin)
    async getAllOrders(filters = {}) {
        try {
            console.log('📋 Getting all orders (admin)');
            const queryParams = new URLSearchParams(filters).toString();
            const response = await apiClient.get(`/orders?${queryParams}`);
            console.log(`✅ Loaded ${response.orders?.length || 0} orders`);
            return response;
        } catch (error) {
            console.error('❌ Failed to load all orders:', error.message);
            throw new Error(`Erreur chargement commandes admin: ${error.message}`);
        }
    },

    // Obtenir les statistiques des commandes (admin)
    async getOrderStats(period = 'month') {
        try {
            console.log('📊 Getting order statistics');
            const response = await apiClient.get(`/orders/stats?period=${period}`);
            console.log('✅ Order stats loaded');
            return response;
        } catch (error) {
            console.error('❌ Failed to load order stats:', error.message);
            throw new Error(`Erreur statistiques commandes: ${error.message}`);
        }
    },

    // Calculer le total d'une commande avec les frais
    calculateOrderTotal(items, shippingFee = 0, taxRate = 0.18) {
        try {
            const subtotal = items.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);

            const tax = subtotal * taxRate;
            const total = subtotal + tax + shippingFee;

            return {
                subtotal: subtotal,
                tax: tax,
                shippingFee: shippingFee,
                total: total
            };
        } catch (error) {
            console.error('❌ Failed to calculate order total:', error.message);
            throw new Error('Erreur calcul total commande');
        }
    },

    // Valider les données d'une commande
    validateOrder(orderData) {
        const errors = [];

        if (!orderData.items || orderData.items.length === 0) {
            errors.push('La commande doit contenir au moins un article');
        }

        if (!orderData.shippingAddress) {
            errors.push('Adresse de livraison requise');
        }

        if (!orderData.paymentMethod) {
            errors.push('Méthode de paiement requise');
        }

        if (orderData.items) {
            orderData.items.forEach((item, index) => {
                if (!item.productId) {
                    errors.push(`Article ${index + 1}: ID produit manquant`);
                }
                if (!item.quantity || item.quantity <= 0) {
                    errors.push(`Article ${index + 1}: Quantité invalide`);
                }
                if (!item.price || item.price <= 0) {
                    errors.push(`Article ${index + 1}: Prix invalide`);
                }
            });
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    // Formater les données d'une commande pour l'affichage
    formatOrderForDisplay(order) {
        try {
            return {
                id: order.id,
                orderNumber: order.orderNumber || `CMD-${order.id}`,
                date: new Date(order.orderDate).toLocaleDateString('fr-FR'), // ✅ CHANGÉ: orderDate au lieu de createdAt
                status: this.translateStatus(order.status),
                statusColor: this.getStatusColor(order.status),
                items: order.items || [],
                itemCount: order.items?.length || 0,
                total: order.totalAmount || 0, // ✅ CHANGÉ: totalAmount au lieu de total
                formattedTotal: this.formatPrice(order.totalAmount || 0), // ✅ CHANGÉ
                canCancel: ['PENDING', 'CONFIRMED'].includes(order.status),
                canTrack: ['SHIPPED', 'IN_TRANSIT'].includes(order.status),
                isDelivered: order.status === 'DELIVERED'
            };
        } catch (error) {
            console.error('❌ Failed to format order:', error.message);
            return order;
        }
    },

    // Traduire le statut d'une commande
    translateStatus(status) {
        const translations = {
            'PENDING': 'En attente',
            'CONFIRMED': 'Confirmée',
            'PREPARING': 'En préparation',
            'SHIPPED': 'Expédiée',
            'IN_TRANSIT': 'En transit',
            'DELIVERED': 'Livrée',
            'CANCELLED': 'Annulée',
            'RETURNED': 'Retournée'
        };
        return translations[status] || status;
    },

    // Obtenir la couleur associée à un statut
    getStatusColor(status) {
        const colors = {
            'PENDING': '#ff9500',
            'CONFIRMED': '#007bff',
            'PREPARING': '#6f42c1',
            'SHIPPED': '#17a2b8',
            'IN_TRANSIT': '#ffc107',
            'DELIVERED': '#28a745',
            'CANCELLED': '#dc3545',
            'RETURNED': '#6c757d'
        };
        return colors[status] || '#6c757d';
    },

    // Formater un prix
    formatPrice(price) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
        }).format(price);
    }
};