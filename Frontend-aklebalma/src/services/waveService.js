// src/services/waveService.js
// Service pour l'intégration de l'API Wave

const WAVE_API_BASE_URL = 'https://api.wave.com'; // URL de l'API Wave (à confirmer)
const WAVE_API_KEY = 'YOUR_WAVE_API_KEY'; // À remplacer par votre clé API Wave

class WaveService {

    /**
     * Initier un paiement Wave
     * @param {Object} paymentData - Données du paiement
     * @returns {Promise} Réponse de l'API Wave
     */
    async initiatePayment(paymentData) {
        try {
            const { amount, phoneNumber, orderId, description } = paymentData;

            console.log('💰 Initiation paiement Wave:', paymentData);

            // Pour la production, remplacez par l'appel réel à l'API Wave
            const response = await fetch(`${WAVE_API_BASE_URL}/payments/initiate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${WAVE_API_KEY}`,
                },
                body: JSON.stringify({
                    amount: amount,
                    currency: 'XOF',
                    phone_number: phoneNumber,
                    order_id: orderId,
                    description: description || 'Paiement AKLEBALMA',
                    callback_url: 'https://votre-app.com/webhook/wave', // URL de callback
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'initiation du paiement');
            }

            return {
                success: true,
                requestId: data.request_id,
                status: data.status,
                message: data.message,
                data: data
            };

        } catch (error) {
            console.error('❌ Erreur initiation paiement Wave:', error);

            // En mode développement, simuler une réponse
            if (__DEV__) {
                return this.simulatePaymentInitiation(paymentData);
            }

            throw error;
        }
    }

    /**
     * Vérifier le statut d'un paiement
     * @param {string} requestId - ID de la requête de paiement
     * @returns {Promise} Statut du paiement
     */
    async checkPaymentStatus(requestId) {
        try {
            console.log('🔍 Vérification statut paiement:', requestId);

            // Pour la production, remplacez par l'appel réel à l'API Wave
            const response = await fetch(`${WAVE_API_BASE_URL}/payments/${requestId}/status`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${WAVE_API_KEY}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la vérification du statut');
            }

            return {
                success: true,
                status: data.status, // 'pending', 'completed', 'failed', 'cancelled'
                transactionId: data.transaction_id,
                amount: data.amount,
                fees: data.fees,
                message: data.message,
                data: data
            };

        } catch (error) {
            console.error('❌ Erreur vérification statut:', error);

            // En mode développement, simuler une réponse
            if (__DEV__) {
                return this.simulatePaymentStatus(requestId);
            }

            throw error;
        }
    }

    /**
     * Annuler un paiement en attente
     * @param {string} requestId - ID de la requête de paiement
     * @returns {Promise} Résultat de l'annulation
     */
    async cancelPayment(requestId) {
        try {
            console.log('❌ Annulation paiement:', requestId);

            const response = await fetch(`${WAVE_API_BASE_URL}/payments/${requestId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${WAVE_API_KEY}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'annulation');
            }

            return {
                success: true,
                message: 'Paiement annulé avec succès',
                data: data
            };

        } catch (error) {
            console.error('❌ Erreur annulation paiement:', error);
            throw error;
        }
    }

    /**
     * Obtenir l'historique des paiements d'un utilisateur
     * @param {string} userId - ID de l'utilisateur
     * @returns {Promise} Liste des paiements
     */
    async getPaymentHistory(userId) {
        try {
            const response = await fetch(`${WAVE_API_BASE_URL}/payments/history/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${WAVE_API_KEY}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la récupération de l\'historique');
            }

            return {
                success: true,
                payments: data.payments,
                total: data.total,
                data: data
            };

        } catch (error) {
            console.error('❌ Erreur historique paiements:', error);
            throw error;
        }
    }

    /**
     * Valider un numéro Wave sénégalais
     * @param {string} phoneNumber - Numéro de téléphone
     * @returns {boolean} True si valide
     */
    validateWaveNumber(phoneNumber) {
        // Nettoyer le numéro
        const cleanNumber = phoneNumber.replace(/\s/g, '').replace(/^\+221/, '');

        // Vérifier le format sénégalais pour Wave (77, 78, 70, 76)
        const waveRegex = /^(77|78|70|76)\d{7}$/;

        return waveRegex.test(cleanNumber);
    }

    /**
     * Formater un numéro de téléphone sénégalais
     * @param {string} phoneNumber - Numéro à formater
     * @returns {string} Numéro formaté
     */
    formatSenegalPhoneNumber(phoneNumber) {
        // Nettoyer le numéro
        const cleaned = phoneNumber.replace(/\D/g, '');

        // Formatter XX XXX XX XX
        const match = cleaned.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
        if (match) {
            return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
        }

        return phoneNumber;
    }

    // === MÉTHODES DE SIMULATION POUR LE DÉVELOPPEMENT ===

    /**
     * Simuler l'initiation d'un paiement (pour le développement)
     */
    simulatePaymentInitiation(paymentData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const success = Math.random() > 0.1; // 90% de succès

                if (success) {
                    resolve({
                        success: true,
                        requestId: 'WAVE_SIM_' + Date.now(),
                        status: 'pending',
                        message: 'Demande de paiement envoyée',
                        data: paymentData
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Numéro Wave invalide ou service indisponible'
                    });
                }
            }, 1000);
        });
    }

    /**
     * Simuler la vérification du statut (pour le développement)
     */
    simulatePaymentStatus(requestId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const outcomes = ['completed', 'failed', 'pending'];
                const weights = [0.7, 0.2, 0.1]; // 70% succès, 20% échec, 10% en attente

                const random = Math.random();
                let status = 'pending';

                if (random < weights[0]) {
                    status = 'completed';
                } else if (random < weights[0] + weights[1]) {
                    status = 'failed';
                }

                resolve({
                    success: true,
                    status: status,
                    transactionId: status === 'completed' ? 'TXN_' + Date.now() : null,
                    amount: 850000,
                    fees: 0,
                    message: status === 'completed'
                        ? 'Paiement réussi'
                        : status === 'failed'
                            ? 'Paiement échoué - Solde insuffisant'
                            : 'Paiement en attente',
                    data: { requestId, status }
                });
            }, 2000);
        });
    }
}

// Exporter une instance unique du service
export const waveService = new WaveService();
export default waveService;