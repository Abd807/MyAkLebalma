// Configuration API
export const API_CONFIG = {
  // Remplacez par l'IP de votre machine si test sur device
  BASE_URL: 'http://192.168.113.174:8080/api',
  // Pour tester sur device physique : 'http://192.168.1.X:8080/api'
  
  TIMEOUT: 10000,
  
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};
