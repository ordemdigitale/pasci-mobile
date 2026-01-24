# PASCI Mobile

Application mobile pour le projet PASCI, développée avec Expo et React Native.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé les outils suivants sur votre machine :

- [Node.js](https://nodejs.org/) (version LTS recommandée)
- [npm](https://www.npmjs.com/) (installé automatiquement avec Node.js)
- **Application Expo Go** :
  - [Android (Play Store)](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779)

Pour l'émulation sur ordinateur (optionnel) :
- Android Studio (pour l'émulateur Android)
- Xcode (pour le simulateur iOS - macOS uniquement)

## 🚀 Installation

1. **Cloner le projet**

   ```bash
   git clone https://github.com/ordemdigitale/pasci-mobile.git
   cd pasci-mobile
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

## 📱 Lancer l'application

Pour démarrer le serveur de développement :

```bash
npx expo start
```
ou
```bash
npm start
```

Une fois le serveur lancé, vous verrez un QR code dans le terminal.

- **Sur un appareil physique** : Scannez le QR code avec l'application **Expo Go** (Android) ou l'application Appareil photo (iOS).
- **Sur un émulateur** : Appuyez sur `a` pour lancer sur Android ou `i` pour lancer sur iOS (si configuré).

## 🛠 Technologies utilisées

- **Framework** : [Expo](https://expo.dev/) (React Native)
- **Routage** : [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling** : [NativeWind](https://www.nativewind.dev/) (Tailwind CSS pour React Native)
- **Langage** : TypeScript
- **Icônes** : Lucide React Native

## 📂 Structure du projet

- `app/` : Contient les pages et la structure de navigation (Expo Router).
- `components/` : Composants réutilisables (UI, cartes, etc.).
- `assets/` : Images, polices et icônes.
- `constants/` : Constantes globales et configuration du thème.

## 🤝 Contribution

1. Créez une nouvelle branche pour votre fonctionnalité (`git checkout -b feature/ma-feature`).
2. Committez vos changements (`git commit -m 'Ajout de ma feature'`).
3. Pushez vers la branche (`git push origin feature/ma-feature`).
4. Ouvrez une Pull Request.
