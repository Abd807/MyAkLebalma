import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TextInput,
    FlatList,
    Alert
} from 'react-native';
// 🎯 IMPORT DU HOOK NOTIFICATIONS
import { useNotifications } from '../hooks/useNotifications';

const HomeScreen = ({ navigation, user, cartCount = 0, onLogout, onAddToCart }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    const [activeTab, setActiveTab] = useState('home');

    // 🔔 HOOK NOTIFICATIONS - CORRIGÉ avec userId de la prop user
    const { unreadCount, hasUnread } = useNotifications({
        userId: user?.id,          // ✅ FIX : Utilise la prop user
        autoRefresh: !!user?.id,   // ✅ FIX : Seulement si user connecté
        enablePolling: !!user?.id, // ✅ FIX : Seulement si user connecté
        refreshInterval: 30000     // 30 secondes
    });

    const categories = ['Tous', 'Réfrigérateurs', 'Lave-linge', 'Cuisinières', 'Climatiseurs', 'TV & Audio', 'Petit électroménager'];

    const products = [
        {
            id: '1',
            name: 'Réfrigérateur Samsung 350L',
            price: 450000,
            originalPrice: 520000,
            icon: '🧊',
            category: 'Réfrigérateurs',
            paymentPlan: '6x sans frais',
            monthlyPayment: Math.round(450000 / 6),
            brand: 'Samsung',
            warranty: '2 ans',
            features: ['No Frost', 'Économe en énergie']
        },
        {
            id: '2',
            name: 'Lave-linge LG 8kg',
            price: 320000,
            originalPrice: 380000,
            icon: '🫧',
            category: 'Lave-linge',
            paymentPlan: '5x sans frais',
            monthlyPayment: Math.round(320000 / 5),
            brand: 'LG',
            warranty: '2 ans',
            features: ['Tambour Direct Drive', '14 programmes']
        },
        {
            id: '3',
            name: 'Cuisinière Whirlpool 4 feux',
            price: 180000,
            originalPrice: 220000,
            icon: '🔥',
            category: 'Cuisinières',
            paymentPlan: '4x sans frais',
            monthlyPayment: Math.round(180000 / 4),
            brand: 'Whirlpool',
            warranty: '1 an',
            features: ['Four multifonction', 'Sécurité enfant']
        },
        {
            id: '4',
            name: 'Climatiseur Daikin 1.5CV',
            price: 280000,
            originalPrice: 320000,
            icon: '❄️',
            category: 'Climatiseurs',
            paymentPlan: '5x sans frais',
            monthlyPayment: Math.round(280000 / 5),
            brand: 'Daikin',
            warranty: '3 ans',
            features: ['Inverter', 'Installation incluse']
        },
        {
            id: '5',
            name: 'Smart TV Samsung 55"',
            price: 420000,
            originalPrice: 480000,
            icon: '📺',
            category: 'TV & Audio',
            paymentPlan: '6x sans frais',
            monthlyPayment: Math.round(420000 / 6),
            brand: 'Samsung',
            warranty: '2 ans',
            features: ['4K UHD', 'Smart TV', 'HDR']
        },
        {
            id: '6',
            name: 'Micro-ondes Panasonic',
            price: 95000,
            originalPrice: 115000,
            icon: '📱',
            category: 'Petit électroménager',
            paymentPlan: '3x sans frais',
            monthlyPayment: Math.round(95000 / 3),
            brand: 'Panasonic',
            warranty: '1 an',
            features: ['25L', 'Grill', 'Digital']
        }
    ];

    const formatPrice = (price) => {
        return price.toLocaleString('fr-FR') + ' FCFA';
    };

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleProductPress = (product) => {
        navigation.navigate('ProductDetail', { product });
    };

    const handleAddToCartPress = (product) => {
        onAddToCart(product);
        Alert.alert(
            'Ajouté au panier',
            `${product.name} a été ajouté à votre panier`,
            [
                { text: 'Continuer', style: 'cancel' },
                { text: 'Voir le panier', onPress: () => navigation.navigate('Cart') }
            ]
        );
    };

    // 🔔 GESTION CLIC NOTIFICATIONS - Navigation vers NotificationScreen
    const handleNotificationPress = () => {
        navigation.navigate('Notifications');
    };

    const handleTabPress = (tabId) => {
        setActiveTab(tabId);

        switch (tabId) {
            case 'home':
                // Déjà sur l'accueil
                break;
            case 'search':
                Alert.alert('Recherche', 'Fonctionnalité de recherche avancée');
                break;
            case 'orders':
                navigation.navigate('Orders');
                break;
            case 'cart':
                navigation.navigate('Cart');
                break;
            case 'profile':
                navigation.navigate('Profile');
                break;
            case 'call': // ✅ NOUVEAU: Remplace "menu"
                handleCallService();
                break;
            default:
                break;
        }
    };

    // ✅ NOUVELLE FONCTION: Gestion appel service
    const handleCallService = () => {
        Alert.alert(
            'Service Client',
            'Contactez notre service client pour toute assistance',
            [
                {
                    text: 'Appeler maintenant',
                    onPress: () => {
                        Alert.alert('Appel en cours...', 'Connexion vers +221 33 123 45 67');
                        // Ici vous pourriez intégrer un vrai système d'appel
                    }
                },
                {
                    text: 'WhatsApp',
                    onPress: () => {
                        Alert.alert('WhatsApp', 'Redirection vers WhatsApp...');
                    }
                },
                {
                    text: 'Chat en ligne',
                    onPress: () => {
                        Alert.alert('Chat', 'Fonctionnalité de chat bientôt disponible');
                    }
                },
                { text: 'Annuler', style: 'cancel' }
            ]
        );
    };

    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => handleProductPress(item)}
        >
            <View style={styles.productHeader}>
                <Text style={styles.productIcon}>{item.icon}</Text>
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>
                        -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                    </Text>
                </View>
            </View>

            <Text style={styles.productBrand}>{item.brand}</Text>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productCategory}>{item.category}</Text>

            {/* Caractéristiques principales */}
            <View style={styles.featuresContainer}>
                {item.features.slice(0, 2).map((feature, index) => (
                    <Text key={index} style={styles.featureText}>• {feature}</Text>
                ))}
            </View>

            <View style={styles.priceContainer}>
                <Text style={styles.originalPrice}>{formatPrice(item.originalPrice)}</Text>
                <Text style={styles.currentPrice}>{formatPrice(item.price)}</Text>
            </View>

            <View style={styles.paymentPlanContainer}>
                <Text style={styles.paymentPlanText}>💳 {item.paymentPlan}</Text>
                <Text style={styles.monthlyPaymentText}>
                    {formatPrice(item.monthlyPayment)}/mois
                </Text>
            </View>

            {/* Garantie et livraison */}
            <View style={styles.productFooter}>
                <Text style={styles.warrantyText}>🛡️ {item.warranty}</Text>
                <Text style={styles.deliveryText}>🚚 Livraison gratuite</Text>
            </View>

            <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => handleAddToCartPress(item)}
            >
                <Text style={styles.addToCartText}>🛒 Ajouter au panier</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
            <SafeAreaView style={styles.safeArea}>

                {/* Header moderne avec gradient */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.headerLeft}>
                            <View style={styles.logoContainer}>
                                <Text style={styles.logo}>🏠</Text>
                            </View>
                            <View>
                                <Text style={styles.appName}>MyAklebalma</Text>
                                <Text style={styles.welcomeText}>
                                    Salut {user?.firstName || 'Ami'} ! 👋
                                </Text>
                            </View>
                        </View>

                        <View style={styles.headerRight}>
                            {/* 🔔 NOTIFICATION BUTTON AVEC VRAI BADGE */}
                            <TouchableOpacity
                                style={[
                                    styles.notificationButton,
                                    unreadCount > 0 && styles.notificationButtonWithBadge
                                ]}
                                onPress={handleNotificationPress}
                            >
                                <Text style={[
                                    styles.notificationIcon,
                                    unreadCount > 0 && styles.notificationIconActive
                                ]}>🔔</Text>

                                {/* BADGE DYNAMIQUE - Apparaît seulement s'il y a des non lues */}
                                {unreadCount > 0 && (
                                    <View style={styles.notificationBadge}>
                                        <Text style={styles.notificationBadgeText}>
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cartButton}
                                onPress={() => navigation.navigate('Cart')}
                            >
                                <Text style={styles.cartIcon}>🛒</Text>
                                {cartCount > 0 && (
                                    <View style={styles.cartBadge}>
                                        <Text style={styles.cartBadgeText}>{cartCount}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Contenu principal avec scroll */}
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Barre de recherche moderne */}
                    <View style={styles.searchContainer}>
                        <View style={styles.searchInputContainer}>
                            <Text style={styles.searchIcon}>🔍</Text>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Chercher votre électroménager idéal..."
                                placeholderTextColor="#9ca3af"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            <TouchableOpacity style={styles.filterButton}>
                                <Text style={styles.filterIcon}>⚙️</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Catégories modernes avec icônes */}
                    <View style={styles.categoriesContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScrollView}>
                            {categories.map((category, index) => {
                                const categoryIcons = ['🏠', '🧊', '🫧', '🔥', '❄️', '📺', '🔌'];
                                return (
                                    <TouchableOpacity
                                        key={category}
                                        style={[
                                            styles.categoryButton,
                                            selectedCategory === category && styles.categoryButtonActive
                                        ]}
                                        onPress={() => setSelectedCategory(category)}
                                    >
                                        <Text style={styles.categoryIcon}>{categoryIcons[index]}</Text>
                                        <Text style={[
                                            styles.categoryText,
                                            selectedCategory === category && styles.categoryTextActive
                                        ]}>
                                            {category}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>

                    {/* 🔔 BANNIÈRE NOTIFICATIONS - Apparaît s'il y a des non lues */}
                    {unreadCount > 0 && (
                        <TouchableOpacity
                            style={styles.notificationBanner}
                            onPress={handleNotificationPress}
                        >
                            <View style={styles.notificationBannerContent}>
                                <View style={styles.notificationBannerLeft}>
                                    <Text style={styles.notificationBannerIcon}>🔔</Text>
                                    <View>
                                        <Text style={styles.notificationBannerTitle}>
                                            {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''} notification{unreadCount > 1 ? 's' : ''}
                                        </Text>
                                        <Text style={styles.notificationBannerSubtitle}>
                                            Commandes, promotions et plus
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.notificationBannerArrow}>→</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Bannière moderne avec gradient */}
                    <View style={styles.promoContainer}>
                        <View style={styles.promoContent}>
                            <View style={styles.promoTextContainer}>
                                <Text style={styles.promoTitle}>✨ Électroménager Premium</Text>
                                <Text style={styles.promoText}>
                                    Équipez votre maison avec style
                                </Text>
                                <Text style={styles.promoSubtext}>
                                    💳 Paiement jusqu'à 6x sans frais
                                </Text>
                            </View>
                            <View style={styles.promoIconContainer}>
                                <Text style={styles.promoMainIcon}>🏠</Text>
                            </View>
                        </View>
                    </View>

                    {/* Services avec design moderne */}
                    <View style={styles.servicesContainer}>
                        <View style={styles.servicesHeader}>
                            <Text style={styles.servicesTitle}>Pourquoi nous choisir ?</Text>
                            <Text style={styles.servicesSubtitle}>Services inclus sans frais</Text>
                        </View>
                        <View style={styles.servicesGrid}>
                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.serviceIconContainer}>
                                    <Text style={styles.serviceIcon}>🚚</Text>
                                </View>
                                <Text style={styles.serviceTitle}>Livraison</Text>
                                <Text style={styles.serviceSubtitle}>Gratuite 24h</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.serviceIconContainer}>
                                    <Text style={styles.serviceIcon}>🔧</Text>
                                </View>
                                <Text style={styles.serviceTitle}>Installation</Text>
                                <Text style={styles.serviceSubtitle}>Par nos experts</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.serviceIconContainer}>
                                    <Text style={styles.serviceIcon}>🛡️</Text>
                                </View>
                                <Text style={styles.serviceTitle}>Garantie</Text>
                                <Text style={styles.serviceSubtitle}>Jusqu'à 3 ans</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.serviceIconContainer}>
                                    <Text style={styles.serviceIcon}>💰</Text>
                                </View>
                                <Text style={styles.serviceTitle}>Reprise</Text>
                                <Text style={styles.serviceSubtitle}>Ancien appareil</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Liste des produits */}
                    <View style={styles.productsContainer}>
                        <Text style={styles.sectionTitle}>
                            Électroménager ({filteredProducts.length})
                        </Text>

                        <FlatList
                            data={filteredProducts}
                            renderItem={renderProduct}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            columnWrapperStyle={styles.productRow}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.productsList}
                            scrollEnabled={false}
                        />
                    </View>

                    {/* Espacement pour la navigation bottom */}
                    <View style={styles.bottomSpacing} />
                </ScrollView>

                {/* ✅ NAVIGATION EN BAS MODIFIÉE - Style Alibaba */}
                <View style={styles.bottomNavigation}>
                    <TouchableOpacity
                        style={[styles.navItem, activeTab === 'home' && styles.navItemActive]}
                        onPress={() => handleTabPress('home')}
                    >
                        <View style={styles.navIconContainer}>
                            <Text style={[styles.navIcon, activeTab === 'home' && styles.navIconActive]}>🏠</Text>
                            {activeTab === 'home' && <View style={styles.activeIndicator} />}
                        </View>
                        <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>Accueil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.navItem, activeTab === 'search' && styles.navItemActive]}
                        onPress={() => handleTabPress('search')}
                    >
                        <View style={styles.navIconContainer}>
                            <Text style={[styles.navIcon, activeTab === 'search' && styles.navIconActive]}>🔍</Text>
                            {activeTab === 'search' && <View style={styles.activeIndicator} />}
                        </View>
                        <Text style={[styles.navLabel, activeTab === 'search' && styles.navLabelActive]}>Recherche</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.navItem, activeTab === 'orders' && styles.navItemActive]}
                        onPress={() => handleTabPress('orders')}
                    >
                        <View style={styles.navIconContainer}>
                            <Text style={[styles.navIcon, activeTab === 'orders' && styles.navIconActive]}>📦</Text>
                            {activeTab === 'orders' && <View style={styles.activeIndicator} />}
                        </View>
                        <Text style={[styles.navLabel, activeTab === 'orders' && styles.navLabelActive]}>Commandes</Text>
                    </TouchableOpacity>

                    {/* ✅ NOUVEAU: Icône appel service */}
                    <TouchableOpacity
                        style={[styles.navItem, activeTab === 'call' && styles.navItemActive]}
                        onPress={() => handleTabPress('call')}
                    >
                        <View style={styles.navIconContainer}>
                            <Text style={[styles.navIcon, activeTab === 'call' && styles.navIconActive]}>📞</Text>
                            {activeTab === 'call' && <View style={styles.activeIndicator} />}
                        </View>
                        <Text style={[styles.navLabel, activeTab === 'call' && styles.navLabelActive]}>Service</Text>
                    </TouchableOpacity>

                    {/* ✅ MODIFIÉ: Profile renommé en MyAklebalma et mis au fond */}
                    <TouchableOpacity
                        style={[styles.navItem, styles.profileNavItem, activeTab === 'profile' && styles.navItemActive]}
                        onPress={() => handleTabPress('profile')}
                    >
                        <View style={styles.navIconContainer}>
                            <View style={[styles.profileAvatar, activeTab === 'profile' && styles.profileAvatarActive]}>
                                <Text style={[styles.profileAvatarText, activeTab === 'profile' && styles.profileAvatarTextActive]}>
                                    {user?.firstName?.charAt(0) || 'U'}
                                </Text>
                            </View>
                            {activeTab === 'profile' && <View style={styles.activeIndicator} />}
                        </View>
                        <Text style={[styles.navLabel, styles.profileNavLabel, activeTab === 'profile' && styles.navLabelActive]}>
                            MyAklebalma
                        </Text>
                    </TouchableOpacity>
                </View>
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
        paddingTop: 20, // Plus d'espace en haut
        paddingBottom: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoContainer: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    logo: {
        fontSize: 24,
        color: '#ffffff',
    },
    appName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1e293b',
        letterSpacing: -0.5,
    },
    welcomeText: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 2,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    notificationButton: {
        position: 'relative',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    // 🔔 NOUVEAUX STYLES NOTIFICATION
    notificationButtonWithBadge: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
    },
    notificationIcon: {
        fontSize: 18,
        color: '#64748b',
    },
    notificationIconActive: {
        color: '#ef4444',
    },
    notificationBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#ef4444',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#ffffff',
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    notificationBadgeText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    // 🔔 BANNIÈRE NOTIFICATION
    notificationBanner: {
        backgroundColor: '#fef2f2',
        margin: 20,
        marginTop: 10,
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444',
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    notificationBannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    notificationBannerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    notificationBannerIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    notificationBannerTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#dc2626',
        marginBottom: 2,
    },
    notificationBannerSubtitle: {
        fontSize: 12,
        color: '#7f1d1d',
        fontWeight: '500',
    },
    notificationBannerArrow: {
        fontSize: 16,
        color: '#dc2626',
        fontWeight: 'bold',
    },

    cartButton: {
        position: 'relative',
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
    cartIcon: {
        fontSize: 18,
        color: '#ffffff',
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#ef4444',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    cartBadgeText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    searchContainer: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 12,
        color: '#64748b',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1e293b',
        fontWeight: '500',
    },
    filterButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    filterIcon: {
        fontSize: 14,
        color: '#ffffff',
    },
    categoriesContainer: {
        backgroundColor: '#ffffff',
        paddingBottom: 20,
    },
    categoriesScrollView: {
        paddingHorizontal: 20,
    },
    categoryButton: {
        backgroundColor: '#f8fafc',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 80,
    },
    categoryButtonActive: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    categoryIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    categoryText: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '600',
    },
    categoryTextActive: {
        color: '#ffffff',
        fontWeight: '700',
    },
    promoContainer: {
        backgroundColor: '#3b82f6',
        margin: 20,
        borderRadius: 20,
        padding: 24,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    promoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    promoTextContainer: {
        flex: 1,
    },
    promoTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    promoText: {
        color: '#dbeafe',
        fontSize: 14,
        marginBottom: 4,
        fontWeight: '500',
    },
    promoSubtext: {
        color: '#93c5fd',
        fontSize: 13,
        fontWeight: '600',
    },
    promoIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    promoMainIcon: {
        fontSize: 32,
    },

    // ✅ SERVICES MODERNES
    servicesContainer: {
        backgroundColor: '#ffffff',
        margin: 20,
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    servicesHeader: {
        marginBottom: 20,
        alignItems: 'center',
    },
    servicesTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    servicesSubtitle: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    serviceCard: {
        width: '48%',
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    serviceIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    serviceIcon: {
        fontSize: 20,
        color: '#ffffff',
    },
    serviceTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
        textAlign: 'center',
    },
    serviceSubtitle: {
        fontSize: 12,
        color: '#64748b',
        textAlign: 'center',
        fontWeight: '500',
    },
    productsContainer: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    productsList: {
        paddingBottom: 20,
    },
    productRow: {
        justifyContent: 'space-between',
    },
    productCard: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 15,
        width: '48%',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        minHeight: 280, // Plus haut pour l'électroménager
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    productIcon: {
        fontSize: 32,
    },
    discountBadge: {
        backgroundColor: '#e53e3e',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    discountText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    productBrand: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 3,
    },
    productName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 3,
        lineHeight: 16,
    },
    productCategory: {
        fontSize: 11,
        color: '#666',
        marginBottom: 8,
    },
    featuresContainer: {
        marginBottom: 8,
    },
    featureText: {
        fontSize: 10,
        color: '#28a745',
        marginBottom: 2,
    },
    productFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    warrantyText: {
        fontSize: 9,
        color: '#6c757d',
        fontWeight: '600',
    },
    deliveryText: {
        fontSize: 9,
        color: '#28a745',
        fontWeight: '600',
    },
    priceContainer: {
        marginBottom: 8,
    },
    originalPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    currentPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007bff',
    },
    paymentPlanContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 8,
        marginBottom: 10,
    },
    paymentPlanText: {
        fontSize: 11,
        color: '#333',
        fontWeight: '600',
        marginBottom: 2,
    },
    monthlyPaymentText: {
        fontSize: 13,
        color: '#28a745',
        fontWeight: 'bold',
    },
    addToCartButton: {
        backgroundColor: '#28a745',
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: 'center',
    },
    addToCartText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    bottomSpacing: {
        height: 140,
    },
    bottomNavigation: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingVertical: 12,
        paddingHorizontal: 5,
        paddingBottom: 25,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 12,
        marginHorizontal: 2,
    },
    navItemActive: {
        backgroundColor: 'transparent',
    },
    navIconContainer: {
        position: 'relative',
        alignItems: 'center',
        marginBottom: 4,
    },
    navIcon: {
        fontSize: 22,
        color: '#999',
    },
    navIconActive: {
        color: '#ff6600',
    },
    navLabel: {
        fontSize: 10,
        color: '#999',
        fontWeight: '500',
        textAlign: 'center',
    },
    navLabelActive: {
        color: '#ff6600',
        fontWeight: '600',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: -8,
        width: 4,
        height: 4,
        backgroundColor: '#ff6600',
        borderRadius: 2,
    },
    profileNavItem: {},
    profileNavLabel: {
        fontSize: 9,
        fontWeight: '600',
    },
    profileAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#e9ecef',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    profileAvatarActive: {
        backgroundColor: '#ff6600',
        borderColor: '#ff6600',
    },
    profileAvatarText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#666',
    },
    profileAvatarTextActive: {
        color: '#ffffff',
    },
});

export default HomeScreen;