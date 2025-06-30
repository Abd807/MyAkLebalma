# 🛍️ AKlebalma Mobile App

Application mobile React Native pour la plateforme de crédit AKlebalma.

## 📱 Description

AKlebalma est une application de crédit permettant aux utilisateurs d'acheter des produits et de les payer de manière échelonnée. L'application offre une expérience utilisateur moderne et intuitive pour gérer les achats à crédit.

## ✨ Fonctionnalités

- 🔐 **Authentification sécurisée**
    - Inscription avec email et mot de passe
    - Connexion utilisateur
    - Validation des formulaires

- 👤 **Gestion du profil**
    - Informations personnelles
    - Historique des transactions
    - Limite de crédit

- 🛒 **Système de crédit**
    - Crédit jusqu'à 1 000 000 FCFA
    - Paiement échelonné
    - Suivi des remboursements

- 📱 **Interface utilisateur**
    - Design moderne et responsive
    - Navigation intuitive
    - Feedback utilisateur en temps réel

## 🛠️ Technologies utilisées

- **Frontend:** React Native + Expo
- **Navigation:** React Navigation
- **Stockage:** AsyncStorage
- **API:** Axios pour les appels HTTP
- **UI:** Composants natifs stylisés

## 📦 Installation

### Prérequis
- Node.js (v16 ou plus récent)
- npm ou yarn
- Expo CLI : `npm install -g @expo/cli`
- Un téléphone avec l'app Expo Go ou un émulateur

### Installation des dépendances
```bash
# Cloner le projet
git clone https://github.com/VOTRE-USERNAME/frontend-aklebalma.git
cd frontend-aklebalma

# Installer les dépendances
npm install
```

### Configuration
1. Copiez le fichier `.env.example` vers `.env`
2. Configurez les variables d'environnement nécessaires

## 🚀 Lancement de l'application

```bash
# Démarrer le serveur de développement
expo start

# Ou spécifiquement pour Android
expo start --android

# Ou pour iOS
expo start --ios
```

## 📱 Test de l'application

### Compte de test
- **Email:** test@example.com
- **Mot de passe:** 123456

### Fonctionnalités testées
- ✅ Inscription d'un nouvel utilisateur
- ✅ Connexion avec un compte existant
- ✅ Navigation entre les écrans
- ✅ Validation des formulaires
- ✅ Gestion des erreurs

## 🏗️ Structure du projet

```
src/
├── components/          # Composants réutilisables
├── screens/            # Écrans de l'application
│   ├── WelcomeScreen.js
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   └── HomeScreen.js
├── services/           # Services API
│   └── userService.js
└── config/            # Configuration
    └── firebase.js
```

## 🔧 Configuration du backend

L'application fonctionne actuellement en mode mock pour les démonstrations.
Pour connecter un vrai backend :

1. Modifiez `MOCK_MODE = false` dans `src/services/userService.js`
2. Configurez l'URL de votre API dans `BASE_URL`
3. Assurez-vous que votre backend expose les endpoints :
    - `POST /api/users/login`
    - `POST /api/users/register`
    - `GET /api/users/test`

## 🚧 Fonctionnalités à venir

- [ ] 🔍 Authentification Google (Firebase)
- [ ] 🛒 Catalogue de produits
- [ ] 💳 Système de paiement
- [ ] 📊 Tableau de bord financier
- [ ] 🔔 Notifications push
- [ ] 📍 Géolocalisation et livraison

## 🐛 Problèmes connus

- L'authentification Google est temporairement désactivée (en cours de configuration)
- Le mode mock est activé par défaut pour les démonstrations

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est privé et propriétaire. Tous droits réservés.

## 📞 Contact

- **Développeur:** Votre Nom
- **Email:** votre.email@example.com
- **Projet:** AKlebalma Mobile App

## 🙏 Remerciements

- React Native community
- Expo team
- Contributors and testers

---

**Version actuelle:** 1.0.0 (Stable - Prêt pour présentation)  
**Dernière mise à jour:** Décembre 2024git