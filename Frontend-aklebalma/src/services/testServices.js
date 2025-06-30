// Fichier de test pour valider les services
import { userService, productService, formatPrice } from './index';

// Test de connexion
export const testLogin = async () => {
  try {
    console.log('🧪 Testing login...');
    const user = await userService.login({
      email: 'abdou@test.com',
      password: '123456'
    });
    console.log('✅ Login successful:', user.fullName);
    return user;
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
    throw error;
  }
};

// Test d'informations de crédit
export const testCreditInfo = async (userId = 1) => {
  try {
    console.log('🧪 Testing credit info...');
    const credit = await userService.getCreditInfo(userId);
    console.log('✅ Credit info loaded:', {
      available: formatPrice(credit.availableCredit),
      total: formatPrice(credit.purchasingPower)
    });
    return credit;
  } catch (error) {
    console.error('❌ Credit test failed:', error.message);
    throw error;
  }
};

// Test de chargement des produits
export const testProducts = async () => {
  try {
    console.log('🧪 Testing products...');
    const products = await productService.getAll();
    console.log(`✅ Products loaded: ${products.length} items`);
    products.forEach(product => {
      console.log(`- ${product.name}: ${formatPrice(product.price)}`);
    });
    return products;
  } catch (error) {
    console.error('❌ Products test failed:', error.message);
    throw error;
  }
};

// Test de recherche
export const testSearch = async (query = 'iPhone') => {
  try {
    console.log(`🧪 Testing search for "${query}"...`);
    const results = await productService.search(query);
    console.log(`✅ Search results: ${results.length} items found`);
    return results;
  } catch (error) {
    console.error('❌ Search test failed:', error.message);
    throw error;
  }
};

// Test complet
export const runAllTests = async () => {
  try {
    console.log('🚀 Running all API tests...');
    
    const user = await testLogin();
    const credit = await testCreditInfo(user.id);
    const products = await testProducts();
    const searchResults = await testSearch('iPhone');
    
    console.log('🎉 All tests passed!');
    return { user, credit, products, searchResults };
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    throw error;
  }
};
