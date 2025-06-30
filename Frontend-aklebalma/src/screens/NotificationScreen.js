// src/screens/NotificationScreen.js
import React, { useState } from 'react';
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
    RefreshControl
} from 'react-native';
import { useNotifications } from '../hooks/useNotifications';

const NotificationScreen = ({ navigation, user }) => {
    // 🎯 UTILISATION DU HOOK - SUPER SIMPLE !
    const {
        notifications,
        loading,
        refreshing,
        error,
        unreadCount,
        filter,
        stats,
        loadNotifications,
        refreshNotifications,
        loadFilteredNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        setFilter,
        clearError,
        retry
    } = useNotifications({
        autoRefresh: true,        // Charge automatiquement au démarrage
        enablePolling: false,     // Polling désactivé pour commencer
        refreshInterval: 30000    // 30 secondes si polling activé
    });

    // État local pour le filtre actuel
    const [currentFilter, setCurrentFilter] = useState('ALL');

    // Gestion des clics sur notification
    const handleNotificationPress = async (notification) => {
        // Marquer comme lue si pas encore lue
        if (!notification.isRead) {
            const result = await markAsRead(notification.id);
            if (!result.success) {
                Alert.alert('Erreur', 'Impossible de marquer comme lue');
                return;
            }
        }

        // Navigation selon le type de notification
        switch (notification.relatedEntity) {
            case 'ORDER':
                navigation.navigate('OrderDetail', { orderId: notification.relatedEntityId });
                break;
            case 'PAYMENT':
                navigation.navigate('Payment', { paymentId: notification.relatedEntityId });
                break;
            case 'PRODUCT':
                navigation.navigate('ProductDetail', { productId: notification.relatedEntityId });
                break;
            case 'USER':
                navigation.navigate('Profile');
                break;
            default:
                console.log('Notification cliquée:', notification.title);
                break;
        }
    };

    // Gestion de la suppression
    const handleDeleteNotification = (notificationId) => {
        Alert.alert(
            'Supprimer la notification',
            'Êtes-vous sûr de vouloir supprimer cette notification ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await deleteNotification(notificationId);
                        if (!result.success) {
                            Alert.alert('Erreur', 'Impossible de supprimer la notification');
                        }
                    }
                }
            ]
        );
    };

    // Gestion du changement de filtre
    const handleFilterChange = async (newFilter) => {
        setCurrentFilter(newFilter);
        setFilter(newFilter);

        // Optionnel : recharger depuis l'API pour ce filtre
        // await loadFilteredNotifications(newFilter);
    };

    // Gestion du marquage global
    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;

        const result = await markAllAsRead();
        if (result.success) {
            Alert.alert('Succès', 'Toutes les notifications ont été marquées comme lues');
        } else {
            Alert.alert('Erreur', 'Impossible de marquer toutes les notifications');
        }
    };

    // Formatage du timestamp
    const formatTimestamp = (timestamp) => {
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
    };

    // Rendu d'une notification
    const renderNotification = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.notificationCard,
                !item.isRead && styles.notificationCardUnread
            ]}
            onPress={() => handleNotificationPress(item)}
            onLongPress={() => handleDeleteNotification(item.id)}
        >
            <View style={styles.notificationContent}>
                <View style={[styles.notificationIcon, { backgroundColor: item.color + '20' }]}>
                    <Text style={[styles.notificationIconText, { color: item.color }]}>
                        {item.icon}
                    </Text>
                </View>

                <View style={styles.notificationText}>
                    <View style={styles.notificationHeader}>
                        <Text style={[
                            styles.notificationTitle,
                            !item.isRead && styles.notificationTitleUnread
                        ]}>
                            {item.title}
                        </Text>
                        <Text style={styles.notificationTime}>
                            {formatTimestamp(item.timestamp)}
                        </Text>
                    </View>

                    <Text style={styles.notificationMessage} numberOfLines={2}>
                        {item.message}
                    </Text>

                    <View style={styles.notificationFooter}>
                        <View style={[
                            styles.priorityBadge,
                            styles[`priority${item.priority}`]
                        ]}>
                            <Text style={[
                                styles.priorityText,
                                styles[`priorityText${item.priority}`]
                            ]}>
                                {item.priority === 'HIGH' ? 'Urgent' :
                                    item.priority === 'MEDIUM' ? 'Important' : 'Info'}
                            </Text>
                        </View>

                        {!item.isRead && <View style={styles.unreadDot} />}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    // État d'erreur
    const renderError = () => (
        <View style={styles.errorState}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Erreur de chargement</Text>
            <Text style={styles.errorMessage}>{error?.message}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={retry}>
                <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
        </View>
    );

    // État vide
    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔔</Text>
            <Text style={styles.emptyStateTitle}>Aucune notification</Text>
            <Text style={styles.emptyStateMessage}>
                Vous n'avez aucune notification pour le moment
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
            <SafeAreaView style={styles.safeArea}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Notifications</Text>
                        {unreadCount > 0 && (
                            <View style={styles.headerBadge}>
                                <Text style={styles.headerBadgeText}>{unreadCount}</Text>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.markAllButton,
                            unreadCount === 0 && styles.markAllButtonDisabled
                        ]}
                        onPress={handleMarkAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        <Text style={[
                            styles.markAllButtonText,
                            unreadCount === 0 && styles.markAllButtonTextDisabled
                        ]}>
                            ✓
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Bouton de test temporaire */}


                {/* Stats rapides */}
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>
                        📊 Total: {stats.total} | 🔴 Non lues: {stats.unread} | ⚡ Urgentes: {stats.highPriority}
                    </Text>
                </View>

                {/* Filtres */}
                <View style={styles.filterContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {[
                            { key: 'ALL', label: 'Toutes', count: stats.total },
                            { key: 'UNREAD', label: 'Non lues', count: stats.unread },
                            { key: 'read', label: 'Lues', count: stats.read }
                        ].map((filterOption) => (
                            <TouchableOpacity
                                key={filterOption.key}
                                style={[
                                    styles.filterButton,
                                    currentFilter === filterOption.key && styles.filterButtonActive
                                ]}
                                onPress={() => handleFilterChange(filterOption.key)}
                            >
                                <Text style={[
                                    styles.filterButtonText,
                                    currentFilter === filterOption.key && styles.filterButtonTextActive
                                ]}>
                                    {filterOption.label}
                                </Text>
                                {filterOption.count > 0 && (
                                    <View style={[
                                        styles.filterBadge,
                                        currentFilter === filterOption.key && styles.filterBadgeActive
                                    ]}>
                                        <Text style={[
                                            styles.filterBadgeText,
                                            currentFilter === filterOption.key && styles.filterBadgeTextActive
                                        ]}>
                                            {filterOption.count}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Contenu principal */}
                {error ? renderError() : (
                    <FlatList
                        data={notifications}
                        renderItem={renderNotification}
                        keyExtractor={(item) => item.id.toString()}
                        style={styles.notificationsList}
                        contentContainerStyle={styles.notificationsListContainer}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={refreshNotifications}
                                colors={['#3b82f6']}
                            />
                        }
                        ListEmptyComponent={renderEmptyState}
                    />
                )}

            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f5f9',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#f1f5f9',
    },
    header: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingTop: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    backButtonText: {
        fontSize: 18,
        color: '#3b82f6',
        fontWeight: 'bold',
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1e293b',
        letterSpacing: -0.5,
    },
    headerBadge: {
        backgroundColor: '#ef4444',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    headerBadgeText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    markAllButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    markAllButtonDisabled: {
        backgroundColor: '#e2e8f0',
    },
    markAllButtonText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    markAllButtonTextDisabled: {
        color: '#9ca3af',
    },

    // BOUTON TEST TEMPORAIRE
    testButton: {
        backgroundColor: '#ef4444',
        margin: 20,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    testButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 14,
    },

    // STATS
    statsContainer: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    statsText: {
        fontSize: 12,
        color: '#64748b',
        textAlign: 'center',
        fontWeight: '500',
    },

    // FILTRES
    filterContainer: {
        backgroundColor: '#ffffff',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    filterButtonActive: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    filterButtonText: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
    },
    filterButtonTextActive: {
        color: '#ffffff',
    },
    filterBadge: {
        backgroundColor: '#e2e8f0',
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 6,
    },
    filterBadgeActive: {
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    filterBadgeText: {
        fontSize: 10,
        color: '#64748b',
        fontWeight: 'bold',
    },
    filterBadgeTextActive: {
        color: '#ffffff',
    },

    // LISTE NOTIFICATIONS
    notificationsList: {
        flex: 1,
    },
    notificationsListContainer: {
        padding: 20,
    },
    notificationCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#e2e8f0',
    },
    notificationCardUnread: {
        borderLeftColor: '#3b82f6',
        backgroundColor: '#fefffe',
    },
    notificationContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    notificationIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    notificationIconText: {
        fontSize: 20,
    },
    notificationText: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        flex: 1,
        marginRight: 8,
    },
    notificationTitleUnread: {
        fontWeight: '700',
        color: '#1e293b',
    },
    notificationTime: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
    notificationMessage: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
        marginBottom: 8,
    },
    notificationFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priorityBadge: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    priorityHIGH: {
        backgroundColor: '#fef2f2',
    },
    priorityMEDIUM: {
        backgroundColor: '#fef3c7',
    },
    priorityLOW: {
        backgroundColor: '#f0fdf4',
    },
    priorityText: {
        fontSize: 10,
        fontWeight: '600',
    },
    priorityTextHIGH: {
        color: '#dc2626',
    },
    priorityTextMEDIUM: {
        color: '#d97706',
    },
    priorityTextLOW: {
        color: '#16a34a',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3b82f6',
    },

    // ÉTATS D'ERREUR ET VIDE
    errorState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    errorIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ef4444',
        marginBottom: 8,
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 8,
    },
    emptyStateMessage: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default NotificationScreen;