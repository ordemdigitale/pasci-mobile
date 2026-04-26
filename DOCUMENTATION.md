# 📚 Index de la documentation - PASCI Mobile

Bienvenue! Voici comment naviguer dans la documentation.

---

## 🎯 Commencer par ici

### 👤 Vous êtes nouveau?

1. **Lisez** → [`SETUP.md`](./SETUP.md) (Installation complète)
2. **Ensuite** → [`QUICK_START.md`](./QUICK_START.md) (Commandes essentielles)
3. **Puis** → [`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md) (Guide complet)

**Durée** : 30-45 minutes

---

### ⚡ Vous êtes pressé?

1. **Lisez** → [`QUICK_START.md`](./QUICK_START.md) (5 minutes)
2. **Lancez** → `npm start`
3. **Codez!**

---

### 🏗️ Vous voulez comprendre l'architecture?

1. **Lisez** → [`ARCHITECTURE.md`](./ARCHITECTURE.md)
2. **Guides pratiques** :
   - Ajouter une nouvelle page
   - Ajouter une nouvelle fonctionnalité
   - Appels API
   - Gestion d'état

---

## 📖 Tous les guides

### 1. [`QUICK_START.md`](./QUICK_START.md) ⚡
**Durée**: 2 minutes à lire  
**Contenu**:
- Installation minimale
- Commandes essentielles
- Dépannage rapide
- Astuces

**Idéal pour**: Développeurs expérimentés, en retard

---

### 2. [`SETUP.md`](./SETUP.md) 🔧
**Durée**: 15-20 minutes pour installer + lire  
**Contenu**:
- Installation Node.js, Git, Expo
- Clonage du projet
- Installation des dépendances
- Lancement sur téléphone/émulateur
- Problèmes courants

**Idéal pour**: Première installation, débutants

---

### 3. [`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md) 📖
**Durée**: 20-30 minutes à lire  
**Contenu**:
- Prérequis détaillés
- Structure du projet
- Commandes principales
- Configuration API
- Conventions de code
- Dépannage complet
- Pages principales

**Idéal pour**: Développement quotidien, référence

---

### 4. [`ARCHITECTURE.md`](./ARCHITECTURE.md) 🏗️
**Durée**: 30-40 minutes à lire  
**Contenu**:
- Architecture générale (Layers)
- Patterns utilisés (Hooks, React Query, etc.)
- Guide détaillé: Ajouter une page
- Guide détaillé: Ajouter une fonctionnalité
- Appels API
- Gestion d'état
- Navigation
- Bonnes pratiques

**Idéal pour**: Contribution au code, nouveaux développeurs

---

### 5. [`README.md`](./README.md) 
**Original**: Documentation de base  
**Contient**:
- Prérequis
- Installation (version courte)
- Lancement
- Technologies utilisées
- Structure du projet

---

### 6. [`API_CONSUMPTION.md`](./API_CONSUMPTION.md)
**Contenu**:
- Endpoints de l'API
- Structures de données
- Comment utiliser chaque endpoint

**Idéal pour**: Intégration API, requêtes HTTP

---

## 🗺️ Carte de navigation

```
Commencer
    ↓
Vous êtes nouveau? (30 min)
├── SETUP.md
├── QUICK_START.md
└── DEVELOPER_GUIDE.md
    
Vous codez? (au besoin)
├── DEVELOPER_GUIDE.md (Dépannage)
├── ARCHITECTURE.md (Patterns)
└── API_CONSUMPTION.md (API)

Vous ajoutez une feature? (30 min)
├── ARCHITECTURE.md (Guide complet)
└── DEVELOPER_GUIDE.md (Conventions)
```

---

## 🎓 Parcours d'apprentissage

### Semaine 1 : Fondations
- [ ] Lire `SETUP.md` et installer
- [ ] Lire `QUICK_START.md`
- [ ] Lancer l'app sur votre téléphone
- [ ] Faire un petit changement (ex: modifier un texte)
- [ ] Créer votre première branche Git

