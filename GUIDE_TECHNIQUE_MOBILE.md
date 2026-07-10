# Guide Technique - PASCI Mobile

Ce guide décrit l'architecture, les conventions d'implémentation, et la méthode recommandée pour faire évoluer l'application mobile.

## 1) Stack et architecture

- Framework: Expo + React Native
- Navigation: Expo Router (`app/`)
- Données serveur: React Query + Axios
- Auth: JWT Bearer via `expo-secure-store`
- Styling: NativeWind
- Langage: TypeScript

Architecture logique:

1. UI/routes dans `app/`
2. Composants réutilisables dans `components/`
3. Services API dans `services/`
4. Types partagés dans `services/types.ts`
5. Données statiques dans `constants/`

## 2) Organisation des couches

### 2.1 Couche API

- `services/apiClient.ts`: instance Axios, base URL, intercepteurs
- `services/dataService.ts`: endpoints métier
- `services/authService.ts`: login/logout/profil

Règles:

- Toujours centraliser un endpoint dans `dataService` ou `authService`
- Ne pas appeler Axios directement depuis les écrans
- Typer chaque réponse API

### 2.2 Couche écran

- Routes dans `app/*.tsx` ou `app/**/[id].tsx`
- Logique de récupération via `useQuery`
- Actions via `useMutation` si écriture

Règles:

- États UI explicites: `loading`, `error`, `empty`, `success`
- Validation côté client avant envoi
- Messages d'erreur utilisateur lisibles (pas de message brut backend)

## 3) Gestion des endpoints

Exemple de standard pour ajouter un endpoint dans `dataService.ts`:

```ts
getContactMotifs: async (): Promise<string[]> => {
  const response = await apiClient.get<string[]>("/contact/motifs");
  return response.data;
};
```

Checklist endpoint:

- [ ] Endpoint ajouté dans le bon service
- [ ] Type de retour défini dans `services/types.ts` (si nécessaire)
- [ ] Erreur gérée côté écran
- [ ] Requête testée avec token et sans token

## 4) Gestion des types

Fichier principal: `services/types.ts`

Bonnes pratiques:

- Préférer des interfaces précises au lieu de `any`
- Aligner les noms de champs backend/mobile
- Documenter les champs optionnels (`?`)

Exemple:

```ts
export interface ContactPayload {
  categorie_acteur?: string;
  nom: string;
  prenoms: string;
  email: string;
  contact?: string;
  motif: string;
  message?: string;
}
```

## 5) Auth et sécurité

- Le token est stocké dans `expo-secure-store`
- `apiClient` injecte automatiquement `Authorization: Bearer ...`
- Les routes sensibles doivent vérifier l'état utilisateur avant action

Règles:

- Ne jamais logger le token
- Ne pas stocker de secret dans le code
- Rediriger vers login si action protégée

## 6) Standards UX/erreurs

### 6.1 États obligatoires par écran data-driven

- Chargement: spinner/skeleton
- Erreur: message clair + action de retry
- Vide: message contextualisé
- Succès: confirmation explicite

### 6.2 Formulaires

- Validation locale avant envoi
- Bouton désactivé pendant la soumission
- Messages d'erreur champ par champ si possible

## 7) Process de dev recommandé

1. Créer branche: `feature/mobile-xxx`
2. Ajouter/ajuster types
3. Ajouter endpoint service
4. Intégrer écran
5. Tester Android + iOS
6. Lint + TypeScript
7. PR avec captures et cas testés

Commandes utiles:

```bash
npm start
npm run android
npm run ios
npx tsc --noEmit
npx eslint .
```

## 8) Procédure alignement web -> mobile

1. Identifier nouveautés web impactant l'expérience mobile
2. Classer en P0/P1/P2
3. Vérifier dépendances backend (endpoints disponibles)
4. Implémenter service + types + écran
5. Tester parcours complet
6. Mettre à jour la checklist de parité

Référence projet:

- Voir `MOBILE_WEB_PARITY_CHECKLIST.md`

## 9) Checklist qualité avant release

- [ ] Pas de `TODO` bloquant dans les écrans métier
- [ ] Formulaires connectés API (pas de simulation locale)
- [ ] Aucun type `any` nouveau sans justification
- [ ] Build OK Android/iOS
- [ ] Parcours critiques validés: login, contact, rejoindre, formation, CRASC
