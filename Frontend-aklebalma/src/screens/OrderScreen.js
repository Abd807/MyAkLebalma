import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert,
    ActivityIndicator,
    Modal,
    TextInput,
    ScrollView
} from 'react-native';
import { orderService } from '../services/orderService';

const OrderScreen = ({ navigation, user }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('ALL');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [trackingModalVisible, setTrackingModalVisible] = useState(false);
    const [trackingData, setTrackingData] = useState(null);

    const filters = [
        { id: 'ALL', label: 'Toutes', icon: '📋' },
        { id: 'PENDING', label: 'En attente', icon: '⏳' },
        { id: 'CONFIRMED', label: 'Confirmées', icon: '✅' },
        { id: 'SHIPPED', label: 'Expédiées', icon: '📦' },
        { id: 'DELIVERED', label: 'Livrées', icon: '🎉' },
        { id: 'CANCELLED', label: 'Annulées', icon: '❌' }
    ];

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getUserOrders(user.id);

            // Format orders for display
            const formattedOrders = response.orders?.map(order =>
                orderService.formatOrderForDisplay(order)
            ) || [];

            setOrders(formattedOrders);
        } catch (error) {
            console.error('❌ Failed to load orders:', error.message);
            Alert.alert(
                'Erreur',
                'Impossible de charger vos commandes. Vérifiez votre connexion internet.',
                [{ text: 'Réessayer', onPress: loadOrders }]
            );
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadOrders();
        setRefreshing(false);
    };

    const filteredOrders = selectedFilter === 'ALL'
        ? orders
        : orders.filter(order => order.status === orderService.translateStatus(selectedFilter));

    const handleOrderPress = (order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            Alert.alert('Erreur', 'Veuillez indiquer la raison de l\'annulation');
            return;
        }

        try {
            await orderService.cancelOrder(selectedOrder.id, cancelReason);
            Alert.alert('Succès', 'Votre commande a été annulée avec succès');
            setCancelModalVisible(false);
            setCancelReason('');
            setModalVisible(false);
            loadOrders(); // Refresh orders
        } catch (error) {
            Alert.alert('Erreur', error.message);
        }
    };

    const handleTrackOrder = async (order) => {
        try {
            setLoading(true);
            const tracking = await orderService.getOrderTracking(order.id);
            setTrackingData(tracking);
            setTrackingModalVisible(true);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de récupérer les informations de suivi');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelivery = async (order) => {
        Alert.alert(
            'Confirmer la livraison',
            'Avez-vous bien reçu cette commande ?',
            [
                { text: 'Non', style: 'cancel' },
                {
                    text: 'Oui, confirmer',
                    onPress: async () => {
                        try {
                            await orderService.confirmOrderDelivery(order.id);
                            Alert.alert('Succès', 'Livraison confirmée avec succès');
                            loadOrders();
                        } catch (error) {
                            Alert.alert('Erreur', error.message);
                        }
                    }
                }
            ]
        );
    };

    const renderOrderItem = ({ item: order }) => (
        <TouchableOpacity
            style={styles.orderCard}
            onPress={() => handleOrderPress(order)}
            activeOpacity={0.7}
        >
            <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                    <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: order.statusColor }]}>
                    <Text style={styles.statusText}>{order.status}</Text>
                </View>
            </View>

            <View style={styles.orderBody}>
                <Text style={styles.itemCount}>
                    {order.itemCount} article{order.itemCount > 1 ? 's' : ''}
                </Text>
                <Text style={styles.orderTotal}>{order.formattedTotal}</Text>
            </View>

            <View style={styles.orderActions}>
                {order.canTrack && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleTrackOrder(order)}
                    >
                        <Text style={styles.actionButtonText}>📍 Suivre</Text>
                    </TouchableOpacity>
                )}

                {order.canCancel && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => {
                            setSelectedOrder(order);
                            setCancelModalVisible(true);
                        }}
                    >
                        <Text style={[styles.actionButtonText, styles.cancelButtonText]}>❌ Annuler</Text>
                    </TouchableOpacity>
                )}

                {order.isDelivered && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.confirmButton]}
                        onPress={() => handleConfirmDelivery(order)}
                    >
                        <Text style={[styles.actionButtonText, styles.confirmButtonText]}>✅ Confirmer</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );

    const renderFilterButton = ({ item: filter }) => (
        <TouchableOpacity
            style={[
                styles.filterButton,
                selectedFilter === filter.id && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(filter.id)}
        >
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text style={[
                styles.filterText,
                selectedFilter === filter.id && styles.filterTextActive
            ]}>
                {filter.label}
            </Text>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>Aucune commande</Text>
            <Text style={styles.emptyText}>
                {selectedFilter === 'ALL'
                    ? 'Vous n\'avez pas encore passé de commandes'
                    : `Aucune commande ${filters.find(f => f.id === selectedFilter)?.label.toLowerCase()}`
                }
            </Text>
            <TouchableOpacity
                style={styles.shopButton}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.shopButtonText}>🛒 Commencer mes achats</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007bff" />
                    <Text style={styles.loadingText}>Chargement de vos commandes...</Text>
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
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Mes Commandes</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Filters */}
            <View style={styles.filtersContainer}>
                <FlatList
                    data={filters}
                    renderItem={renderFilterButton}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersList}
                />
            </View>

            {/* Orders List */}
            <FlatList
                data={filteredOrders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.ordersList}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#007bff']}
                        tintColor="#007bff"
                    />
                }
                ListEmptyComponent={renderEmptyState}
            />

            {/* Order Detail Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Détails de la commande</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {selectedOrder && (
                            <ScrollView style={styles.modalBody}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Numéro :</Text>
                                    <Text style={styles.detailValue}>{selectedOrder.orderNumber}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Date :</Text>
                                    <Text style={styles.detailValue}>{selectedOrder.date}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Statut :</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: selectedOrder.statusColor }]}>
                                        <Text style={styles.statusText}>{selectedOrder.status}</Text>
                                    </View>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Total :</Text>
                                    <Text style={styles.detailValue}>{selectedOrder.formattedTotal}</Text>
                                </View>

                                <View style={styles.itemsSection}>
                                    <Text style={styles.sectionTitle}>Articles commandés</Text>
                                    {selectedOrder.items?.map((item, index) => (
                                        <View key={index} style={styles.itemRow}>
                                            <Text style={styles.itemName}>{item.name}</Text>
                                            <Text style={styles.itemDetails}>
                                                {item.quantity}x {orderService.formatPrice(item.price)}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Cancel Order Modal */}
            <Modal
                visible={cancelModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setCancelModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Annuler la commande</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setCancelModalVisible(false)}
                            >
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.modalText}>
                                Pourquoi souhaitez-vous annuler cette commande ?
                            </Text>
                            <TextInput
                                style={styles.reasonInput}
                                placeholder="Raison de l'annulation..."
                                placeholderTextColor="#999"
                                value={cancelReason}
                                onChangeText={setCancelReason}
                                multiline
                                numberOfLines={3}
                            />
                            <TouchableOpacity
                                style={styles.confirmCancelButton}
                                onPress={handleCancelOrder}
                            >
                                <Text style={styles.confirmCancelText}>Confirmer l'annulation</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Tracking Modal */}
            <Modal
                visible={trackingModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setTrackingModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Suivi de commande</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setTrackingModalVisible(false)}
                            >
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            {trackingData && (
                                <View style={styles.trackingInfo}>
                                    <Text style={styles.trackingTitle}>📍 Statut actuel</Text>
                                    <Text style={styles.trackingStatus}>{trackingData.currentStatus}</Text>

                                    {trackingData.trackingNumber && (
                                        <View style={styles.trackingRow}>
                                            <Text style={styles.trackingLabel}>Numéro de suivi :</Text>
                                            <Text style={styles.trackingValue}>{trackingData.trackingNumber}</Text>
                                        </View>
                                    )}

                                    {trackingData.estimatedDelivery && (
                                        <View style={styles.trackingRow}>
                                            <Text style={styles.trackingLabel}>Livraison estimée :</Text>
                                            <Text style={styles.trackingValue}>{trackingData.estimatedDelivery}</Text>
                                        </View>
                                    )}

                                    <View style={styles.trackingHistory}>
                                        <Text style={styles.sectionTitle}>Historique</Text>
                                        {trackingData.history?.map((event, index) => (
                                            <View key={index} style={styles.trackingEvent}>
                                                <Text style={styles.eventDate}>{event.date}</Text>
                                                <Text style={styles.eventDescription}>{event.description}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </ScrollView>
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
    header: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingTop: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        elevation: 2,
    },
    backButton: {
        padding: 8,
    },
    backIcon: {
        fontSize: 24,
        color: '#007bff',
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    placeholder: {
        width: 40,
    },
    filtersContainer: {
        backgroundColor: '#ffffff',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    filtersList: {
        paddingHorizontal: 15,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 5,
    },
    filterButtonActive: {
        backgroundColor: '#007bff',
    },
    filterIcon: {
        fontSize: 16,
        marginRight: 5,
    },
    filterText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    ordersList: {
        padding: 20,
    },
    orderCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    orderInfo: {
        flex: 1,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    orderDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    statusBadge: {
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    statusText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    orderBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    itemCount: {
        fontSize: 14,
        color: '#666',
    },
    orderTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
    },
    orderActions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    actionButtonText: {
        fontSize: 12,
        color: '#333',
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#fff5f5',
        borderColor: '#fed7d7',
    },
    cancelButtonText: {
        color: '#e53e3e',
    },
    confirmButton: {
        backgroundColor: '#f0fff4',
        borderColor: '#c6f6d5',
    },
    confirmButtonText: {
        color: '#28a745',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 40,
    },
    shopButton: {
        backgroundColor: '#007bff',
        borderRadius: 25,
        paddingHorizontal: 30,
        paddingVertical: 12,
    },
    shopButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    closeIcon: {
        fontSize: 20,
        color: '#666',
    },
    modalBody: {
        padding: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    detailLabel: {
        fontSize: 16,
        color: '#666',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    itemsSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f9fa',
    },
    itemName: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    itemDetails: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 15,
    },
    reasonInput: {
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    confirmCancelButton: {
        backgroundColor: '#e53e3e',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    confirmCancelText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    trackingInfo: {
        padding: 10,
    },
    trackingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    trackingStatus: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 20,
    },
    trackingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    trackingLabel: {
        fontSize: 14,
        color: '#666',
    },
    trackingValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    trackingHistory: {
        marginTop: 20,
    },
    trackingEvent: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f9fa',
    },
    eventDate: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    eventDescription: {
        fontSize: 14,
        color: '#333',
    },
});

export default OrderScreen;