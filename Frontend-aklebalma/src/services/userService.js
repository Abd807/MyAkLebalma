import { apiClient } from './apiClient';

export const userService = {
  // Inscription utilisateur
  async register(userData) {
    try {
      console.log('👤 Registering user:', userData.email);
      const response = await apiClient.post('/users/register', userData);
      console.log('✅ User registered successfully');
      return response;
    } catch (error) {
      console.error('❌ Registration failed:', error.message);
      throw new Error(`Erreur inscription: ${error.message}`);
    }
  },

  // Connexion utilisateur (endpoint validé ✅)
  async login(credentials) {
    try {
      console.log('🔐 Logging in user:', credentials.email);
      const response = await apiClient.post('/users/login', credentials);
      console.log('✅ Login successful for:', response.fullName);
      return response;
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      throw new Error(`Erreur connexion: ${error.message}`);
    }
  },

  // Profil utilisateur
  async getProfile(userId) {
    try {
      console.log('📄 Getting profile for user:', userId);
      const response = await apiClient.get(`/users/${userId}`);
      console.log('✅ Profile loaded for:', response.fullName);
      return response;
    } catch (error) {
      console.error('❌ Failed to load profile:', error.message);
      throw new Error(`Erreur chargement profil: ${error.message}`);
    }
  },

  // Informations de crédit (endpoint validé ✅)
  async getCreditInfo(userId) {
    try {
      console.log('💳 Getting credit info for user:', userId);
      const response = await apiClient.get(`/users/${userId}/credit-info`);
      console.log('✅ Credit info loaded:', {
        available: response.availableCredit,
        total: response.purchasingPower
      });
      return response;
    } catch (error) {
      console.error('❌ Failed to load credit info:', error.message);
      throw new Error(`Erreur chargement crédit: ${error.message}`);
    }
  },

  // Mettre à jour le profil
  async updateProfile(userId, updateData) {
    try {
      console.log('✏️ Updating profile for user:', userId);
      const response = await apiClient.put(`/users/${userId}`, updateData);
      console.log('✅ Profile updated successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to update profile:', error.message);
      throw new Error(`Erreur mise à jour profil: ${error.message}`);
    }
  },

  // Liste des utilisateurs (admin)
  async getAllUsers() {
    try {
      console.log('📋 Getting all users');
      const response = await apiClient.get('/users');
      console.log(`✅ Loaded ${response.length} users`);
      return response;
    } catch (error) {
      console.error('❌ Failed to load users:', error.message);
      throw new Error(`Erreur chargement utilisateurs: ${error.message}`);
    }
  }
};
