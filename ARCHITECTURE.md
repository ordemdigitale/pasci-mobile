# 🏗️ Architecture technique - PASCI Mobile

Guide sur l'architecture, les patterns et comment contribuer au projet.

---

## 📋 Table des matières

1. [Architecture générale](#architecture-générale)
2. [Flux de données](#flux-de-données)
3. [Patterns utilisés](#patterns-utilisés)
4. [Guide: Ajouter une nouvelle page](#guide-ajouter-une-nouvelle-page)
5. [Guide: Ajouter une nouvelle fonctionnalité](#guide-ajouter-une-nouvelle-fonctionnalité)
6. [Appels API](#appels-api)
7. [Gestion d'état](#gestion-détat)
8. [Navigation](#navigation)

---

## 🏗️ Architecture générale

### Layers (Couches)

```
┌─────────────────────────────────────┐
│       UI Layer (React Components)   │  ← Affichage
├─────────────────────────────────────┤
│    Business Logic (Services)        │  ← Logique métier
├─────────────────────────────────────┤
│      Data Layer (API + Cache)       │  ← Données
└─────────────────────────────────────┘
```

### Composants

```
App
│
├── Navigation (Expo Router)
│   ├── (tabs) [Pages avec onglets]
│   │   ├── Accueil
│   │   ├── Annuaire (CRASC + Partenaires)
│   │   ├── Espace Collab (Pôles + Offres)
│   │   └── Profil
│   │
│   └── Pages détail [Dynamiques]
│       ├── crasc-details/[id]
│       ├── osc-details/[id]
│       ├── job-details/[id]
│       └── pole-details/[id]
│
├── Services
│   └── dataService (API Calls)
│
└── Components (Réutilisables)
    ├── DirectoryModal
    ├── Skeleton
    └── [Autres]
```

---

## 📊 Flux de données

### Flux général

```
┌──────────────┐
│  Component   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│  React Query (useQuery)  │  ← Récupère les données
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│  dataService             │  ← Service API
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│  HTTP Request (Axios)    │  ← Appel API
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│  Backend API             │  ← Serveur
└──────────────────────────┘
```

### Exemple : Charger la liste des CRASC

```typescript
// 1. Component demande les données
const { data: crascs, isLoading } = useQuery({
  queryKey: ['crascs'],
  queryFn: dataService.getCrascs,  // ← Appelle le service
});

// 2. Service effectue l'appel API
const getCrascs = async () => {
  const response = await axios.get(`${API_BASE_URL}/crascs`);
  return response.data;
};

// 3. React Query met en cache les données
// 4. Component reçoit les données et les affiche
{crascs?.map(crasc => (
  <Text>{crasc.name}</Text>
))}
```

---

## 🎯 Patterns utilisés

### 1. React Hooks

```typescript
// useState - État local
const [expanded, setExpanded] = useState(false);

// useQuery - Récupérer des données (avec cache)
const { data, isLoading, error } = useQuery({
  queryKey: ['unique-key'],
  queryFn: fetchData,
});

// useRouter - Navigation
const router = useRouter();
router.push('/page');

// useEffect - Effets secondaires
useEffect(() => {
  // Code exécuté au montage ou lors de changements
}, [dependency]);
```

### 2. React Query (Gestion du cache)

**Avantages** :
- Cache automatique des données
- Rechargement facile
- Gestion du loading/error
- Background refetch

```typescript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['items', page],  // Clé unique
  queryFn: () => dataService.getItems(page),  // Fonction fetch
  enabled: true,  // Activé ou pas
  staleTime: 5 * 60 * 1000,  // 5 minutes avant refresh
});

// Rafraîchir manuellement
refetch();
```

### 3. Expo Router (Navigation)

**Structure des fichiers = Structure des routes** :

```
app/
├── (tabs)/
│   ├── index.tsx        → /
│   ├── annuaire.tsx     → /annuaire
│   └── profil.tsx       → /profil
│
└── crasc-details/
    └── [id].tsx         → /crasc-details/123
```

**Navigation** :

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Aller à une page
router.push('/annuaire');

// Aller avec paramètres
router.push(`/crasc-details/${id}`);

// Remplacer (sans ajouter à l'historique)
router.replace('/home');

// Retour
router.back();
```

### 4. NativeWind (Styling)

```typescript
// Tailwind CSS pour React Native
<View className="bg-white rounded-lg p-4 shadow-sm">
  <Text className="text-lg font-bold text-gray-900">
    Titre
  </Text>
  <Text className="text-gray-500 text-sm">
    Sous-titre
  </Text>
</View>

// Responsive
<View className="px-4 md:px-6 lg:px-8">
```

### 5. TypeScript

```typescript
// Définir des interfaces
interface Crasc {
  id: string;
  name: string;
  regions: string[];
  osc_count: number;
}

// Utiliser les types
const CrascCard = ({ crasc }: { crasc: Crasc }) => (
  <View>
    <Text>{crasc.name}</Text>
  </View>
);
```

---

## 📖 Guide: Ajouter une nouvelle page

### Exemple : Créer une page "À Propos"

#### Étape 1 : Créer le fichier

Créez `app/about.tsx` :

```typescript
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Stack } from 'expo-router';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={24} color="#E05017" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-lg text-gray-900">
          À Propos
        </Text>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-2xl text-gray-900 mb-4">
            À Propos de PDOC
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-sm leading-6">
            PDOC est une plateforme...
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
```

#### Étape 2 : Ajouter un lien vers la page

Dans une autre page (ex: `app/(tabs)/profil.tsx`) :

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

<TouchableOpacity onPress={() => router.push('/about')}>
  <Text>Voir l'à propos</Text>
</TouchableOpacity>
```

**C'est tout!** Expo Router détecte le fichier automatiquement.

---

## 🔧 Guide: Ajouter une nouvelle fonctionnalité

### Exemple : Ajouter un bouton "Favoris"

#### 1. Créer un hook personnalisé (optionnel)

Créez `hooks/useFavorites.ts` :

```typescript
import { useState, useCallback } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const addFavorite = useCallback((id: string) => {
    setFavorites(prev => [...prev, id]);
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(fav => fav !== id));
  }, []);

  const isFavorite = useCallback((id: string) => {
    return favorites.includes(id);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
};
```

#### 2. Utiliser le hook dans un composant

```typescript
import { Heart } from 'lucide-react-native';
import { useFavorites } from '../hooks/useFavorites';

export const CrascCard = ({ crasc }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const toggleFavorite = () => {
    if (isFavorite(crasc.id)) {
      removeFavorite(crasc.id);
    } else {
      addFavorite(crasc.id);
    }
  };

  return (
    <View className="p-4">
      <Text>{crasc.name}</Text>
      <TouchableOpacity onPress={toggleFavorite}>
        <Heart 
          size={24} 
          color={isFavorite(crasc.id) ? '#E05017' : '#9CA3AF'}
          fill={isFavorite(crasc.id) ? '#E05017' : 'none'}
        />
      </TouchableOpacity>
    </View>
  );
};
```

---

## 🌐 Appels API

### Structure du service API

Fichier : `services/dataService.ts`

```typescript
import axios from 'axios';
import { Crasc, Partner, Job } from './types';

const API_BASE_URL = 'https://api.pdoc.example.com/api';
const axiosInstance = axios.create({ baseURL: API_BASE_URL });

export const dataService = {
  // CRASC
  getCrascs: async (): Promise<Crasc[]> => {
    const response = await axiosInstance.get('/crascs');
    return response.data;
  },

  getCrascBySlug: async (slug: string): Promise<Crasc> => {
    const response = await axiosInstance.get(`/crascs/${slug}`);
    return response.data;
  },

  // Partenaires
  getPtfList: async (): Promise<Partner[]> => {
    const response = await axiosInstance.get('/partners');
    return response.data;
  },

  // Offres d'emploi
  getJobs: async (): Promise<Job[]> => {
    const response = await axiosInstance.get('/jobs');
    return response.data;
  },
};
```

### Ajouter un nouvel endpoint

```typescript
// 1. Ajouter le type dans services/types.ts
export interface Article {
  id: string;
  title: string;
  content: string;
}

// 2. Ajouter la méthode dans dataService.ts
getArticles: async (): Promise<Article[]> => {
  const response = await axiosInstance.get('/articles');
  return response.data;
},

// 3. Utiliser dans un composant
const { data: articles } = useQuery({
  queryKey: ['articles'],
  queryFn: dataService.getArticles,
});
```

### Gestion des erreurs

```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['items'],
  queryFn: dataService.getItems,
});

if (isLoading) return <Text>Chargement...</Text>;
if (error) return <Text>Erreur: {error.message}</Text>;

return <FlatList data={data} renderItem={renderItem} />;
```

---

## 🧠 Gestion d'état

### État local (useState)

```typescript
// Pour un seul composant
const [isExpanded, setIsExpanded] = useState(false);
```

### État global (Context API)

Pour un état partagé par plusieurs composants, créez un Context :

Fichier : `context/AuthContext.tsx`

```typescript
import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = (userData) => {
    setUser(userData);
    setToken(userData.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

Utilisez-le :

```typescript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <View>
      <Text>{user?.name}</Text>
      <TouchableOpacity onPress={logout}>
        <Text>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Données en cache (React Query)

```typescript
// Les données sont automatiquement en cache
const { data: items, refetch } = useQuery({
  queryKey: ['items'],
  queryFn: dataService.getItems,
  staleTime: 5 * 60 * 1000, // Frais pendant 5 minutes
});

// Rafraîchir manuellement
<TouchableOpacity onPress={() => refetch()}>
  <Text>Actualiser</Text>
</TouchableOpacity>
```

---

## 🧭 Navigation

### Structure de fichiers = Routes

```
app/
├── (tabs)/              # Groupe (layout partagé)
│   ├── index.tsx        → /
│   ├── annuaire.tsx     → /annuaire
│   └── _layout.tsx      → Layout avec onglets
│
├── login.tsx            → /login
└── details/
    └── [id].tsx         → /details/123
```

### Navigation typique

```typescript
import { useRouter } from 'expo-router';

export const MyComponent = () => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      onPress={() => {
        // 1. Navigation simple
        router.push('/page');
        
        // 2. Navigation avec paramètres
        router.push(`/details/${id}`);
        
        // 3. Navigation avec state
        router.push({
          pathname: '/details/[id]',
          params: { id: '123' }
        });
        
        // 4. Remplacer (pas d'historique)
        router.replace('/home');
        
        // 5. Revenir
        router.back();
      }}
    >
      <Text>Naviguer</Text>
    </TouchableOpacity>
  );
};
```

### Lire les paramètres

```typescript
import { useLocalSearchParams } from 'expo-router';

export const DetailsScreen = () => {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return <Text>{id}</Text>;
};
```

---

## 📱 Cas d'usage : Pagination

Exemple : CRASC avec liste paginée d'OSC

```typescript
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const OSC_PER_PAGE = 5;

export default function CrascDetails() {
  const [currentPage, setCurrentPage] = useState(1);

  // Données (ex: 23 OSC)
  const allOscs = [/* ... */];
  
  // Calcul de la pagination
  const totalPages = Math.ceil(allOscs.length / OSC_PER_PAGE);
  const startIdx = (currentPage - 1) * OSC_PER_PAGE;
  const endIdx = startIdx + OSC_PER_PAGE;
  const paginatedOscs = allOscs.slice(startIdx, endIdx);

  return (
    <View>
      {/* Affichage des OSC */}
      <FlatList
        data={paginatedOscs}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={item => item.id}
      />

      {/* Contrôles de pagination */}
      {totalPages > 1 && (
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </TouchableOpacity>

          <Text>
            Page {currentPage} / {totalPages}
          </Text>

          <TouchableOpacity
            onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
```

---

## 🎓 Bonnes pratiques

### ✅ À faire

- Utilisez TypeScript pour typer les variables
- Divisez les grands composants en composants plus petits
- Utilisez React Query pour les données
- Géralisez les styles avec NativeWind
- Testez sur un appareil réel
- Écrivez des messages de commit clairs

### ❌ À éviter

- Les styles inline (utilisez className)
- Les appels API directs (utilisez dataService)
- Dupliquer du code (créez des composants réutilisables)
- Les états globaux pour des données locales (useState)
- Ignorer les avertissements TypeScript

---

## 📚 Ressources

- **[Expo Router Docs](https://docs.expo.dev/router/introduction/)**
- **[React Query Docs](https://tanstack.com/query/latest)**
- **[NativeWind Docs](https://www.nativewind.dev/)**
- **[React Native Docs](https://reactnative.dev/)**

---

**Dernière mise à jour : 26 avril 2026**