### Semaine 2 : Développement
- [ ] Lire `DEVELOPER_GUIDE.md` (Conventions)
- [ ] Lire `ARCHITECTURE.md` (Patterns)
- [ ] Ajouter une nouvelle page simple
- [ ] Faire votre premier commit

### Semaine 3+ : Contribution
- [ ] Ajouter des fonctionnalités complexes
- [ ] Faire des appels API
- [ ] Créer des Pull Requests
- [ ] Revoir le code des collègues

---

## 🔍 Chercher quelque chose?

### Installation
→ [`SETUP.md`](./SETUP.md) ou [`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md#-prérequis)

### Lancer l'app
→ [`QUICK_START.md`](./QUICK_START.md) ou [`SETUP.md`](./SETUP.md#étape-6️⃣--lancer-lapplication)

### Ajouter une page
→ [`ARCHITECTURE.md`](./ARCHITECTURE.md#-guide-ajouter-une-nouvelle-page)

### Ajouter une fonctionnalité
→ [`ARCHITECTURE.md`](./ARCHITECTURE.md#-guide-ajouter-une-nouvelle-fonctionnalité)

### Appels API
→ [`ARCHITECTURE.md`](./ARCHITECTURE.md#-appels-api) ou [`API_CONSUMPTION.md`](./API_CONSUMPTION.md)

### Dépannage
→ [`QUICK_START.md`](./QUICK_START.md#-si-ça-casse) ou [`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md#-dépannage)

### Git et commits
→ [`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md#-processus-de-contribution)

### Conventions de code
→ [`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md#-conventions-de-code)

### Erreur spécifique
→ [`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md#-dépannage) (cherchez l'erreur)

---

## 📊 Structure du projet (Rapide)

```
pasci-mobile-Idrys/
├── app/                    # Pages (Expo Router)
│   ├── (tabs)/            # Pages avec onglets
│   ├── services.tsx       # Services
│   ├── contact.tsx        # Contact
│   └── *-details/[id].tsx # Pages dynamiques
│
├── components/            # Composants réutilisables
├── services/              # Logique métier et API
├── constants/             # Données et thème
├── assets/                # Images et icônes
│
└── 📄 Documentation
    ├── DOCUMENTATION.md   # ← Vous êtes ici
    ├── SETUP.md          # Installation
    ├── QUICK_START.md    # Commandes rapides
    ├── DEVELOPER_GUIDE.md # Guide complet
    ├── ARCHITECTURE.md   # Technique
    ├── README.md         # Original
    └── API_CONSUMPTION.md # API
```

---

## 🔄 Après la lecture

### Prochaines étapes

1. ✅ Installez le projet
2. ✅ Lancez l'app sur votre téléphone
3. ✅ Modifiez un fichier et voyez le changement
4. ✅ Lisez la structure du projet
5. ✅ Faites votre premier commit

### Puis

- Explorez le code
- Ajoutez une petite fonctionnalité
- Collaborez avec l'équipe
- Posez des questions!

---

## 💬 Questions?

- **Technique?** → Consultez [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- **Installation?** → Consultez [`SETUP.md`](./SETUP.md)
- **Commandes?** → Consultez [`QUICK_START.md`](./QUICK_START.md)
- **En général?** → Consultez [`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md)

---

## ✅ Checklist: Êtes-vous prêt?

- [ ] Vous avez lu au moins un guide
- [ ] Vous avez Node.js installé
- [ ] Vous avez cloné le projet
- [ ] Vous avez lancé `npm install`
- [ ] Vous avez vu l'app sur votre téléphone
- [ ] Vous avez compris la structure du projet
- [ ] Vous savez comment naviguer dans la doc

✨ **Vous êtes prêt à contribuer!**

---

**Bonne chance! 🚀**

*Dernière mise à jour : 26 avril 2026*
