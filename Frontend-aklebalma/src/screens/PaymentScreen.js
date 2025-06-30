import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TextInput,
    Modal,
    Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { cartService } from '../services/cartService';

const PaymentScreen = ({ navigation, route }) => {
    // Données passées depuis le CartScreen
    const { cartItems = [], paymentPlan = {}, totalAmount = 0 } = route?.params || {};

    const [loading, setLoading] = useState(false);
    const [paymentStep, setPaymentStep] = useState('method'); // method, wave, confirmation
    const [wavePhoneNumber, setWavePhoneNumber] = useState('');
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [waveRequestId, setWaveRequestId] = useState(null);
    const [checkingPayment, setCheckingPayment] = useState(false);

    // Données de test pour la démo
    const mockOrderData = {
        orderId: 'ORD-' + Date.now(),
        items: cartItems.length > 0 ? cartItems : [
            {
                id: '1',
                name: 'iPhone 15 Pro',
                price: 850000,
                quantity: 1,
                icon: '📱'
            }
        ],
        totalAmount: totalAmount || 850000,
        paymentPlan: paymentPlan.label || '3x sans frais',
        monthlyAmount: (totalAmount || 850000) / (paymentPlan.months || 3)
    };

    useEffect(() => {
        console.log('💰 PaymentScreen chargé avec:', {
            cartItems,
            paymentPlan,
            totalAmount
        });
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const validateWaveNumber = (phoneNumber) => {
        // Validation numéro Wave Sénégal (commence par 77, 78, 70, 76)
        const waveRegex = /^(77|78|70|76)\d{7}$/;
        return waveRegex.test(phoneNumber.replace(/\s/g, ''));
    };

    const formatPhoneNumber = (text) => {
        // Formater le numéro au format XX XXX XX XX
        const cleaned = text.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
        if (match) {
            return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
        }
        return text;
    };

    const initiateWavePayment = async () => {
        if (!wavePhoneNumber || !validateWaveNumber(wavePhoneNumber)) {
            Alert.alert('Erreur', 'Veuillez entrer un numéro Wave valide (77/78/70/76 XX XX XX)');
            return;
        }

        try {
            setLoading(true);

            // Simulation de l'API Wave
            console.log('💰 Initiation paiement Wave:', {
                phoneNumber: wavePhoneNumber,
                amount: mockOrderData.totalAmount,
                orderId: mockOrderData.orderId
            });

            // Simuler une réponse de l'API Wave
            const waveResponse = {
                success: true,
                requestId: 'WAVE_' + Date.now(),
                status: 'pending',
                message: 'Demande de paiement envoyée'
            };

            if (waveResponse.success) {
                setWaveRequestId(waveResponse.requestId);
                setPaymentModalVisible(true);

                // Simuler la vérification du paiement
                setTimeout(() => {
                    checkPaymentStatus(waveResponse.requestId);
                }, 3000);
            } else {
                throw new Error(waveResponse.message || 'Erreur lors de l\'initiation du paiement');
            }

        } catch (error) {
            console.error('❌ Erreur paiement Wave:', error);
            Alert.alert('Erreur', 'Impossible d\'initier le paiement Wave. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const checkPaymentStatus = async (requestId) => {
        try {
            setCheckingPayment(true);

            // Simulation vérification statut paiement Wave
            console.log('🔍 Vérification statut paiement:', requestId);

            // Simuler une réponse positive après 3 secondes
            setTimeout(() => {
                const paymentSuccess = Math.random() > 0.3; // 70% de succès pour la démo

                if (paymentSuccess) {
                    handlePaymentSuccess();
                } else {
                    handlePaymentFailure();
                }
                setCheckingPayment(false);
            }, 2000);

        } catch (error) {
            console.error('❌ Erreur vérification paiement:', error);
            setCheckingPayment(false);
            Alert.alert('Erreur', 'Impossible de vérifier le statut du paiement');
        }
    };

    const handlePaymentSuccess = async () => {
        try {
            setPaymentModalVisible(false);

            // Vider le panier après paiement réussi
            const userId = 3; // À remplacer par l'ID utilisateur réel
            await cartService.updateCart(userId, 0);

            // Naviguer vers l'écran de confirmation
            setPaymentStep('confirmation');

            // Afficher la notification de succès
            setTimeout(() => {
                Alert.alert(
                    'Paiement réussi ! 🎉',
                    `Votre commande ${mockOrderData.orderId} a été confirmée.\nVous recevrez un SMS de confirmation.`,
                    [
                        {
                            text: 'Voir ma commande',
                            onPress: () => navigation.navigate('Orders')
                        },
                        {
                            text: 'Retour à l\'accueil',
                            onPress: () => navigation.navigate('Home'),
                            style: 'cancel'
                        }
                    ]
                );
            }, 1000);

        } catch (error) {
            console.error('❌ Erreur finalisation paiement:', error);
        }
    };

    const handlePaymentFailure = () => {
        setPaymentModalVisible(false);
        Alert.alert(
            'Paiement échoué',
            'Le paiement n\'a pas pu être traité. Veuillez vérifier votre solde Wave et réessayer.',
            [
                { text: 'Réessayer', onPress: () => initiateWavePayment() },
                { text: 'Annuler', style: 'cancel' }
            ]
        );
    };

    const openWaveApp = () => {
        // Tenter d'ouvrir l'app Wave
        const waveUrl = 'wave://';
        Linking.canOpenURL(waveUrl)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(waveUrl);
                } else {
                    // Rediriger vers le Play Store pour télécharger Wave
                    return Linking.openURL('https://play.google.com/store/apps/details?id=com.wave.personal');
                }
            })
            .catch((err) => console.log('❌ Erreur ouverture Wave:', err));
    };

    if (paymentStep === 'confirmation') {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.confirmationContainer}>
                    <Icon name="checkmark-circle" size={80} color="#28a745" />
                    <Text style={styles.confirmationTitle}>Paiement réussi !</Text>
                    <Text style={styles.confirmationText}>
                        Votre commande {mockOrderData.orderId} a été confirmée
                    </Text>
                    <Text style={styles.confirmationAmount}>
                        Montant: {formatPrice(mockOrderData.totalAmount)}
                    </Text>

                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.homeButtonText}>Retour à l'accueil</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Paiement</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                {/* Résumé de commande */}
                <View style={styles.orderSummary}>
                    <Text style={styles.sectionTitle}>Résumé de votre commande</Text>

                    <View style={styles.orderInfo}>
                        <Text style={styles.orderId}>Commande: {mockOrderData.orderId}</Text>
                        <Text style={styles.itemCount}>
                            {mockOrderData.items.length} article{mockOrderData.items.length > 1 ? 's' : ''}
                        </Text>
                    </View>

                    <View style={styles.orderItems}>
                        {mockOrderData.items.slice(0, 2).map((item, index) => (
                            <View key={index} style={styles.orderItem}>
                                <Text style={styles.itemIcon}>{item.icon}</Text>
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemPrice}>
                                        {formatPrice(item.price)} x {item.quantity}
                                    </Text>
                                </View>
                            </View>
                        ))}
                        {mockOrderData.items.length > 2 && (
                            <Text style={styles.moreItems}>
                                +{mockOrderData.items.length - 2} autre{mockOrderData.items.length - 2 > 1 ? 's' : ''} article{mockOrderData.items.length - 2 > 1 ? 's' : ''}
                            </Text>
                        )}
                    </View>

                    <View style={styles.totalContainer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total:</Text>
                            <Text style={styles.totalAmount}>
                                {formatPrice(mockOrderData.totalAmount)}
                            </Text>
                        </View>
                        <View style={styles.planInfo}>
                            <Text style={styles.planText}>
                                📅 {mockOrderData.paymentPlan} - {formatPrice(mockOrderData.monthlyAmount)}/mois
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Méthode de paiement Wave */}
                <View style={styles.paymentMethodSection}>
                    <Text style={styles.sectionTitle}>Méthode de paiement</Text>

                    <View style={styles.waveMethodCard}>
                        <View style={styles.waveHeader}>
                            <View style={styles.waveLogo}>
                                <Text style={styles.waveLogoText}>💰</Text>
                            </View>
                            <View style={styles.waveInfo}>
                                <Text style={styles.waveTitle}>Wave Money</Text>
                                <Text style={styles.waveSubtitle}>Paiement mobile sécurisé</Text>
                            </View>
                            <Icon name="checkmark-circle" size={24} color="#28a745" />
                        </View>

                        <View style={styles.waveFeatures}>
                            <Text style={styles.featureText}>✓ Paiement instantané</Text>
                            <Text style={styles.featureText}>✓ 100% sécurisé</Text>
                            <Text style={styles.featureText}>✓ Aucuns frais supplémentaires</Text>
                        </View>
                    </View>
                </View>

                {/* Saisie numéro Wave */}
                <View style={styles.phoneInputSection}>
                    <Text style={styles.sectionTitle}>Numéro Wave</Text>

                    <View style={styles.phoneInputContainer}>
                        <View style={styles.countryCode}>
                            <Text style={styles.countryCodeText}>🇸🇳 +221</Text>
                        </View>
                        <TextInput
                            style={styles.phoneInput}
                            placeholder="77 XXX XX XX"
                            value={wavePhoneNumber}
                            onChangeText={(text) => setWavePhoneNumber(formatPhoneNumber(text))}
                            keyboardType="numeric"
                            maxLength={11}
                        />
                    </View>

                    <Text style={styles.phoneHint}>
                        Entrez votre numéro Wave (77, 78, 70 ou 76)
                    </Text>

                    <TouchableOpacity
                        style={styles.openWaveButton}
                        onPress={openWaveApp}
                    >
                        <Icon name="phone-portrait" size={20} color="#007bff" />
                        <Text style={styles.openWaveText}>Ouvrir l'app Wave</Text>
                    </TouchableOpacity>
                </View>

                {/* Conditions */}
                <View style={styles.termsSection}>
                    <Text style={styles.termsText}>
                        En procédant au paiement, vous acceptez nos{' '}
                        <Text style={styles.termsLink}>conditions d'utilisation</Text>
                        {' '}et notre{' '}
                        <Text style={styles.termsLink}>politique de confidentialité</Text>.
                    </Text>
                </View>
            </ScrollView>

            {/* Bouton de paiement */}
            <View style={styles.paymentButtonContainer}>
                <TouchableOpacity
                    style={[
                        styles.paymentButton,
                        (!wavePhoneNumber || loading) && styles.paymentButtonDisabled
                    ]}
                    onPress={initiateWavePayment}
                    disabled={!wavePhoneNumber || loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Icon name="card" size={20} color="#fff" />
                            <Text style={styles.paymentButtonText}>
                                Payer {formatPrice(mockOrderData.totalAmount)}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Modal de paiement Wave */}
            <Modal
                visible={paymentModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setPaymentModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Paiement Wave en cours</Text>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setPaymentModalVisible(false)}
                            >
                                <Icon name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <View style={styles.waveAnimation}>
                                <ActivityIndicator size="large" color="#007bff" />
                                <Text style={styles.animationText}>💰</Text>
                            </View>

                            <Text style={styles.modalMessage}>
                                {checkingPayment
                                    ? 'Vérification du paiement...'
                                    : `Une demande de paiement de ${formatPrice(mockOrderData.totalAmount)} a été envoyée à votre numéro Wave ${wavePhoneNumber}`
                                }
                            </Text>

                            <View style={styles.modalInstructions}>
                                <Text style={styles.instructionText}>
                                    📱 Vérifiez votre téléphone pour confirmer le paiement
                                </Text>
                                <Text style={styles.instructionText}>
                                    🔐 Entrez votre code PIN Wave
                                </Text>
                                <Text style={styles.instructionText}>
                                    ✅ Confirmez la transaction
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.openWaveButtonModal}
                                onPress={openWaveApp}
                            >
                                <Text style={styles.openWaveTextModal}>Ouvrir Wave</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backBtn: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    placeholder: {
        width: 30,
    },
    content: {
        flex: 1,
    },
    orderSummary: {
        backgroundColor: '#fff',
        margin: 15,
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    orderInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    orderId: {
        fontSize: 14,
        color: '#666',
    },
    itemCount: {
        fontSize: 14,
        color: '#666',
    },
    orderItems: {
        marginBottom: 20,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    itemIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    itemPrice: {
        fontSize: 12,
        color: '#666',
    },
    moreItems: {
        fontSize: 12,
        color: '#007bff',
        fontStyle: 'italic',
        marginTop: 5,
    },
    totalContainer: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 15,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007bff',
    },
    planInfo: {
        backgroundColor: '#e8f5e8',
        borderRadius: 8,
        padding: 10,
    },
    planText: {
        fontSize: 14,
        color: '#28a745',
        textAlign: 'center',
        fontWeight: '500',
    },
    paymentMethodSection: {
        backgroundColor: '#fff',
        margin: 15,
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    waveMethodCard: {
        borderWidth: 2,
        borderColor: '#28a745',
        borderRadius: 12,
        padding: 15,
        backgroundColor: '#f8fff8',
    },
    waveHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    waveLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#28a745',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    waveLogoText: {
        fontSize: 20,
    },
    waveInfo: {
        flex: 1,
    },
    waveTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    waveSubtitle: {
        fontSize: 12,
        color: '#666',
    },
    waveFeatures: {
        paddingLeft: 10,
    },
    featureText: {
        fontSize: 14,
        color: '#28a745',
        marginBottom: 5,
    },
    phoneInputSection: {
        backgroundColor: '#fff',
        margin: 15,
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    phoneInputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 10,
    },
    countryCode: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRightWidth: 1,
        borderRightColor: '#ddd',
    },
    countryCodeText: {
        fontSize: 16,
        color: '#333',
    },
    phoneInput: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    phoneHint: {
        fontSize: 12,
        color: '#666',
        marginBottom: 15,
    },
    openWaveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e3f2fd',
        borderRadius: 8,
        paddingVertical: 12,
    },
    openWaveText: {
        color: '#007bff',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
    },
    termsSection: {
        margin: 15,
        paddingHorizontal: 5,
    },
    termsText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        lineHeight: 18,
    },
    termsLink: {
        color: '#007bff',
        textDecorationLine: 'underline',
    },
    paymentButtonContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    paymentButton: {
        backgroundColor: '#28a745',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 10,
    },
    paymentButtonDisabled: {
        backgroundColor: '#ccc',
    },
    paymentButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    confirmationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    confirmationTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#28a745',
        marginTop: 20,
        marginBottom: 10,
    },
    confirmationText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    confirmationAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    homeButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10,
    },
    homeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        width: '100%',
        maxWidth: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    modalCloseButton: {
        padding: 5,
    },
    modalBody: {
        padding: 20,
        alignItems: 'center',
    },
    waveAnimation: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    animationText: {
        position: 'absolute',
        fontSize: 30,
    },
    modalMessage: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    modalInstructions: {
        width: '100%',
        marginBottom: 20,
    },
    instructionText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        textAlign: 'center',
    },
    openWaveButtonModal: {
        backgroundColor: '#28a745',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
    },
    openWaveTextModal: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PaymentScreen;