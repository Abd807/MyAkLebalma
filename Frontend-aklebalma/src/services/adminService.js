// Configuration API directement dans le fichier - PAS D'IMPORT
const API_BASE_URL = 'https://192.168.1.708080';

export const adminService = {
    getStats: async () => {
        try {
            console.log('🔍 adminService.getStats - Début');
            const response = await fetch(`${API_BASE_URL}/api/admin/stats`);
            console.log('📡 Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📊 Données stats reçues:', data);
            
            // Convertir les données de l'API vers le format attendu par AdminDashboard
            const formattedStats = {
                totalUsers: data.totalUsers || 0,
                totalProducts: 0, // Sera ajouté plus tard
                totalCredit: data.totalPurchasingPower || 0,
                activeUsers: data.activeUsers || 0,
                inactiveUsers: data.inactiveUsers || 0,
                totalRemainingToPay: data.totalRemainingToPay || 0,
                averagePurchasingPower: data.averagePurchasingPower || 0
            };
            
            console.log('📊 Stats formatées:', formattedStats);
            return formattedStats;
            
        } catch (error) {
            console.error('❌ Erreur adminService.getStats:', error);
            // Retourner des stats par défaut en cas d'erreur
            return {
                totalUsers: 0,
                totalProducts: 0,
                totalCredit: 0,
                activeUsers: 0,
                inactiveUsers: 0,
                totalRemainingToPay: 0,
                averagePurchasingPower: 0
            };
        }
    },

    // Récupérer tous les utilisateurs
    getAllUsers: async () => {
        try {
            console.log('🔍 adminService.getAllUsers - Début');
            const response = await fetch(`${API_BASE_URL}/api/users`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const users = await response.json();
            console.log('👥 Utilisateurs récupérés:', users.length);
            return users;
            
        } catch (error) {
            console.error('❌ Erreur getAllUsers:', error);
            throw new Error('Erreur récupération utilisateurs: ' + error.message);
        }
    },

    // Récupérer tous les produits
    getAllProducts: async () => {
        try {
            console.log('🔍 adminService.getAllProducts - Début');
            const response = await fetch(`${API_BASE_URL}/api/products`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const products = await response.json();
            console.log('📦 Produits récupérés:', products.length);
            return products;
            
        } catch (error) {
            console.error('❌ Erreur getAllProducts:', error);
            throw new Error('Erreur récupération produits: ' + error.message);
        }
    },

    // Modifier le crédit d'un utilisateur (pour plus tard)
    updateUserCredit: async (userId, newCredit) => {
        try {
            console.log('🔍 adminService.updateUserCredit - Début', { userId, newCredit });
            const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    purchasingPower: newCredit
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const updatedUser = await response.json();
            console.log('✅ Crédit mis à jour:', updatedUser);
            return updatedUser;
            
        } catch (error) {
            console.error('❌ Erreur updateUserCredit:', error);
            throw new Error('Erreur modification crédit: ' + error.message);
        }
    }
};
