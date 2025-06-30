import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { adminService } from '../../services/adminService';

const AdminDashboardScreen = ({ navigation, user, onLogout }) => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalCredit: 0,
        activeUsers: 0,
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const statsData = await adminService.getStats();
            setStats(statsData);
        } catch (error) {
            console.log('❌ Erreur chargement stats:', error);
            Alert.alert('Erreur', 'Impossible de charger les statistiques');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadStats();
        setRefreshing(false);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const adminActions = [
        {
            title: '👥 Gérer Utilisateurs',
            subtitle: `${stats.totalUsers} utilisateurs (${stats.activeUsers} actifs)`,
            color: '#007AFF',
            action: () => {
                Alert.alert('En développement', 'Gestion des utilisateurs bientôt disponible');
                // navigation.navigate('AdminUsers');
            }
        },
        {
            title: '📦 Gérer Produits',
            subtitle: `${stats.totalProducts} produits`,
            color: '#34C759',
            action: () => {
                Alert.alert('En développement', 'Gestion des produits bientôt disponible');
                // navigation.navigate('AdminProducts');
            }
        },
        {
            title: '💰 Gérer Crédits',
            subtitle: `Total: ${formatCurrency(stats.totalCredit)}`,
            color: '#FF9500',
            action: () => {
                Alert.alert('En développement', 'Gestion des crédits bientôt disponible');
                // navigation.navigate('AdminCredits');
            }
        },
        {
            title: '📊 Statistiques',
            subtitle: 'Rapports détaillés',
            color: '#5856D6',
            action: () => {
                Alert.alert('En développement', 'Statistiques détaillées bientôt disponibles');
                // navigation.navigate('AdminStats');
            }
        },
        {
            title: '⚙️ Paramètres',
            subtitle: 'Configuration app',
            color: '#8E8E93',
            action: () => {
                Alert.alert('En développement', 'Paramètres bientôt disponibles');
                // navigation.navigate('AdminSettings');
            }
        }
    ];

    const handleLogout = () => {
        Alert.alert(
            'Déconnexion',
            'Voulez-vous vous déconnecter ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Déconnexion',
                    style: 'destructive',
                    onPress: onLogout
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Chargement du tableau de bord...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>👑 Admin Dashboard</Text>
                <Text style={styles.subtitle}>Bienvenue {user.fullName}</Text>
                <Text style={styles.roleText}>Rôle: {user.role}</Text>
            </View>

            {/* Statistiques */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.totalUsers}</Text>
                    <Text style={styles.statLabel}>Utilisateurs</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.totalProducts}</Text>
                    <Text style={styles.statLabel}>Produits</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>
                        {(stats.totalCredit / 1000000).toFixed(1)}M
                    </Text>
                    <Text style={styles.statLabel}>Crédit Total</Text>
                </View>
            </View>

            {/* Actions Admin */}
            <View style={styles.actionsContainer}>
                <Text style={styles.sectionTitle}>🔧 Actions Administrateur</Text>

                {adminActions.map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.actionCard, { borderLeftColor: action.color }]}
                        onPress={action.action}
                    >
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>{action.title}</Text>
                            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                        </View>
                        <Text style={styles.actionArrow}>→</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Bouton de déconnexion */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>🚪 Déconnexion</Text>
            </TouchableOpacity>

            {/* Footer info */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    header: {
        backgroundColor: '#007AFF',
        padding: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#E3F2FD',
        textAlign: 'center',
        marginTop: 5,
    },
    roleText: {
        fontSize: 14,
        color: '#BBDEFB',
        textAlign: 'center',
        marginTop: 3,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
    },
    statCard: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        minWidth: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
        textAlign: 'center',
    },
    actionsContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    actionCard: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    actionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    actionArrow: {
        fontSize: 20,
        color: '#999',
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
        margin: 20,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    logoutText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#999',
    },
});

export default AdminDashboardScreen;