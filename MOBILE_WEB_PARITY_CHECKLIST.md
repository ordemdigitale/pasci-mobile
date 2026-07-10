# Checklist Mobile - Alignement avec les nouveautés Web

Ce document sert de checklist d'implémentation pour aligner l'application mobile avec les évolutions récentes du web.

## 1) Vue d'ensemble

- Source de comparaison: dernières évolutions de pasci-web-Idrys
- Cible: pasci-mobile-Idrys (application mobile publique)
- Principe: prioriser les écarts fonctionnels visibles par les utilisateurs mobiles

## 2) Hors périmètre mobile public

Les écrans purement back-office web ne doivent pas être portés tels quels dans l'app mobile publique:

- `app/admin/contact/page.tsx`
- `app/admin/formations/catalogue/page.tsx`
- `app/admin/gestion-des-crasc/videos/page.tsx`
- `app/admin/gestion-des-crasc/agenda/page.tsx`
- `app/admin/gestion-des-crasc/agenda/ajouter-evenement/page.tsx`
- `app/admin/mon-osc/page.tsx`
- `app/admin/mon-osc/modifier/page.tsx`
- `app/admin/forbidden/page.tsx`
- `app/admin/moderation/page.tsx`

Note: ces fonctionnalités peuvent être exposées plus tard via un module "admin mobile" dédié, avec authentification/roles renforcés.

## 3) Priorité P0 (critique)

### 3.1 Contact: brancher le formulaire sur l'API

- [x] Remplacer la simulation locale (`setTimeout`) dans `app/contact.tsx`
- [x] Ajouter endpoint mobile pour soumission contact (POST)
- [x] Aligner les champs avec le web/API:
  - `categorie_acteur`, `nom`, `prenoms`, `fonction`, `sexe`, `tranche_age`, `email`, `contact`, `pays`, `lieu_residence`, `motif`, `message`
- [x] Ajouter validation mobile cohérente (champs requis, email, téléphone)
- [x] Gérer erreurs API (4xx/5xx) + message utilisateur
- [ ] Ajouter test manuel: envoi réussi + cas erreur réseau

### 3.2 Rejoindre: brancher le formulaire d'adhésion sur l'API

- [x] Remplacer la simulation locale (`setTimeout`) dans `app/rejoindre.tsx`
- [x] Ajouter récupération dynamique des CRASC et types OSC depuis API
- [x] Aligner le payload sur les champs web actuels (nom/prénoms, catégorie, téléphone, sélection CRASC/type OSC)
- [x] Ajouter validation stricte avant envoi
- [x] Gérer statut de soumission (chargement/succès/erreur)
- [ ] Ajouter test manuel: soumission valide + validation des erreurs

### 3.3 CRASC details: afficher agenda et vidéos

- [x] Étendre `services/types.ts` pour inclure événements agenda + vidéos CRASC
- [x] Étendre `services/dataService.ts` pour exposer ces données
- [x] Afficher section Agenda dans `app/crasc-details/[id].tsx`
- [x] Afficher section Vidéos (YouTube/Vimeo) dans `app/crasc-details/[id].tsx`
- [ ] Vérifier perf mobile (lazy load, placeholders)

## 4) Priorité P1 (important)

### 4.1 Formations: catalogue PDF côté mobile

- [x] Ajouter endpoint de récupération du catalogue de formations actif
- [x] Ajouter bouton/section "Télécharger le catalogue" dans `app/formations.tsx`
- [x] Ouvrir PDF via navigateur ou viewer intégré
- [x] Gérer cas "aucun catalogue actif"

### 4.2 Faire un don: aligner le formulaire enrichi web

- [ ] Comparer les champs web vs mobile et compléter les champs manquants
- [ ] Aligner le flux de paiement (simulation vs paiement réel selon environnement)
- [ ] Ajouter validation montant personnalisé (min/max)
- [ ] Ajouter message post-paiement cohérent

### 4.3 Forum/pôles: vérification accès authentifié

- [ ] Vérifier restrictions d'accès (lecture/écriture) comme sur web
- [ ] Si non connecté, rediriger proprement vers `login`
- [ ] Ajouter feedback utilisateur sur permissions

## 5) Priorité P2 (confort / qualité)

### 5.1 Qualité technique

- [ ] Uniformiser les types API entre `services/types.ts` et backend
- [ ] Réduire les `any` dans les types CRASC/OSC
- [ ] Ajouter gestion standard des erreurs réseau (helper unique)
- [ ] Ajouter logs utiles en dev uniquement

### 5.2 UX mobile

- [ ] Ajouter états vides et skeletons partout où nécessaire
- [ ] Harmoniser wording FR (boutons, erreurs, succès)
- [ ] Vérifier responsive Android petits écrans / iOS

### 5.3 Validation fonctionnelle

- [x] Script de tests manuels de non-régression (auth, contact, rejoindre, formations, CRASC)
- [ ] Vérifier deep links critiques (détails formation/CRASC/OSC)

Protocole disponible: `RECETTE_MOBILE.md`

## 6) Plan d'exécution recommandé (sprints)

### Sprint 1

- [ ] Contact API
- [ ] Rejoindre API
- [ ] Alignement types API minimum

### Sprint 2

- [ ] CRASC agenda + vidéos
- [ ] Catalogue formations mobile
- [ ] Don enrichi

### Sprint 3

- [ ] Durcissement auth forum
- [ ] Qualité et non-régression
- [ ] Stabilisation release

## 7) Critères d'acceptation globaux

- [x] Aucune simulation locale restante sur les formulaires métiers (contact, rejoindre)
- [x] Données CRASC enrichies visibles sur mobile (agenda + vidéos)
- [x] Catalogue formations consultable/téléchargeable depuis mobile
- [x] Aucune erreur TypeScript introduite
- [ ] Parcours utilisateur validés sur Android et iOS

## 8) État des tests (2026-06-03)

- [x] Validation technique TypeScript: `npx tsc --noEmit` (EXIT 0)
- [x] Smoke build Android: `npx expo export --platform android` (OK)
- [x] Smoke build iOS: `npx expo export --platform ios` (OK)
- [x] Vérification endpoints publics critiques: catalogue, CRASC, événements, vidéos (OK)
- [ ] Recette manuelle complète Android/iOS (en cours, voir `RECETTE_MOBILE.md`)

Note:

- Les tests automatiques de soumission des formulaires `Contact` et `Rejoindre` n'ont pas été exécutés contre l'API de production afin d'éviter la création de données parasites. Ces cas restent à valider manuellement sur appareil.
