import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { userService } from '../services/userService';

const RegisterScreen = ({ navigation, onRegister }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const updateField = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = () => {
        const { firstName, lastName, email, phone, password, confirmPassword } = formData;

        if (!firstName.trim()) {
            Alert.alert('Erreur', 'Le prénom est requis');
            return false;
        }

        if (!lastName.trim()) {
            Alert.alert('Erreur', 'Le nom est requis');
            return false;
        }

        if (!email.trim()) {
            Alert.alert('Erreur', "L'email est requis");
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Alert.alert('Erreur', 'Format email invalide');
            return false;
        }

        if (!phone.trim()) {
            Alert.alert('Erreur', 'Le téléphone est requis');
            return false;
        }

        if (password.length < 6) {
            Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
            return false;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            console.log('📝 Tentative d\'inscription:', formData.email);

            const registrationData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                password: formData.password,
            };

            const userData = await userService.register(registrationData);

            console.log('✅ Inscription réussie:', userData);

            Alert.alert(
                '🎉 Inscription réussie !',
                `Bienvenue ${userData.fullName} !\nVotre compte a été créé avec succès.`,
                [
                    {
                        text: 'Continuer',
                        onPress: () => {
                            onRegister(userData);
                        }
                    }
                ]
            );

        } catch (error) {
            console.error('❌ Erreur d\'inscription:', error.message);

            let errorMessage = error.message;
            if (errorMessage.includes('email already exists')) {
                errorMessage = 'Cet email est déjà utilisé. Veuillez en choisir un autre.';
            } else if (errorMessage.includes('phone already exists')) {
                errorMessage = 'Ce numéro de téléphone est déjà utilisé.';
            }

            Alert.alert(
                '❌ Erreur d\'inscription',
                errorMessage,
                [{ text: 'Réessayer' }]
            );
        } finally {
            setLoading(false);
        }
    };

    const fillTestData = () => {
        const timestamp = Date.now().toString().slice(-4);
        setFormData({
            firstName: 'Test',
            lastName: 'User',
            email: `test${timestamp}@example.com`,
            phone: `+22170${timestamp}`,
            password: '123456',
            confirmPassword: '123456',
        });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <Text style={styles.title}>📝 Inscription</Text>
                    <Text style={styles.subtitle}>Créer votre compte AKlebalma</Text>

                    <View style={styles.form}>
                        <Text style={styles.label}>👤 Prénom :</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.firstName}
                            onChangeText={(value) => updateField('firstName', value)}
                            placeholder="Votre prénom"
                            autoCapitalize="words"
                            editable={!loading}
                        />

                        <Text style={styles.label}>👤 Nom :</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.lastName}
                            onChangeText={(value) => updateField('lastName', value)}
                            placeholder="Votre nom"
                            autoCapitalize="words"
                            editable={!loading}
                        />

                        <Text style={styles.label}>📧 Email :</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.email}
                            onChangeText={(value) => updateField('email', value)}
                            placeholder="votre@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!loading}
                        />

                        <Text style={styles.label}>📞 Téléphone :</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.phone}
                            onChangeText={(value) => updateField('phone', value)}
                            placeholder="+221 70 123 45 67"
                            keyboardType="phone-pad"
                            editable={!loading}
                        />

                        <Text style={styles.label}>🔒 Mot de passe :</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={formData.password}
                                onChangeText={(value) => updateField('password', value)}
                                placeholder="Au moins 6 caractères"
                                secureTextEntry={!showPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>🔒 Confirmer le mot de passe :</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={formData.confirmPassword}
                                onChangeText={(value) => updateField('confirmPassword', value)}
                                placeholder="Répétez le mot de passe"
                                secureTextEntry={!showConfirmPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text style={styles.buttonText}>
                                    🚀 Créer mon compte
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.buttonSecondary, loading && styles.buttonDisabled]}
                            onPress={fillTestData}
                            disabled={loading}
                        >
                            <Text style={styles.buttonSecondaryText}>
                                🧪 Remplir données de test
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.linkButton}
                            onPress={() => navigation.navigate('Login')}
                            disabled={loading}
                        >
                            <Text style={styles.linkText}>
                                Déjà un compte ? Se connecter
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.linkButton}
                            onPress={() => navigation.goBack()}
                            disabled={loading}
                        >
                            <Text style={styles.linkText}>
                                ← Retour
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>🎁 Avantages AKlebalma :</Text>
                        <Text style={styles.infoText}>• Crédit jusqu'à 1 000 000 FCFA</Text>
                        <Text style={styles.infoText}>• Paiement échelonné</Text>
                        <Text style={styles.infoText}>• Produits de qualité</Text>
                        <Text style={styles.infoText}>• Livraison gratuite</Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
    },
    form: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#fff',
        minHeight: 50,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 15,
        minHeight: 50,
    },
    passwordInput: {
        flex: 1,
        padding: 15,
        fontSize: 16,
    },
    eyeButton: {
        padding: 15,
    },
    eyeIcon: {
        fontSize: 18,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
        minHeight: 50,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonSecondary: {
        backgroundColor: '#FF9500',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
        minHeight: 45,
    },
    buttonSecondaryText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkButton: {
        alignItems: 'center',
        marginTop: 10,
        padding: 10,
    },
    linkText: {
        color: '#007AFF',
        fontSize: 16,
    },
    infoBox: {
        backgroundColor: '#e8f5e8',
        padding: 15,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#34C759',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
});

export default RegisterScreen;