import { apiClient } from './apiClient';

export const productService = {
  // Tous les produits (endpoint validé ✅)
  async getAll() {
    try {
      console.log('🛍️ Loading all products');
      const response = await apiClient.get('/products');
      console.log(`✅ Loaded ${response.length} products`);
      return response;
    } catch (error) {
      console.error('❌ Failed to load products:', error.message);
      throw new Error(`Erreur chargement produits: ${error.message}`);
    }
  },

  // Produit par ID
  async getById(productId) {
    try {
      console.log('🔍 Loading product:', productId);
      const response = await apiClient.get(`/products/${productId}`);
      console.log('✅ Product loaded:', response.name);
      return response;
    } catch (error) {
      console.error('❌ Failed to load product:', error.message);
      throw new Error(`Erreur chargement produit: ${error.message}`);
    }
  },

  // Produits par catégorie
  async getByCategory(categoryId) {
    try {
      console.log('📂 Loading products for category:', categoryId);
      const response = await apiClient.get(`/products/category/${categoryId}`);
      console.log(`✅ Loaded ${response.length} products for category ${categoryId}`);
      return response;
    } catch (error) {
      console.error('❌ Failed to load products by category:', error.message);
      throw new Error(`Erreur chargement catégorie: ${error.message}`);
    }
  },

  // Recherche de produits (endpoint validé ✅)
  async search(query) {
    try {
      console.log('🔎 Searching products:', query);
      const response = await apiClient.get('/products/search', { q: query });
      console.log(`✅ Found ${response.length} products for "${query}"`);
      return response;
    } catch (error) {
      console.error('❌ Search failed:', error.message);
      throw new Error(`Erreur recherche: ${error.message}`);
    }
  },

  // Produits disponibles
  async getAvailable() {
    try {
      console.log('✨ Loading available products');
      const response = await apiClient.get('/products/available');
      console.log(`✅ Loaded ${response.length} available products`);
      return response;
    } catch (error) {
      console.error('❌ Failed to load available products:', error.message);
      throw new Error(`Erreur chargement produits disponibles: ${error.message}`);
    }
  },

  // Vérifier le stock (endpoint validé ✅)
  async checkStock(productId, quantity) {
    try {
      console.log(`📦 Checking stock for product ${productId}, quantity: ${quantity}`);
      const response = await apiClient.get(`/products/${productId}/stock/${quantity}`);
      console.log('✅ Stock check completed:', {
        available: response.available,
        currentStock: response.currentStock
      });
      return response;
    } catch (error) {
      console.error('❌ Stock check failed:', error.message);
      throw new Error(`Erreur vérification stock: ${error.message}`);
    }
  },

  // Créer un produit (admin)
  async create(productData) {
    try {
      console.log('➕ Creating new product:', productData.name);
      const response = await apiClient.post('/products', productData);
      console.log('✅ Product created successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to create product:', error.message);
      throw new Error(`Erreur création produit: ${error.message}`);
    }
  },

  // Mettre à jour un produit (admin)
  async update(productId, productData) {
    try {
      console.log('✏️ Updating product:', productId);
      const response = await apiClient.put(`/products/${productId}`, productData);
      console.log('✅ Product updated successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to update product:', error.message);
      throw new Error(`Erreur mise à jour produit: ${error.message}`);
    }
  }
};
