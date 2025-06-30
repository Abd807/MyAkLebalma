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

const LoginScreen = ({ navigation, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { email, password } = formData;

    if (!email.trim()) {
      Alert.alert('Erreur', "L'email est requis");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Erreur', 'Format email invalide');
      return false;
    }

    if (!password) {
      Alert.alert('Erreur', 'Le mot de passe est requis');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log('🔐 Tentative de connexion:', formData.email);

      const loginData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const userData = await userService.login(loginData);
      console.log('✅ Connexion réussie:', userData);

      Alert.alert(
          '🎉 Connexion réussie !',
          `Bienvenue ${userData.fullName} !`,
          [
            {
              text: 'Continuer',
              onPress: () => {
                onLogin(userData);
              }
            }
          ]
      );

    } catch (error) {
      console.error('❌ Erreur de connexion:', error.message);

      let errorMessage = error.message;
      if (errorMessage.includes('Invalid credentials')) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (errorMessage.includes('User not found')) {
        errorMessage = 'Aucun compte trouvé avec cet email';
      }

      Alert.alert(
          '❌ Erreur de connexion',
          errorMessage,
          [{ text: 'Réessayer' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const fillTestData = () => {
    setFormData({
      email: 'test@example.com',
      password: '123456',
    });
  };

  return (
      <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>🔐 Connexion</Text>
            <Text style={styles.subtitle}>Accédez à votre compte AKlebalma</Text>

            <View style={styles.form}>
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

              <Text style={styles.label}>🔒 Mot de passe :</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    value={formData.password}
                    onChangeText={(value) => updateField('password', value)}
                    placeholder="Votre mot de passe"
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

              <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
              >
                {loading ? (
                    <ActivityIndicator color="white" size="small" />
                ) : (
                    <Text style={styles.buttonText}>
                      🚀 Se connecter
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
                  onPress={() => navigation.navigate('Register')}
                  disabled={loading}
              >
                <Text style={styles.linkText}>
                  Pas de compte ? S'inscrire
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
              <Text style={styles.infoTitle}>💡 Compte de test :</Text>
              <Text style={styles.infoText}>📧 Email : test@example.com</Text>
              <Text style={styles.infoText}>🔒 Mot de passe : 123456</Text>
              <Text style={styles.infoText}>Ou créez votre propre compte !</Text>
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

export default LoginScreen;