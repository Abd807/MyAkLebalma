// src/utils/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration API globale
export const API_CONFIG = {
    BASE_URL: 'http:// 192.168.113.174:8080', // ← Change selon ton setup
    TIMEOUT: 10000, // 10 secondes
    RETRY_ATTEMPTS: 3
};

// Gestionnaire d'erreurs global
export const handleApiError = (error, context = '') => {
    console.error(`Erreur API ${context}:`, error);

    if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
        return {
            message: 'Problème de connexion. Vérifiez votre réseau.',
            type: 'NETWORK_ERROR'
        };
    }

    if (error.message.includes('401')) {
        return {
            message: 'Session expirée. Veuillez vous reconnecter.',
            type: 'AUTH_ERROR'
        };
    }

    if (error.message.includes('500')) {
        return {
            message: 'Erreur du serveur. Réessayez plus tard.',
            type: 'SERVER_ERROR'
        };
    }

    return {
        message: error.message || 'Une erreur inattendue s\'est produite',
        type: 'UNKNOWN_ERROR'
    };
};

// Storage helpers
export const StorageHelper = {
    // Sauvegarder les données utilisateur
    async saveUserData(userData) {
        try {
            await AsyncStorage.setItem('userId', userData.id.toString());
            await AsyncStorage.setItem('userToken', userData.token);
            await AsyncStorage.setItem('userName', userData.name || '');
            await AsyncStorage.setItem('userEmail', userData.email || '');
            console.log('✅ Données utilisateur sauvegardées');
        } catch (error) {
            console.error('❌ Erreur sauvegarde utilisateur:', error);
        }
    },

    // Récupérer l'ID utilisateur
    async getUserId() {
        try {
            const userId = await AsyncStorage.getItem('userId');
            return userId ? parseInt(userId) : null;
        } catch (error) {
            console.error('Erreur récupération userId:', error);
            return null;
        }
    },

    // Récupérer le token
    async getToken() {
        try {
            return await AsyncStorage.getItem('userToken');
        } catch (error) {
            console.error('Erreur récupération token:', error);
            return null;
        }
    },

    // Récupérer toutes les données utilisateur
    async getUserData() {
        try {
            const [userId, token, name, email] = await Promise.all([
                AsyncStorage.getItem('userId'),
                AsyncStorage.getItem('userToken'),
                AsyncStorage.getItem('userName'),
                AsyncStorage.getItem('userEmail')
            ]);

            return {
                id: userId ? parseInt(userId) : null,
                token,
                name,
                email
            };
        } catch (error) {
            console.error('Erreur récupération données utilisateur:', error);
            return null;
        }
    },

    // Nettoyer les données (déconnexion)
    async clearUserData() {
        try {
            await AsyncStorage.multiRemove([
                'userId', 'userToken', 'userName', 'userEmail'
            ]);
            console.log('✅ Données utilisateur supprimées');
        } catch (error) {
            console.error('❌ Erreur suppression données:', error);
        }
    },

    // Vérifier si l'utilisateur est connecté
    async isLoggedIn() {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const userId = await AsyncStorage.getItem('userId');
            return !!(token && userId);
        } catch (error) {
            console.error('Erreur vérification connexion:', error);
            return false;
        }
    }
};

// Helper pour créer des requêtes avec retry
export const createApiRequest = async (url, options = {}, retryCount = 0) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
    } catch (error) {
        if (retryCount < API_CONFIG.RETRY_ATTEMPTS &&
            (error.name === 'AbortError' || error.message.includes('Network'))) {
            console.log(`Tentative ${retryCount + 1}/${API_CONFIG.RETRY_ATTEMPTS} pour ${url}`);
            return createApiRequest(url, options, retryCount + 1);
        }
        throw error;
    }
};

// Formatteurs de données
export const DataFormatters = {
    // Formater les timestamps
    formatNotificationDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'Il y a quelques minutes';
        } else if (diffInHours < 24) {
            return `Il y a ${Math.floor(diffInHours)}h`;
        } else if (diffInHours < 48) {
            return 'Hier';
        } else {
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short'
            });
        }
    },

    // Formater les montants
    formatAmount(amount) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(amount);
    },

    // Nettoyer les strings
    sanitizeString(str) {
        return str ? str.trim().replace(/\s+/g, ' ') : '';
    }
};

// Validateurs
export const Validators = {
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        return phoneRegex.test(phone);
    },

    isValidUserId(userId) {
        return userId && typeof userId === 'number' && userId > 0;
    }
};

export default {
    API_CONFIG,
    handleApiError,
    StorageHelper,
    createApiRequest,
    DataFormatters,
    Validators
};