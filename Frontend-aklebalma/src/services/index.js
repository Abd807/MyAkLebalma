// Export centralisé des services
export { apiClient } from './apiClient';
export { userService } from './userService';
export { productService } from './productService';

// Export des utilitaires
export { 
  formatPrice, 
  formatCreditInfo, 
  formatFullName, 
  formatPhoneNumber 
} from '../utils/formatters';

// Configuration API
export { API_CONFIG } from '../config/apiConfig';
