import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Animated,
    Dimensions,
    Image
} from 'react-native';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));
    const [logoScale] = useState(new Animated.Value(0.8));
    const [buttonAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        // Animation d'entrée fluide
        Animated.sequence([
            // Logo apparaît en premier
            Animated.timing(logoScale, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            // Puis le contenu
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
            // Enfin les boutons
            Animated.timing(buttonAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleGetStarted = () => {
        navigation.navigate('Register');
    };

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
            <SafeAreaView style={styles.safeArea}>

                {/* Hero Section */}
                <View style={styles.heroSection}>

                    {/* Logo animé */}
                    <Animated.View
                        style={[
                            styles.logoContainer,
                            { transform: [{ scale: logoScale }] }
                        ]}
                    >
                        <View style={styles.logoBackground}>
                            <Text style={styles.logoIcon}>🏠</Text>
                        </View>
                        <View style={styles.logoBadge}>
                            <Text style={styles.logoBadgeText}>NOUVEAU</Text>
                        </View>
                    </Animated.View>

                    {/* Contenu principal */}
                    <Animated.View
                        style={[
                            styles.contentContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <Text style={styles.appName}>AK LEBALMA</Text>
                        <Text style={styles.tagline}>
                            Votre électroménager{'\n'}en crédit simple et rapide
                        </Text>

                        {/* Illustration centrale */}
                        <View style={styles.illustrationContainer}>
                            <View style={styles.illustrationCard}>
                                <Text style={styles.illustrationIcon}>📱</Text>
                                <Text style={styles.illustrationText}>Commande</Text>
                            </View>
                            <View style={styles.illustrationArrow}>
                                <Text style={styles.arrowText}>→</Text>
                            </View>
                            <View style={styles.illustrationCard}>
                                <Text style={styles.illustrationIcon}>💳</Text>
                                <Text style={styles.illustrationText}>Paiement 3x</Text>
                            </View>
                            <View style={styles.illustrationArrow}>
                                <Text style={styles.arrowText}>→</Text>
                            </View>
                            <View style={styles.illustrationCard}>
                                <Text style={styles.illustrationIcon}>🚚</Text>
                                <Text style={styles.illustrationText}>Livraison</Text>
                            </View>
                        </View>

                        {/* Bénéfices clés */}
                        <View style={styles.benefitsContainer}>
                            <View style={styles.benefitItem}>
                                <Text style={styles.benefitIcon}>⚡</Text>
                                <Text style={styles.benefitText}>Approbation en 30s</Text>
                            </View>
                            <View style={styles.benefitItem}>
                                <Text style={styles.benefitIcon}>🔒</Text>
                                <Text style={styles.benefitText}>100% sécurisé</Text>
                            </View>
                            <View style={styles.benefitItem}>
                                <Text style={styles.benefitIcon}>🎯</Text>
                                <Text style={styles.benefitText}>Sans frais cachés</Text>
                            </View>
                        </View>
                    </Animated.View>
                </View>

                {/* Bottom Section avec boutons */}
                <Animated.View
                    style={[
                        styles.bottomSection,
                        { opacity: buttonAnim }
                    ]}
                >
                    {/* Stats rapides */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>+15K</Text>
                            <Text style={styles.statLabel}>Clients satisfaits</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>4.9★</Text>
                            <Text style={styles.statLabel}>Note moyenne</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>2M</Text>
                            <Text style={styles.statLabel}>FCFA max</Text>
                        </View>
                    </View>

                    {/* Call to Action */}
                    <View style={styles.ctaContainer}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={handleGetStarted}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.primaryButtonText}>🚀 Commencer maintenant</Text>
                            <Text style={styles.buttonSubtext}>Gratuit • Sans engagement</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={handleLogin}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.secondaryButtonText}>J'ai déjà un compte</Text>
                        </TouchableOpacity>

                        {/* Garantie */}
                        <View style={styles.guaranteeContainer}>
                            <Text style={styles.guaranteeText}>
                                ✅ Inscription en 2 minutes • ✅ Données protégées
                            </Text>
                        </View>
                    </View>
                </Animated.View>

            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    // HERO SECTION
    heroSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingTop: 40,
    },

    // LOGO
    logoContainer: {
        position: 'relative',
        marginBottom: 40,
        alignItems: 'center',
    },
    logoBackground: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    logoIcon: {
        fontSize: 50,
        color: '#ffffff',
    },
    logoBadge: {
        position: 'absolute',
        top: -5,
        right: -15,
        backgroundColor: '#ef4444',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        transform: [{ rotate: '15deg' }],
    },
    logoBadgeText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 'bold',
    },

    // CONTENU PRINCIPAL
    contentContainer: {
        alignItems: 'center',
        width: '100%',
    },
    appName: {
        fontSize: 36,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    tagline: {
        fontSize: 20,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 28,
        marginBottom: 40,
        fontWeight: '500',
    },

    // ILLUSTRATION
    illustrationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        paddingHorizontal: 10,
    },
    illustrationCard: {
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        minWidth: 70,
    },
    illustrationIcon: {
        fontSize: 24,
        marginBottom: 6,
    },
    illustrationText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
        textAlign: 'center',
    },
    illustrationArrow: {
        marginHorizontal: 8,
    },
    arrowText: {
        fontSize: 18,
        color: '#3b82f6',
        fontWeight: 'bold',
    },

    // BÉNÉFICES
    benefitsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    benefitItem: {
        alignItems: 'center',
        flex: 1,
    },
    benefitIcon: {
        fontSize: 20,
        marginBottom: 6,
    },
    benefitText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
        textAlign: 'center',
    },

    // BOTTOM SECTION
    bottomSection: {
        paddingHorizontal: 30,
        paddingBottom: 30,
    },

    // STATS
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 16,
        padding: 20,
        marginBottom: 30,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 11,
        color: '#64748b',
        fontWeight: '500',
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#d1d5db',
        marginHorizontal: 15,
    },

    // CTA
    ctaContainer: {
        width: '100%',
    },
    primaryButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 30,
        marginBottom: 16,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 2,
    },
    buttonSubtext: {
        color: '#dbeafe',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
    },
    secondaryButton: {
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 30,
        marginBottom: 20,
        backgroundColor: '#ffffff',
    },
    secondaryButtonText: {
        color: '#64748b',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },

    // GARANTIE
    guaranteeContainer: {
        alignItems: 'center',
    },
    guaranteeText: {
        fontSize: 12,
        color: '#16a34a',
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: 16,
    },
});

export default WelcomeScreen;