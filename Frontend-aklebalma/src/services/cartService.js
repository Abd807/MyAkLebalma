import { apiClient } from './apiClient';

export const cartService = {
    // Récupérer le panier d'un utilisateur
    async getCart(userId) {
        try {
            console.log('🛒 Getting cart for user:', userId);
            const response = await apiClient.get(`/users/${userId}/cart`);
            console.log('✅ Cart loaded:', response);
            return response;
        } catch (error) {
            console.error('❌ Failed to load cart:', error.message);
            throw new Error(`Erreur chargement panier: ${error.message}`);
        }
    },

    // Mettre à jour le total du panier
    async updateCart(userId, totalAmount) {
        try {
            console.log('💰 Updating cart total:', { userId, totalAmount });
            const response = await apiClient.put(`/users/${userId}/cart`, {
                totalAmount: totalAmount
            });
            console.log('✅ Cart updated successfully');
            return response;
        } catch (error) {
            console.error('❌ Failed to update cart:', error.message);
            throw new Error(`Erreur mise à jour panier: ${error.message}`);
        }
    },

    // Vider le panier
    async clearCart(userId) {
        try {
            console.log('🧹 Clearing cart for user:', userId);
            const response = await apiClient.delete(`/users/${userId}/cart`);
            console.log('✅ Cart cleared successfully');
            return response;
        } catch (error) {
            console.error('❌ Failed to clear cart:', error.message);
            throw new Error(`Erreur vidage du panier: ${error.message}`);
        }
    },

    // Formater un prix
    formatPrice(price) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
        }).format(price);
    },

    // Calculer les infos de livraison
    getShippingInfo(totalAmount, freeShippingThreshold = 50000) {
        const remaining = freeShippingThreshold - totalAmount;
        const shippingFee = totalAmount >= freeShippingThreshold ? 0 : 5000;

        return {
            isFree: totalAmount >= freeShippingThreshold,
            remaining: Math.max(0, remaining),
            threshold: freeShippingThreshold,
            shippingFee: shippingFee,
            finalTotal: totalAmount + shippingFee,
            progress: Math.min(100, (totalAmount / freeShippingThreshold) * 100)
        };
    }
};