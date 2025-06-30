// src/screens/ProfileScreen.js - Version moderne
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Alert,
    Switch,
    Modal,
    TextInput,
    Animated
} from 'react-native';

const ProfileScreen = ({ navigation, user, onLogout }) => {
    // États pour les paramètres
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [autoPayment, setAutoPayment] = useState(true);

    // États pour les modales
    const [editProfileModal, setEditProfileModal] = useState(false);
    const [changePasswordModal, setChangePasswordModal] = useState(false);
    const [editedUser, setEditedUser] = useState({});
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Données utilisateur par défaut
    const defaultUser = {
        id: 1,
        firstName: 'Moussa',
        lastName: 'Diop',
        email: 'moussa.diop@gmail.com',
        phone: '77 123 45 67',
        address: 'Dakar, Plateau',
        memberSince: '2024',
        creditLimit: 2000000,
        usedCredit: 750000,
        totalOrders: 12,
        totalSaved: 150000,
        loyaltyPoints: 1250,
        avatar: null
    };

    const currentUser = user || defaultUser;

    const formatPrice = (price) => {
        if (!price || isNaN(price)) {
            return '0 FCFA';
        }
        return price.toLocaleString('fr-FR') + ' FCFA';
    };

    const calculateCreditPercentage = () => {
        if (!currentUser.usedCredit || !currentUser.creditLimit) {
            return 0;
        }
        return (currentUser.usedCredit / currentUser.creditLimit) * 100;
    };

    // Menu items avec design moderne
    const menuItems = [
        {
            id: 'orders',
            title: 'Mes commandes',
            icon: '📦',
            description: `${currentUser.totalOrders} commandes`,
            bgColor: '#3b82f6',
            onPress: () => navigation.navigate('Orders')
        },
        {
            id: 'payments',
            title: 'Mes paiements',
            icon: '💳',
            description: 'Échéances et historique',
            bgColor: '#10b981',
            onPress: () => showPaymentHistory()
        },
        {
            id: 'addresses',
            title: 'Mes adresses',
            icon: '📍',
            description: 'Livraison et facturation',
            bgColor: '#f59e0b',
            onPress: () => showAddresses()
        },
        {
            id: 'favorites',
            title: 'Mes favoris',
            icon: '❤️',
            description: 'Produits sauvegardés',
            bgColor: '#ef4444',
            onPress: () => showFavorites()
        },
        {
            id: 'rewards',
            title: 'Programme fidélité',
            icon: '🎁',
            description: `${currentUser.loyaltyPoints} points`,
            bgColor: '#8b5cf6',
            onPress: () => showLoyaltyProgram()
        },
        {
            id: 'wave',
            title: 'Mon compte Wave',
            icon: '💰',
            description: 'Portefeuille et transactions',
            bgColor: '#06b6d4',
            onPress: () => showWaveAccount()
        }
    ];

    const supportItems = [
        {
            id: 'help',
            title: 'Centre d\'aide',
            icon: '❓',
            color: '#3b82f6',
            onPress: () => showHelpCenter()
        },
        {
            id: 'contact',
            title: 'Nous contacter',
            icon: '📞',
            color: '#10b981',
            onPress: () => contactSupport()
        },
        {
            id: 'call',
            title: 'Appeler le support',
            icon: '☎️',
            color: '#ef4444',
            onPress: () => callSupport()
        },
        {
            id: 'feedback',
            title: 'Donner mon avis',
            icon: '⭐',
            color: '#f59e0b',
            onPress: () => showFeedback()
        }
    ];

    // Fonctions d'actions (simplifiées pour l'exemple)
    const showPaymentHistory = () => {
        Alert.alert('Historique des paiements', `Prochaine échéance: 15 Jan 2025\nMontant: ${formatPrice(85000)}`);
    };

    const showAddresses = () => {
        Alert.alert('Mes adresses', 'Adresse de livraison:\n📍 Dakar, Plateau, Rue 15');
    };

    const showFavorites = () => {
        Alert.alert('Mes favoris', '❤️ 3 produits dans vos favoris');
    };

    const showLoyaltyProgram = () => {
        Alert.alert('Programme fidélité', `🎁 Vous avez ${currentUser.loyaltyPoints} points!`);
    };

    const showWaveAccount = () => {
        Alert.alert('Mon compte Wave', `💰 Solde: ${formatPrice(125000)}`);
    };

    const showHelpCenter = () => {
        Alert.alert('Centre d\'aide', 'Questions fréquentes disponibles');
    };

    const contactSupport = () => {
        Alert.alert('Nous contacter', '📧 Email: support@myaklebalma.sn\n📞 Tél: +221 33 123 45 67');
    };

    const callSupport = () => {
        Alert.alert('Appeler le support', 'Choisissez le service à contacter', [
            { text: 'Support technique', onPress: () => console.log('Appel support technique') },
            { text: 'Service client', onPress: () => console.log('Appel service client') },
            { text: 'Annuler', style: 'cancel' }
        ]);
    };

    const showFeedback = () => {
        Alert.alert('Donner mon avis', 'Votre avis nous intéresse!');
    };

    const handleEditProfile = () => {
        setEditedUser(currentUser);
        setEditProfileModal(true);
    };

    const saveProfile = () => {
        Alert.alert('Succès', 'Profil mis à jour avec succès!');
        setEditProfileModal(false);
    };

    const handleChangePassword = () => {
        setChangePasswordModal(true);
    };

    const savePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }
        Alert.alert('Succès', 'Mot de passe modifié avec succès!');
        setChangePasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleLogout = () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Se déconnecter', style: 'destructive', onPress: onLogout }
            ]
        );
    };

    const renderMenuItem = (item, index) => (
        <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, { marginBottom: index === menuItems.length - 1 ? 0 : 16 }]}
            onPress={item.onPress}
        >
            <View style={[styles.menuItemIcon, { backgroundColor: item.bgColor }]}>
                <Text style={styles.menuItemIconText}>{item.icon}</Text>
            </View>

            <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemDescription}>{item.description}</Text>
            </View>

            <View style={styles.menuItemArrow}>
                <Text style={styles.arrowText}>›</Text>
            </View>
        </TouchableOpacity>
    );

    const renderSupportItem = (item, index) => (
        <TouchableOpacity
            key={item.id}
            style={[styles.supportItem, { marginBottom: index === supportItems.length - 1 ? 0 : 12 }]}
            onPress={item.onPress}
        >
            <View style={[styles.supportItemIcon, { backgroundColor: item.color + '20' }]}>
                <Text style={[styles.supportItemIconText, { color: item.color }]}>{item.icon}</Text>
            </View>
            <Text style={styles.supportItemTitle}>{item.title}</Text>
            <Text style={styles.supportItemArrow}>›</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
            <SafeAreaView style={styles.safeArea}>

                {/* Header moderne */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>MyAklebalma</Text>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleEditProfile}
                    >
                        <Text style={styles.editButtonText}>✏️</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                    {/* Profil utilisateur moderne */}
                    <View style={styles.profileSection}>
                        <View style={styles.profileCard}>
                            <View style={styles.avatarContainer}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {currentUser.firstName.charAt(0)}{currentUser.lastName.charAt(0)}
                                    </Text>
                                </View>
                                <View style={styles.onlineIndicator} />
                            </View>

                            <Text style={styles.userName}>
                                {currentUser.firstName} {currentUser.lastName}
                            </Text>
                            <Text style={styles.userEmail}>{currentUser.email}</Text>
                            <Text style={styles.userPhone}>📱 {currentUser.phone}</Text>
                            <Text style={styles.userAddress}>📍 {currentUser.address}</Text>

                            <View style={styles.membershipBadge}>
                                <Text style={styles.membershipText}>
                                    🏪 Membre Premium depuis {currentUser.memberSince}
                                </Text>
                            </View>

                            {/* Statistiques modernes */}
                            <View style={styles.statsContainer}>
                                <View style={styles.statCard}>
                                    <Text style={styles.statNumber}>{currentUser.totalOrders}</Text>
                                    <Text style={styles.statLabel}>Commandes</Text>
                                </View>
                                <View style={styles.statCard}>
                                    <Text style={styles.statNumber}>{Math.round(currentUser.totalSaved/1000)}K</Text>
                                    <Text style={styles.statLabel}>Économisé</Text>
                                </View>
                                <View style={styles.statCard}>
                                    <Text style={styles.statNumber}>{currentUser.loyaltyPoints}</Text>
                                    <Text style={styles.statLabel}>Points</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Limite de crédit moderne */}
                    <View style={styles.creditSection}>
                        <View style={styles.creditCard}>
                            <View style={styles.creditHeader}>
                                <Text style={styles.creditTitle}>Ma limite de crédit</Text>
                                <Text style={styles.creditPercentage}>{Math.round(calculateCreditPercentage())}%</Text>
                            </View>

                            <View style={styles.creditProgressContainer}>
                                <View style={styles.creditProgressBackground}>
                                    <View
                                        style={[
                                            styles.creditProgressFill,
                                            { width: `${Math.min(calculateCreditPercentage(), 100)}%` }
                                        ]}
                                    />
                                </View>
                            </View>

                            <View style={styles.creditInfo}>
                                <View style={styles.creditInfoItem}>
                                    <Text style={styles.creditInfoLabel}>Utilisé</Text>
                                    <Text style={styles.creditInfoValue}>{formatPrice(currentUser.usedCredit)}</Text>
                                </View>
                                <View style={styles.creditInfoItem}>
                                    <Text style={styles.creditInfoLabel}>Disponible</Text>
                                    <Text style={styles.creditInfoValueGreen}>
                                        {formatPrice(currentUser.creditLimit - currentUser.usedCredit)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Menu principal moderne */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Mon compte</Text>
                        <View style={styles.menuContainer}>
                            {menuItems.map((item, index) => renderMenuItem(item, index))}
                        </View>
                    </View>

                    {/* Paramètres modernes */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Paramètres</Text>
                        <View style={styles.settingsContainer}>

                            <View style={styles.settingItem}>
                                <View style={styles.settingInfo}>
                                    <View style={styles.settingIconContainer}>
                                        <Text style={styles.settingIcon}>🔔</Text>
                                    </View>
                                    <View style={styles.settingTextContainer}>
                                        <Text style={styles.settingTitle}>Notifications push</Text>
                                        <Text style={styles.settingDescription}>Alertes sur vos achats</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={notificationsEnabled}
                                    onValueChange={setNotificationsEnabled}
                                    trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
                                    thumbColor={notificationsEnabled ? '#ffffff' : '#ffffff'}
                                />
                            </View>

                            <View style={styles.settingItem}>
                                <View style={styles.settingInfo}>
                                    <View style={styles.settingIconContainer}>
                                        <Text style={styles.settingIcon}>📧</Text>
                                    </View>
                                    <View style={styles.settingTextContainer}>
                                        <Text style={styles.settingTitle}>Notifications email</Text>
                                        <Text style={styles.settingDescription}>Promotions et actualités</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={emailNotifications}
                                    onValueChange={setEmailNotifications}
                                    trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
                                    thumbColor={emailNotifications ? '#ffffff' : '#ffffff'}
                                />
                            </View>

                            <View style={styles.settingItem}>
                                <View style={styles.settingInfo}>
                                    <View style={styles.settingIconContainer}>
                                        <Text style={styles.settingIcon}>🔐</Text>
                                    </View>
                                    <View style={styles.settingTextContainer}>
                                        <Text style={styles.settingTitle}>Authentification biométrique</Text>
                                        <Text style={styles.settingDescription}>Empreinte ou Face ID</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={biometricEnabled}
                                    onValueChange={setBiometricEnabled}
                                    trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
                                    thumbColor={biometricEnabled ? '#ffffff' : '#ffffff'}
                                />
                            </View>

                            <TouchableOpacity style={styles.passwordButton} onPress={handleChangePassword}>
                                <View style={styles.passwordButtonIcon}>
                                    <Text style={styles.passwordIcon}>🔑</Text>
                                </View>
                                <Text style={styles.passwordButtonText}>Changer le mot de passe</Text>
                                <Text style={styles.passwordButtonArrow}>›</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                    {/* Support moderne */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Support & Aide</Text>
                        <View style={styles.supportContainer}>
                            {supportItems.map((item, index) => renderSupportItem(item, index))}
                        </View>
                    </View>

                    {/* Version */}
                    <View style={styles.versionSection}>
                        <Text style={styles.versionText}>MyAklebalma v1.0.0</Text>
                        <Text style={styles.versionSubText}>Conçu avec ❤️ au Sénégal</Text>
                    </View>

                    {/* Espacement pour éviter le chevauchement */}
                    <View style={styles.bottomSpacing} />
                </ScrollView>

                {/* Bouton de déconnexion moderne */}
                <View style={styles.logoutContainer}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutButtonIcon}>🚪</Text>
                        <Text style={styles.logoutButtonText}>Se déconnecter</Text>
                    </TouchableOpacity>
                </View>

                {/* Modal édition profil */}
                <Modal
                    visible={editProfileModal}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>✏️ Modifier le profil</Text>

                            <TextInput
                                style={styles.modalInput}
                                placeholder="Prénom"
                                value={editedUser.firstName}
                                onChangeText={(text) => setEditedUser({...editedUser, firstName: text})}
                            />

                            <TextInput
                                style={styles.modalInput}
                                placeholder="Nom"
                                value={editedUser.lastName}
                                onChangeText={(text) => setEditedUser({...editedUser, lastName: text})}
                            />

                            <TextInput
                                style={styles.modalInput}
                                placeholder="Téléphone"
                                value={editedUser.phone}
                                onChangeText={(text) => setEditedUser({...editedUser, phone: text})}
                            />

                            <TextInput
                                style={styles.modalInput}
                                placeholder="Adresse"
                                value={editedUser.address}
                                onChangeText={(text) => setEditedUser({...editedUser, address: text})}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalCancelButton}
                                    onPress={() => setEditProfileModal(false)}
                                >
                                    <Text style={styles.modalCancelText}>Annuler</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.modalSaveButton}
                                    onPress={saveProfile}
                                >
                                    <Text style={styles.modalSaveText}>Sauvegarder</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Modal changement mot de passe */}
                <Modal
                    visible={changePasswordModal}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>🔑 Changer le mot de passe</Text>

                            <TextInput
                                style={styles.modalInput}
                                placeholder="Mot de passe actuel"
                                secureTextEntry={true}
                                value={passwordData.currentPassword}
                                onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                            />

                            <TextInput
                                style={styles.modalInput}
                                placeholder="Nouveau mot de passe"
                                secureTextEntry={true}
                                value={passwordData.newPassword}
                                onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                            />

                            <TextInput
                                style={styles.modalInput}
                                placeholder="Confirmer le nouveau mot de passe"
                                secureTextEntry={true}
                                value={passwordData.confirmPassword}
                                onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalCancelButton}
                                    onPress={() => setChangePasswordModal(false)}
                                >
                                    <Text style={styles.modalCancelText}>Annuler</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.modalSaveButton}
                                    onPress={savePassword}
                                >
                                    <Text style={styles.modalSaveText}>Modifier</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
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
        paddingTop: 20, // Plus d'espace en haut
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
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1e293b',
        letterSpacing: -0.5,
    },
    editButton: {
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
    editButtonText: {
        fontSize: 16,
        color: '#ffffff',
    },
    content: {
        flex: 1,
    },

    // PROFIL SECTION MODERNE
    profileSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 20,
    },
    profileCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#10b981',
        borderWidth: 3,
        borderColor: '#ffffff',
    },
    userName: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    userEmail: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 4,
        fontWeight: '500',
    },
    userPhone: {
        fontSize: 15,
        color: '#64748b',
        marginBottom: 4,
        fontWeight: '500',
    },
    userAddress: {
        fontSize: 15,
        color: '#64748b',
        marginBottom: 16,
        fontWeight: '500',
    },
    membershipBadge: {
        backgroundColor: '#10b981',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginBottom: 20,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    membershipText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    statCard: {
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        padding: 16,
        minWidth: 80,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: '#3b82f6',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
    },

    // CRÉDIT SECTION MODERNE
    creditSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    creditCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    creditHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    creditTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
    },
    creditPercentage: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3b82f6',
    },
    creditProgressContainer: {
        marginBottom: 16,
    },
    creditProgressBackground: {
        height: 8,
        backgroundColor: '#e2e8f0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    creditProgressFill: {
        height: '100%',
        backgroundColor: '#3b82f6',
        borderRadius: 4,
    },
    creditInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    creditInfoItem: {
        alignItems: 'center',
    },
    creditInfoLabel: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 4,
    },
    creditInfoValue: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '700',
    },
    creditInfoValueGreen: {
        fontSize: 14,
        color: '#10b981',
        fontWeight: '700',
    },

    // SECTIONS
    section: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 16,
        letterSpacing: -0.5,
    },

    // MENU MODERNE
    menuContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    menuItemIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    menuItemIconText: {
        fontSize: 20,
        color: '#ffffff',
    },
    menuItemContent: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    menuItemDescription: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    menuItemArrow: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowText: {
        fontSize: 18,
        color: '#64748b',
        fontWeight: 'bold',
    },

    // PARAMÈTRES MODERNES
    settingsContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    settingIcon: {
        fontSize: 18,
    },
    settingTextContainer: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    passwordButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#fef3c7',
        borderRadius: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#fbbf24',
    },
    passwordButtonIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f59e0b',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    passwordIcon: {
        fontSize: 18,
        color: '#ffffff',
    },
    passwordButtonText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#92400e',
    },
    passwordButtonArrow: {
        fontSize: 18,
        color: '#92400e',
        fontWeight: 'bold',
    },

    // SUPPORT MODERNE
    supportContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    supportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    supportItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    supportItemIconText: {
        fontSize: 18,
        fontWeight: '600',
    },
    supportItemTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    supportItemArrow: {
        fontSize: 18,
        color: '#64748b',
        fontWeight: 'bold',
    },

    // VERSION
    versionSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    versionText: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 4,
    },
    versionSubText: {
        fontSize: 12,
        color: '#9ca3af',
        fontWeight: '500',
    },

    // LOGOUT MODERNE
    logoutContainer: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    logoutButton: {
        backgroundColor: '#ef4444',
        borderRadius: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    logoutButtonIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    logoutButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },

    // MODALES
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: -0.5,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#f8fafc',
        fontWeight: '500',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        gap: 12,
    },
    modalCancelButton: {
        backgroundColor: '#6b7280',
        borderRadius: 12,
        paddingVertical: 14,
        flex: 1,
        alignItems: 'center',
    },
    modalCancelText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    modalSaveButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 12,
        paddingVertical: 14,
        flex: 1,
        alignItems: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    modalSaveText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    bottomSpacing: {
        height: 20,
    },
});

export default ProfileScreen;