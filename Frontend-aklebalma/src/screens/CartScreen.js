// src/screens/CartScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    FlatList,
    Alert,
    ActivityIndicator
} from 'react-native';
import { cartService } from '../services/cartService';

const CartScreen = ({ navigation, user, onLogout, onProceedToPayment }) => {
    // États pour la gestion du panier
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [selectedPaymentPlan, setSelectedPaymentPlan] = useState('x3');
    const [cart, setCart] = useState(null);

    // Données initiales du panier (simulation)
    const initialCartItems = [
        {
            id: '1',
            name: 'iPhone 15 Pro',
            price: 850000,
            originalPrice: 950000,
            icon: '📱',
            quantity: 1,
            category: 'Électronique'
        },
        {
            id: '2',
            name: 'Nike Air Force 1',
            price: 85000,
            originalPrice: 95000,
            icon: '👟',
            quantity: 2,
            category: 'Mode'
        },
        {
            id: '3',
            name: 'Samsung TV 55"',
            price: 450000,
            originalPrice: 520000,
            icon: '📺',
            quantity: 1,
            category: 'Électronique'
        }
    ];

    // Options de paiement échelonné
    const paymentPlans = [
        { id: 'x3', label: '3x sans frais', months: 3, fees: 0 },
        { id: 'x4', label: '4x sans frais', months: 4, fees: 0 },
        { id: 'x5', label: '5x sans frais', months: 5, fees: 0 },
        { id: 'x6', label: '6x sans frais', months: 6, fees: 0 },
        { id: 'x10', label: '10x (+2%)', months: 10, fees: 0.02 }
    ];

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            setLoading(true);
            const userId = 3; // À remplacer par l'ID utilisateur réel

            // Charger le panier depuis l'API
            const cartData = await cartService.getCart(userId);
            setCart(cartData);

            // Pour la démo, utiliser les données initiales
            setCartItems(initialCartItems);

            console.log('✅ Panier chargé:', cartData);
        } catch (error) {
            console.error('❌ Erreur chargement panier:', error);
            // En cas d'erreur, utiliser les données de test
            setCartItems(initialCartItems);
        } finally {
            setLoading(false);
        }
    };

    const updateCartOnServer = async (newTotal) => {
        try {
            const userId = 3; // À remplacer par l'ID utilisateur réel
            await cartService.updateCart(userId, newTotal);
            setCart({ ...cart, totalAmount: newTotal });
        } catch (error) {
            console.error('❌ Erreur mise à jour panier:', error);
            throw error;
        }
    };

    const formatPrice = (price) => {
        return price.toLocaleString('fr-FR') + ' FCFA';
    };

    const updateQuantity = async (itemId, change) => {
        try {
            setUpdating(true);

            const updatedItems = cartItems.map(item => {
                if (item.id === itemId) {
                    const newQuantity = Math.max(1, item.quantity + change);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });

            setCartItems(updatedItems);

            // Mettre à jour le total sur le serveur
            const newTotal = calculateSubtotalForItems(updatedItems);
            await updateCartOnServer(newTotal);

        } catch (error) {
            console.error('❌ Erreur mise à jour quantité:', error);
            Alert.alert('Erreur', 'Impossible de mettre à jour la quantité');
            // Recharger le panier en cas d'erreur
            loadCart();
        } finally {
            setUpdating(false);
        }
    };

    const removeItem = (itemId) => {
        Alert.alert(
            'Supprimer l\'article',
            'Êtes-vous sûr de vouloir supprimer cet article ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setUpdating(true);

                            const updatedItems = cartItems.filter(item => item.id !== itemId);
                            setCartItems(updatedItems);

                            // Mettre à jour le total sur le serveur
                            const newTotal = calculateSubtotalForItems(updatedItems);
                            await updateCartOnServer(newTotal);

                        } catch (error) {
                            console.error('❌ Erreur suppression article:', error);
                            Alert.alert('Erreur', 'Impossible de supprimer l\'article');
                            loadCart();
                        } finally {
                            setUpdating(false);
                        }
                    }
                }
            ]
        );
    };

    const clearCart = () => {
        Alert.alert(
            'Vider le panier',
            'Êtes-vous sûr de vouloir vider complètement votre panier ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Vider',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setUpdating(true);
                            setCartItems([]);
                            await updateCartOnServer(0);
                        } catch (error) {
                            console.error('❌ Erreur vidage panier:', error);
                            Alert.alert('Erreur', 'Impossible de vider le panier');
                        } finally {
                            setUpdating(false);
                        }
                    }
                }
            ]
        );
    };

    const calculateSubtotalForItems = (items) => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateSubtotal = () => {
        return calculateSubtotalForItems(cartItems);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const selectedPlan = paymentPlans.find(plan => plan.id === selectedPaymentPlan);
        const fees = subtotal * selectedPlan.fees;
        return subtotal + fees;
    };

    const calculateMonthlyPayment = () => {
        const total = calculateTotal();
        const selectedPlan = paymentPlans.find(plan => plan.id === selectedPaymentPlan);
        return total / selectedPlan.months;
    };

    // ✅ FONCTION CORRIGÉE - Une seule version propre
    const proceedToCheckout = async () => {
        if (cartItems.length === 0) {
            Alert.alert('Panier vide', 'Ajoutez des articles avant de procéder au paiement');
            return;
        }

        try {
            setUpdating(true);

            const selectedPlan = paymentPlans.find(plan => plan.id === selectedPaymentPlan);
            const finalTotal = calculateTotal();

            console.log('🛒 Navigation vers Payment avec:', {
                cartItems,
                paymentPlan: selectedPlan,
                totalAmount: finalTotal
            });

            // ✅ UTILISATION CORRECTE DE onProceedToPayment
            if (onProceedToPayment) {
                onProceedToPayment({
                    cartItems,
                    paymentPlan: selectedPlan,
                    totalAmount: finalTotal,
                    userId: user?.id || 3
                });
            } else {
                // Fallback vers navigation directe
                navigation.navigate('Payment', {
                    orderData: {
                        cartItems,
                        paymentPlan: selectedPlan,
                        totalAmount: finalTotal,
                        userId: user?.id || 3
                    }
                });
            }

        } catch (error) {
            console.error('❌ Erreur navigation checkout:', error);
            Alert.alert('Erreur', 'Impossible de procéder au paiement');
        } finally {
            setUpdating(false);
        }
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <View style={styles.itemHeader}>
                <Text style={styles.itemIcon}>{item.icon}</Text>
                <TouchableOpacity
                    style={[styles.removeButton, updating && styles.disabledButton]}
                    onPress={() => removeItem(item.id)}
                    disabled={updating}
                >
                    <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCategory}>{item.category}</Text>

            <View style={styles.priceContainer}>
                <Text style={styles.originalPrice}>{formatPrice(item.originalPrice)}</Text>
                <Text style={styles.currentPrice}>{formatPrice(item.price)}</Text>
            </View>

            <View style={styles.quantityContainer}>
                <TouchableOpacity
                    style={[styles.quantityButton, updating && styles.disabledButton]}
                    onPress={() => updateQuantity(item.id, -1)}
                    disabled={updating}
                >
                    <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.quantity}>{item.quantity}</Text>

                <TouchableOpacity
                    style={[styles.quantityButton, updating && styles.disabledButton]}
                    onPress={() => updateQuantity(item.id, 1)}
                    disabled={updating}
                >
                    <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.itemTotal}>
                Total: {formatPrice(item.price * item.quantity)}
            </Text>
        </View>
    );

    const renderPaymentPlan = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.paymentPlanCard,
                selectedPaymentPlan === item.id && styles.selectedPaymentPlan
            ]}
            onPress={() => setSelectedPaymentPlan(item.id)}
        >
            <View style={styles.paymentPlanHeader}>
                <Text style={[
                    styles.paymentPlanLabel,
                    selectedPaymentPlan === item.id && styles.selectedPaymentPlanText
                ]}>
                    {item.label}
                </Text>
                {selectedPaymentPlan === item.id && (
                    <Text style={styles.checkMark}>✓</Text>
                )}
            </View>

            <Text style={[
                styles.monthlyAmount,
                selectedPaymentPlan === item.id && styles.selectedPaymentPlanText
            ]}>
                {formatPrice(calculateTotal() / item.months)}/mois
            </Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007bff" />
                    <Text style={styles.loadingText}>Chargement du panier...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (cartItems.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.backButtonText}>← Retour</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Mon Panier</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.emptyCart}>
                    <Text style={styles.emptyCartIcon}>🛒</Text>
                    <Text style={styles.emptyCartTitle}>Votre panier est vide</Text>
                    <Text style={styles.emptyCartText}>
                        Découvrez nos produits et profitez du paiement échelonné !
                    </Text>

                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.shopButtonText}>Découvrir nos produits</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.backButtonText}>← Retour</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mon Panier ({cartItems.length})</Text>
                <TouchableOpacity
                    style={[styles.clearButton, updating && styles.disabledButton]}
                    onPress={clearCart}
                    disabled={updating}
                >
                    <Text style={styles.clearButtonText}>🗑️</Text>
                </TouchableOpacity>
            </View>

            {updating && (
                <View style={styles.updatingBanner}>
                    <ActivityIndicator size="small" color="#007bff" />
                    <Text style={styles.updatingText}>Mise à jour...</Text>
                </View>
            )}

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                {/* Articles du panier */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mes articles</Text>
                    <FlatList
                        data={cartItems}
                        renderItem={renderCartItem}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                    />
                </View>

                {/* Options de paiement */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Choisir votre plan de paiement</Text>
                    <FlatList
                        data={paymentPlans}
                        renderItem={renderPaymentPlan}
                        keyExtractor={(item) => item.id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.paymentPlansList}
                    />
                </View>

                {/* Résumé de la commande */}
                <View style={styles.orderSummary}>
                    <Text style={styles.summaryTitle}>Résumé de la commande</Text>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Sous-total:</Text>
                        <Text style={styles.summaryValue}>{formatPrice(calculateSubtotal())}</Text>
                    </View>

                    {paymentPlans.find(plan => plan.id === selectedPaymentPlan).fees > 0 && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Frais:</Text>
                            <Text style={styles.summaryValue}>
                                {formatPrice(calculateTotal() - calculateSubtotal())}
                            </Text>
                        </View>
                    )}

                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.totalValue}>{formatPrice(calculateTotal())}</Text>
                    </View>

                    <View style={styles.paymentInfo}>
                        <Text style={styles.paymentInfoText}>
                            💳 {paymentPlans.find(plan => plan.id === selectedPaymentPlan).label}
                        </Text>
                        <Text style={styles.monthlyPaymentText}>
                            {formatPrice(calculateMonthlyPayment())}/mois
                        </Text>
                    </View>

                    {/* Info Wave */}
                    <View style={styles.waveInfo}>
                        <Text style={styles.waveText}>💰 Paiement sécurisé avec Wave</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bouton de validation */}
            <View style={styles.checkoutContainer}>
                <TouchableOpacity
                    style={[styles.checkoutButton, updating && styles.disabledButton]}
                    onPress={proceedToCheckout}
                    disabled={updating}
                >
                    {updating ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Text style={styles.checkoutButtonText}>
                                Procéder au paiement Wave
                            </Text>
                            <Text style={styles.checkoutButtonSubtext}>
                                {formatPrice(calculateMonthlyPayment())}/mois
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    backButton: {
        padding: 5,
    },
    backButtonText: {
        color: '#007bff',
        fontSize: 16,
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    clearButton: {
        padding: 8,
    },
    clearButtonText: {
        fontSize: 20,
    },
    placeholder: {
        width: 60,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    updatingBanner: {
        backgroundColor: '#e3f2fd',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    updatingText: {
        marginLeft: 8,
        color: '#007bff',
        fontWeight: '500',
    },
    disabledButton: {
        opacity: 0.5,
    },
    content: {
        flex: 1,
    },
    section: {
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 20,
        marginBottom: 15,
    },
    cartItem: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    itemIcon: {
        fontSize: 30,
    },
    removeButton: {
        backgroundColor: '#dc3545',
        borderRadius: 15,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    itemCategory: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    priceContainer: {
        marginBottom: 15,
    },
    originalPrice: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    currentPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    quantityButton: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    quantity: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 20,
    },
    itemTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28a745',
        textAlign: 'right',
    },
    paymentPlansList: {
        paddingHorizontal: 15,
    },
    paymentPlanCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 15,
        marginHorizontal: 5,
        width: 140,
        borderWidth: 2,
        borderColor: '#e9ecef',
    },
    selectedPaymentPlan: {
        borderColor: '#007bff',
        backgroundColor: '#007bff',
    },
    paymentPlanHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    paymentPlanLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    selectedPaymentPlanText: {
        color: '#ffffff',
    },
    checkMark: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    monthlyAmount: {
        fontSize: 12,
        color: '#666',
    },
    orderSummary: {
        backgroundColor: '#ffffff',
        margin: 20,
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#666',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        paddingTop: 10,
        marginTop: 10,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
    },
    paymentInfo: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginTop: 15,
        alignItems: 'center',
    },
    paymentInfoText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 3,
    },
    monthlyPaymentText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28a745',
    },
    waveInfo: {
        backgroundColor: '#e8f5e8',
        borderRadius: 8,
        padding: 12,
        marginTop: 10,
        alignItems: 'center',
    },
    waveText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#28a745',
    },
    checkoutContainer: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    checkoutButton: {
        backgroundColor: '#28a745',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        shadowColor: '#28a745',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    checkoutButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    checkoutButtonSubtext: {
        color: '#d4edda',
        fontSize: 14,
        marginTop: 2,
    },
    emptyCart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyCartIcon: {
        fontSize: 80,
        marginBottom: 20,
    },
    emptyCartTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyCartText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    shopButton: {
        backgroundColor: '#007bff',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    shopButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CartScreen;