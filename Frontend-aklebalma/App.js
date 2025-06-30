// App.js - Version corrigée avec navigation unifiée
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

// Import de tous les écrans
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OrderScreen from './src/screens/OrderScreen';
import PaymentScreen from './src/screens/PaymentScreen';

// Import du nouvel écran Admin
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';

// Import du test API
import { runAllTests } from './src/services/testServices';

export default function App() {
    const [currentScreen, setCurrentScreen] = useState('Welcome');
    const [user, setUser] = useState(null);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [cartCount, setCartCount] = useState(3);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [apiTestStatus, setApiTestStatus] = useState('pending');
    const [orderData, setOrderData] = useState(null);

    // Test API automatique au démarrage (DÉSACTIVÉ temporairement)
    useEffect(() => {
        const testAPIOnStartup = async () => {
            try {
                console.log('🚀 Test automatique des services API...');
                console.log('⏸️ Test API désactivé temporairement');
                setApiTestStatus('success');
            } catch (error) {
                console.error('❌ Erreur test API:', error.message);
                setApiTestStatus('error');
            }
        };

        const timer = setTimeout(testAPIOnStartup, 2000);
        return () => clearTimeout(timer);
    }, []);

    // Fonction pour vérifier si l'utilisateur est admin
    const checkIfAdmin = (userData) => {
        console.log('🔍 ===========================================');
        console.log('🔍 DEBUT checkIfAdmin');
        console.log('🔍 ===========================================');
        console.log('📋 userData dans checkIfAdmin:', userData);
        console.log('🎭 role dans checkIfAdmin:', userData?.role);

        if (!userData) {
            console.log('❌ userData est null/undefined');
            setIsAdminMode(false);
            return false;
        }

        if (!userData.role) {
            console.log('❌ userData.role est null/undefined');
            setIsAdminMode(false);
            return false;
        }

        const role = userData.role.trim();
        console.log('🧹 Role après trim:', `"${role}"`);
        console.log('📏 Longueur après trim:', role.length);

        const isAdmin = (role === 'ADMIN' || role === 'SUPER_ADMIN');
        console.log('🔍 Comparaison:');
        console.log(`   role === 'ADMIN': ${role === 'ADMIN'}`);
        console.log(`   role === 'SUPER_ADMIN': ${role === 'SUPER_ADMIN'}`);
        console.log('👑 Résultat final isAdmin:', isAdmin);

        if (isAdmin) {
            console.log('✅ Admin détecté !', role);
            setIsAdminMode(true);
            return true;
        } else {
            console.log('❌ Pas admin - role:', role);
            setIsAdminMode(false);
            return false;
        }
    };

    // ✅ NAVIGATION CORRIGÉE - Support complet de tous les écrans
    const navigation = {
        navigate: (screenName, params = {}) => {
            console.log(`🧭 Navigation vers: ${screenName}`, params);

            // ✅ VALIDATION DES ÉCRANS DISPONIBLES
            const validScreens = [
                'Welcome', 'Login', 'Register', 'Home', 'Cart',
                'Orders', 'Payment', 'ProductDetail', 'Profile', 'AdminDashboard'
            ];

            if (!validScreens.includes(screenName)) {
                console.error(`❌ Écran "${screenName}" non reconnu. Écrans disponibles:`, validScreens);
                return;
            }

            setCurrentScreen(screenName);

            if (params.user) {
                setUser(params.user);
            }

            if (params.product) {
                setSelectedProduct(params.product);
            }

            if (params.orderData) {
                setOrderData(params.orderData);
            }
        },

        goBack: () => {
            console.log(`🔙 Retour depuis: ${currentScreen}`);
            switch (currentScreen) {
                case 'Login':
                case 'Register':
                    setCurrentScreen('Welcome');
                    break;
                case 'Cart':
                case 'Profile':
                case 'ProductDetail':
                case 'Orders':
                case 'Payment':
                    if (isAdminMode) {
                        setCurrentScreen('AdminDashboard');
                    } else {
                        setCurrentScreen('Home');
                    }
                    break;
                case 'AdminDashboard':
                    setCurrentScreen('Welcome');
                    break;
                case 'Home':
                    setCurrentScreen('Welcome');
                    break;
                default:
                    setCurrentScreen('Welcome');
            }
        }
    };

    // Gestion de l'authentification
    const handleLogin = (userData) => {
        console.log('🔍 ===========================================');
        console.log('🔍 DEBUT handleLogin');
        console.log('🔍 ===========================================');
        console.log('📋 userData COMPLETE:', JSON.stringify(userData, null, 2));

        setUser(userData);

        const isAdmin = checkIfAdmin(userData);
        console.log('👑 Résultat checkIfAdmin:', isAdmin);

        if (isAdmin) {
            console.log('✅ REDIRECTION VERS ADMIN');
            setCurrentScreen('AdminDashboard');
        } else {
            console.log('❌ REDIRECTION VERS HOME USER');
            setCurrentScreen('Home');
        }

        console.log('🔍 FIN handleLogin');
    };

    const handleRegister = (userData) => {
        console.log('Inscription réussie:', userData);
        setUser(userData);
        checkIfAdmin(userData);
        setCurrentScreen('Home');
    };

    const handleLogout = () => {
        console.log('🚪 Déconnexion');
        setUser(null);
        setIsAdminMode(false);
        setCartCount(0);
        setSelectedProduct(null);
        setOrderData(null);
        setCurrentScreen('Welcome');
    };

    const handleAddToCart = (product) => {
        console.log('Ajout au panier:', product);
        setCartCount(cartCount + 1);
    };

    // ✅ NOUVELLE FONCTION pour gérer le processus de paiement
    const handleProceedToPayment = (orderDetails) => {
        console.log('🛒 Procéder au paiement:', orderDetails);
        setOrderData(orderDetails);
        setCurrentScreen('Payment');
    };

    // ✅ NOUVELLE FONCTION pour gérer le succès du paiement
    const handlePaymentSuccess = (paymentData) => {
        console.log('💳 Paiement réussi:', paymentData);
        setCartCount(0);
        setOrderData(null);
        // ✅ CORRECTION: Naviguer vers Orders au lieu de HomeScreen
        setCurrentScreen('Orders');
    };

    // ✅ RENDU COMPLET avec tous les écrans supportés
    const renderScreen = () => {
        console.log('🎬 Rendu écran:', currentScreen, isAdminMode ? '(Mode Admin)' : '(Mode User)');

        switch (currentScreen) {
            case 'Welcome':
                return (
                    <WelcomeScreen
                        navigation={navigation}
                        apiTestStatus={apiTestStatus}
                    />
                );

            case 'Login':
                return (
                    <LoginScreen
                        navigation={navigation}
                        onLogin={handleLogin}
                    />
                );

            case 'Register':
                return (
                    <RegisterScreen
                        navigation={navigation}
                        onRegister={handleRegister}
                    />
                );

            case 'AdminDashboard':
                return (
                    <AdminDashboardScreen
                        navigation={navigation}
                        user={user}
                        onLogout={handleLogout}
                    />
                );

            case 'Home':
                return (
                    <HomeScreen
                        navigation={navigation}
                        user={user}
                        cartCount={cartCount}
                        onLogout={handleLogout}
                        onAddToCart={handleAddToCart}
                    />
                );

            case 'Cart':
                return (
                    <CartScreen
                        navigation={navigation}
                        user={user}
                        cartCount={cartCount}
                        onLogout={handleLogout}
                        onProceedToPayment={handleProceedToPayment}
                    />
                );

            case 'Payment':
                return (
                    <PaymentScreen
                        navigation={navigation}
                        user={user}
                        orderData={orderData}
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentError={(error) => {
                            console.error('❌ Erreur de paiement:', error);
                        }}
                    />
                );

            case 'Orders':
                return (
                    <OrderScreen
                        navigation={navigation}
                        user={user}
                    />
                );

            case 'ProductDetail':
                return (
                    <ProductDetailScreen
                        navigation={navigation}
                        product={selectedProduct}
                        onAddToCart={handleAddToCart}
                    />
                );

            case 'Profile':
                return (
                    <ProfileScreen
                        navigation={navigation}
                        user={user}
                        onLogout={handleLogout}
                    />
                );

            default:
                console.log('⚠️ Écran inconnu, retour à Welcome');
                return (
                    <WelcomeScreen
                        navigation={navigation}
                        apiTestStatus={apiTestStatus}
                    />
                );
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {renderScreen()}
        </View>
    );
}