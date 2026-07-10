# Recette Mobile - Parcours critiques

Date: 2026-06-03
Projet: pasci-mobile-Idrys

## 1. Pré-checks techniques (déjà validés)

- [x] TypeScript: `npx tsc --noEmit` -> EXIT 0
- [x] Bundle Android: `npx expo export --platform android` -> OK
- [x] Bundle iOS: `npx expo export --platform ios` -> OK
- [x] Endpoints publics critiques répondent:
  - `GET /formations/catalogue`
  - `GET /crasc/crasc`
  - `GET /crasc/evenement`
  - `GET /crasc/video`

Note:

- Les tests automatiques de soumission `POST` sur Contact/Rejoindre ne sont pas lancés ici pour éviter d'injecter de fausses données dans l'environnement de production.

## 2. Tests manuels à exécuter sur appareil

Environnement recommandé:

- Android réel + iOS réel
- Réseau normal puis réseau dégradé
- Session connectée et non connectée

### 2.1 Contact

- [x] Ouvrir écran Contact
- [x] Soumettre un formulaire valide
- [x] Vérifier message de succès
- [x] Refaire avec email invalide -> erreur attendue
- [ ] Simuler réseau coupé -> message d'erreur réseau attendu

### 2.2 Rejoindre

- [x] Ouvrir écran Rejoindre
- [x] Vérifier chargement CRASC dynamiques
- [x] Vérifier chargement types OSC dynamiques
- [x] Soumettre un formulaire valide -> succès
- [x] Tester champ requis manquant -> validation locale

### 2.3 CRASC details

- [x] Ouvrir un CRASC ayant agenda et vidéos
- [x] Vérifier affichage bloc Agenda
- [x] Vérifier affichage bloc Vidéos
- [x] Ouvrir une vidéo externe

### 2.4 Formations

- [x] Ouvrir écran Formations
- [x] Cliquer Télécharger le catalogue PDF
- [x] Vérifier ouverture PDF
- [ ] Vérifier cas aucun catalogue actif

### 2.5 Non-régression navigation

- [x] Actualités -> détail
- [x] Projets -> détail
- [x] Ressources -> téléchargement
- [x] Inbox -> détail actualité

## 3. Résultat de recette

- Statut global: [ ] PASS [ ] FAIL [x] PARTIEL
- Commentaires:
- Technique OK: typecheck + bundle Android/iOS + endpoints publics OK.
- Contact iOS validé: soumission formulaire OK avec message de succès affiché.
- Contact iOS validé: email invalide affiche alerte + mise en évidence visuelle du champ.
- Rejoindre iOS validé: écran ouvert et liste Type OSC dynamique affichée.
- Rejoindre iOS validé: liste CRASC dynamique affichée et sélectionnable.
- Rejoindre iOS validé: erreurs locales affichées sur champs invalides/manquants (email, motivation).
- Rejoindre iOS validé: soumission API réussie (POST /adhesion -> 201, id 13, statut en_attente).
- CRASC details iOS validé: affichage agenda + vidéos sur CRASC Centre (compteurs et cartes visibles).
- Formations iOS validé: écran ouvert, action téléchargement catalogue OK et PDF affiché dans la visionneuse.
- Non-régression navigation iOS validée: Actualités/Projets/Ressources/Inbox ouvrent correctement les écrans de détail associés.
- Correction iOS validée: ouverture vidéo YouTube en externe (fallback) fonctionnelle.
- Reste à faire: validation manuelle sur appareil des formulaires et parcours finaux.
- Correctifs requis:
