# 📖 Guide du Développeur - PASCI Mobile

Guide complet pour mettre à jour le code et démarrer l'application mobile PASCI.

---

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Lancer l'application](#lancer-lapplication)
4. [Structure du projet](#structure-du-projet)
5. [Commandes principales](#commandes-principales)
6. [Configuration de l'API](#configuration-de-lapi)
7. [Conventions de code](#conventions-de-code)
8. [Dépannage](#dépannage)
9. [Processus de contribution](#processus-de-contribution)

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé les outils suivants :

### Outils obligatoires

- **[Node.js](https://nodejs.org/)** version 16 ou supérieure (LTS recommandée)
  - Vérifiez : `node --version`
- **[npm](https://www.npmjs.com/)** (inclus avec Node.js)
  - Vérifiez : `npm --version`
- **Git** pour le contrôle de version

### Applications mobiles

Pour tester sur un appareil mobile réel :

- **[Expo Go](https://expo.dev/tools/easde)** sur votre téléphone :
  - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)

### Outils optionnels (pour les émulateurs)

- **Android Studio** : Pour l'émulateur Android
- **Xcode** : Pour le simulateur iOS (macOS uniquement)

---

## 🚀 Installation

### Étape 1 : Cloner le repository

```bash
git clone https://github.com/ordemdigitale/pasci-mobile-Idrys.git
cd pasci-mobile-Idrys
```

### Étape 2 : Installer les dépendances

```bash
npm install
```

Cette commande installe tous les packages requis listés dans `package.json`.

### Étape 3 : Vérifier l'installation

```bash
npm start
```

Vous devriez voir un QR code dans le terminal et les options suivantes :
- `a` : Lancer sur un appareil Android
- `i` : Lancer sur un simulateur iOS
- `w` : Lancer sur le navigateur web
- `r` : Redémarrer le serveur
- `q` : Quitter

Appuyez sur `q` pour quitter pour l'instant (c'est juste une vérification).

---

## 📱 Lancer l'application

### Option 1 : Sur un appareil physique (Recommandé)

1. **Démarrez le serveur de développement** :
   ```bash
   npm start
   ```

2. **Scannez le QR code** :
   - **Android** : Utilisez l'application Expo Go → Appuyez sur "Scan QR code"
   - **iOS** : Utilisez l'appareil photo native → Appuyez sur le lien qui s'affiche

3. L'application se charge automatiquement sur votre téléphone

### Option 2 : Sur un émulateur Android

**Prérequis** : Android Studio doit être installé avec un émulateur créé.

```bash
npm run android
```

### Option 3 : Sur un simulateur iOS (macOS uniquement)

**Prérequis** : Xcode doit être installé sur macOS.

```bash
npm run ios
```

### Option 4 : Sur le navigateur web

```bash
npm run web
```

L'application s'ouvrira sur `localhost:19006`

---

## 📂 Structure du projet

```
pasci-mobile-Idrys/
├── app/                          # Pages et structure de routage
│   ├── (tabs)/                   # Pages principales avec navigation par onglets
│   │   ├── index.tsx             # Accueil
│   │   ├── annuaire.tsx          # Annuaire (CRASC + Partenaires)
│   │   ├── espace-collab.tsx     # Espace de collaboration (Pôles + Offres)
│   │   └── profil.tsx            # Profil utilisateur
│   ├── services.tsx              # Services PDOC + FAQ
│   ├── contact.tsx               # Page "Nous Contacter"
│   ├── crasc-details/[id].tsx    # Détails d'un CRASC + OSC membres
│   ├── osc-details/[id].tsx      # Détails d'une OSC
│   ├── job-details/[id].tsx      # Détails d'une offre d'emploi
│   ├── pole-details/[id].tsx     # Détails d'un pôle de concertation
│   └── login.tsx                 # Page de connexion
│
├── components/                    # Composants réutilisables
│   ├── ui/                        # Composants UI basiques
│   │   └── Skeleton.tsx           # Composant de chargement
│   ├── DirectoryModal.tsx         # Modal pour l'annuaire des CRASC
│   └── [autres composants]
│
├── services/                      # Services et logique métier
│   ├── dataService.ts            # Service pour les appels API
│   └── types.ts                  # Définitions TypeScript
│
├── constants/                     # Données et constantes
│   ├── crasc.ts                  # Données CRASC hardcodées
│   └── theme.ts                  # Configuration des couleurs
│
├── assets/                        # Images, icônes et polices
│   ├── logo.png
│   └── [autres ressources]
│
├── helpers/                       # Fonctions utilitaires
├── context/                       # Context React
├── package.json                   # Dépendances du projet
├── app.json                       # Configuration Expo
├── tailwind.config.js             # Configuration Tailwind CSS
└── tsconfig.json                  # Configuration TypeScript
```

### Dossiers clés à connaître

| Dossier | Contenu |
|---------|---------|
| `app/` | Toutes les pages et routes de l'application |
| `app/(tabs)/` | Pages avec navigation par onglets |
| `components/` | Composants réutilisables |
| `services/` | Appels API et logique métier |
| `constants/` | Données hardcodées, thème, constantes |
| `assets/` | Images, logos, polices |

---

## 🛠 Commandes principales

### Développement

```bash
# Démarrer le serveur
npm start

# Démarrer sur Android
npm run android

# Démarrer sur iOS
npm run ios

# Démarrer sur le web
npm run web
```

### Nettoyage et réinitialisation

```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules && npm install

# Réinitialiser le cache Expo
npx expo start --clear
```

### Vérification du code

```bash
# Vérifier les erreurs TypeScript
npx tsc --noEmit

# Linter ESLint
npx eslint .
```

---

## 🔧 Configuration de l'API

### URL de l'API

L'API est configurée dans le fichier `services/dataService.ts`.

Pour changer l'URL de l'API :

```typescript
// services/dataService.ts
const API_BASE_URL = 'http://votre-api.com/api'; // Modifiez cette URL
```

### Variables d'environnement (optionnel)

Si vous voulez utiliser un fichier `.env` :

1. Créez un fichier `.env` à la racine du projet
2. Ajoutez votre URL API :
   ```
   EXPO_PUBLIC_API_URL=http://votre-api.com/api
   ```

3. Accédez-la dans le code :
   ```typescript
   import Constants from 'expo-constants';
   const apiUrl = Constants.expoConfig?.extra?.apiUrl;
   ```

---

## 💻 Conventions de code

### TypeScript

- Utilisez des types explicites pour toutes les fonctions
- Créez des interfaces pour les structures de données complexes
- Exemples :

```typescript
// ✅ BON
interface CrascData {
  id: string;
  name: string;
  regions: string[];
  osc_count: number;
}

const getCrascDetails = (id: string): Promise<CrascData> => {
  // ...
};

// ❌ MAUVAIS
const getCrascDetails = (id) => {
  // ...
};
```

### React Native et NativeWind

- Utilisez NativeWind (Tailwind CSS) pour le styling
- Préférez les composants fonctionnels
- Utilisez les hooks (`useState`, `useQuery`, etc.)

```typescript
// ✅ BON
import { View, Text } from 'react-native';

export default function MyComponent() {
  const [state, setState] = useState(false);
  
  return (
    <View className="bg-white p-4 rounded-lg">
      <Text className="text-lg font-bold">Titre</Text>
    </View>
  );
}

// ❌ MAUVAIS
const MyComponent = () => {
  // Styles inline
  return (
    <View style={{ backgroundColor: 'white', padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Titre</Text>
    </View>
  );
};
```

### Nommage

```typescript
// Composants : PascalCase
MyComponent.tsx

// Fichiers/dossiers : kebab-case
my-feature.ts
my-folder/

// Variables et fonctions : camelCase
const myVariable = 'value';
const myFunction = () => {};

// Constantes : UPPER_SNAKE_CASE
const API_BASE_URL = 'http://...';
const MAX_ITEMS_PER_PAGE = 10;
```

### Commentaires

Gardez les commentaires simples et utiles :

```typescript
// ✅ BON
// Récupère les détails du CRASC et ses OSC membres
const data = await getCrascDetails(id);

// ❌ MAUVAIS - Évident
// Déclare la variable data
const data = await getCrascDetails(id);
```

---

## 🔍 Dépannage

### Le serveur ne démarre pas

```bash
# Essayez de réinitialiser le cache
npx expo start --clear

# Ou réinstallez les dépendances
rm -rf node_modules
npm install
npm start
```

### L'application ne charge pas sur le téléphone

1. **Vérifiez la connexion réseau** : Le téléphone et l'ordinateur doivent être sur le même réseau WiFi
2. **Scannez à nouveau le QR code**
3. **Redémarrez le serveur** : `npm start`
4. **Réinstallez Expo Go** sur votre téléphone

### Les changements de code ne s'appliquent pas

1. **Appuyez sur `r` dans le terminal** pour redémarrer l'application
2. **Scannez le QR code à nouveau**
3. **Réinitialiser le cache** : `npx expo start --clear`

### Erreur : "Module not found"

```bash
# Réinstallez les dépendances
npm install

# Ou à partir de zéro
rm -rf node_modules package-lock.json
npm install
```

### Erreur TypeScript à la compilation

```bash
# Vérifiez les erreurs
npx tsc --noEmit

# Vérifiez le fichier tsconfig.json
```

### L'API ne répond pas

1. Vérifiez que l'URL API est correcte dans `services/dataService.ts`
2. Vérifiez que le serveur API est en cours d'exécution
3. Vérifiez la connexion réseau
4. Ouvrez les outils de débogage : Appuyez sur `d` quand l'app est lancée

---

## 🤝 Processus de contribution

### 1. Créer une branche

Utilisez une branche spécifique pour chaque fonctionnalité :

```bash
# Mettez à jour main
git checkout main
git pull origin main

# Créez une nouvelle branche
git checkout -b feature/nom-de-la-feature

# Exemples
git checkout -b feature/add-login
git checkout -b fix/crasc-pagination
git checkout -b docs/update-readme
```

### 2. Faire vos changements

- Modifiez le code selon vos besoins
- Testez sur un appareil réel si possible
- Assurez-vous que TypeScript compile sans erreurs

### 3. Committer vos changements

```bash
# Vérifiez les fichiers modifiés
git status

# Ajoutez les fichiers
git add .

# Créez un commit avec un message clair
git commit -m "feat: ajouter la page de connexion"
git commit -m "fix: corriger la pagination du CRASC"
git commit -m "docs: mettre à jour le guide du développeur"

# Conventions pour les messages
# feat: nouvelle fonctionnalité
# fix: correction de bug
# docs: documentation
# style: formatage
# refactor: restructuration sans changement fonctionnel
# test: ajout de tests
```

### 4. Pousser votre branche

```bash
git push origin feature/nom-de-la-feature
```

### 5. Créer une Pull Request

Sur GitHub, créez une PR en décrivant :
- Ce que vous avez changé
- Pourquoi vous l'avez changé
- Comment tester les changements

---

## 📱 Pages principales à connaître

| Page | Fichier | Utilité |
|------|---------|---------|
| Accueil | `app/(tabs)/index.tsx` | Page principale avec CRASC en carousel |
| Annuaire | `app/(tabs)/annuaire.tsx` | Liste CRASC et partenaires |
| Espace Collab | `app/(tabs)/espace-collab.tsx` | Pôles de concertation et offres d'emploi |
| Profil | `app/(tabs)/profil.tsx` | Profil utilisateur |
| Services | `app/services.tsx` | Services PDOC avec FAQ |
| Détails CRASC | `app/crasc-details/[id].tsx` | Détails d'un CRASC avec OSC membres |
| Contact | `app/contact.tsx` | Formulaire de contact |

---

## 🎨 Design et Styling

### Utiliser NativeWind (Tailwind CSS)

```typescript
import { View, Text } from 'react-native';

<View className="bg-white rounded-2xl p-4 shadow-sm">
  <Text className="text-lg font-bold text-gray-900">Titre</Text>
  <Text className="text-gray-600 text-sm">Description</Text>
</View>
```

### Couleurs de marque

Les couleurs principales sont définies dans `tailwind.config.js` :

```typescript
colors: {
  'brand-orange': '#E05017',
  'gray-900': '#1F2937',
  'gray-100': '#F3F4F6',
  // ... autres couleurs
}
```

Utilisez `className="text-brand-orange"` pour les couleurs de marque.

---

## 📚 Ressources utiles

- **[Expo Documentation](https://docs.expo.dev/)**
- **[React Native Docs](https://reactnative.dev/)**
- **[Expo Router (Routing)](https://docs.expo.dev/router/introduction/)**
- **[NativeWind (Styling)](https://www.nativewind.dev/)**
- **[React Query](https://tanstack.com/query/latest)**
- **[Lucide Icons](https://lucide.dev/)**

---

## 💡 Astuces utiles

### Débogage

```typescript
// Dans votre composant React Native
import { useEffect } from 'react';

useEffect(() => {
  console.log('Mon variable:', maVariable);
}, [maVariable]);
```

Appuyez sur `d` quand l'app est lancée pour ouvrir les outils de débogage.

### Lecture de fichiers volumineux

Si un fichier `.tsx` est trop volumineux, divisez-le en composants réutilisables :

```typescript
// Extrayez des composants
export const MyCardComponent = ({ item }) => (
  <View>...</View>
);

// Réutilisez-les
<MyCardComponent item={item} />
```

### Cache React Query

Les données sont cachées par défaut. Pour forcer une actualisation :

```typescript
const { refetch } = useQuery({...});
// Plus tard...
refetch();
```

---

## ✅ Checklist avant de faire un commit

- [ ] Le code compile sans erreurs TypeScript
- [ ] Testé sur un appareil ou émulateur réel
- [ ] Les changements respectent les conventions du projet
- [ ] Les messages de commit sont clairs et descriptifs
- [ ] Pas de fichiers sensibles (`.env`, `node_modules`)
- [ ] `.gitignore` est mis à jour si nécessaire

---

## 🆘 Besoin d'aide ?

Si vous rencontrez un problème :

1. Vérifiez ce guide
2. Cherchez l'erreur dans la section [Dépannage](#dépannage)
3. Consultez les logs : `npm start` affiche les erreurs
4. Demandez à l'équipe

---

**Dernière mise à jour : 26 avril 2026**
