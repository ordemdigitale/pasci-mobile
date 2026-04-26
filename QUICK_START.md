# ⚡ Démarrage rapide - PASCI Mobile

**Vous êtes en retard?** Voici les commandes essentielles.

---

## 🎯 Pour la première fois

### 1️⃣ Installation (5 min)

```bash
# Cloner le projet
git clone https://github.com/ordemdigitale/pasci-mobile-Idrys.git
cd pasci-mobile-Idrys

# Installer les dépendances
npm install

# Lancer le serveur
npm start
```

### 2️⃣ Lancer sur votre téléphone

- **Android/iOS** : Scannez le QR code avec Expo Go
- **Émulateur Android** : Appuyez sur `a` dans le terminal
- **Simulateur iOS** : Appuyez sur `i` dans le terminal

✅ **C'est prêt!**

---

## 🔄 Développement quotidien

### Démarrer le serveur

```bash
npm start
```

### Modifier le code

1. Éditez un fichier (ex: `app/(tabs)/index.tsx`)
2. Enregistrez (Ctrl+S)
3. L'app se recharge automatiquement
4. Si ça ne marche pas, appuyez sur `r`

### Valider votre code

```bash
# Vérifier les erreurs TypeScript
npx tsc --noEmit

# Checker les règles ESLint
npx eslint .
```

---

## 📁 Fichiers importants

| Fichier | Ce qu'il contient |
|---------|-------------------|
| `app/` | Les pages de l'application |
| `components/` | Les composants réutilisables |
| `services/dataService.ts` | Les appels API |
| `constants/crasc.ts` | Les données CRASC |
| `package.json` | Les dépendances |

---

## 🛠 Tâches courantes

### Ajouter une nouvelle page

```
1. Créez app/ma-page.tsx
2. Exportez un composant React
3. Naviguez avec router.push('/ma-page')
```

Voir [`ARCHITECTURE.md`](./ARCHITECTURE.md) pour un exemple complet.

### Ajouter un appel API

```typescript
// 1. Dans services/dataService.ts
getMesItems: async () => {
  const response = await axios.get('/items');
  return response.data;
},

// 2. Dans votre composant
const { data: items } = useQuery({
  queryKey: ['items'],
  queryFn: dataService.getMesItems,
});
```

### Changer l'URL de l'API

Fichier: `services/dataService.ts`

```typescript
const API_BASE_URL = 'https://nouvelle-api.com/api'; // ← Changez ici
```

---

## 🐛 Si ça casse

### Le code ne se met pas à jour

```bash
# Redémarrez avec cache clean
npx expo start --clear

# Ou juste redémarrez
npm start
# Puis appuyez sur 'r'
```

### Erreur: `Module not found`

```bash
npm install
npm start
```

### L'app crashe

```bash
# Cherchez l'erreur dans le terminal
# Lisez la pile d'erreurs (stack trace)
# Cherchez la ligne problématique dans votre code
```

### L'API ne répond pas

1. Vérifiez l'URL dans `services/dataService.ts`
2. Vérifiez que le serveur API est lancé
3. Testez l'URL dans Postman ou votre navigateur

---

## 📚 Guides complets

- **[SETUP.md](./SETUP.md)** : Installation détaillée
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** : Guide complet
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** : Architecture technique
- **[API_CONSUMPTION.md](./API_CONSUMPTION.md)** : Comprendre l'API

---

## 🚀 Commits et Git

### Committer vos changements

```bash
git add .
git commit -m "feat: ajouter une nouvelle page"
git push origin votre-branche
```

### Conventions

- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `refactor:` restructuration

Exemple :
```bash
git commit -m "fix: corriger la pagination du CRASC"
git commit -m "feat: ajouter la page À Propos"
```

---

## 💡 Astuces

```bash
# Voir les options
npm start
# Affiche : a=android, i=ios, w=web, r=restart, d=debug, q=quit

# Ouvrir le débogueur
# Appuyez sur 'd' quand l'app est lancée

# Réinitialiser complètement
rm -rf node_modules && npm install && npm start

# Afficher les logs du téléphone
npm start
# Appuyez sur 'd'
```

---

## ❓ Questions rapides

**Q: Comment ajouter une nouvelle dépendance?**
```bash
npm install nom-du-package
npm start
```

**Q: Comment changer le style d'une page?**

Utilisez les classes Tailwind CSS :
```typescript
<View className="bg-white rounded-lg p-4 shadow-sm">
```

**Q: Comment naviguer entre les pages?**

```typescript
const router = useRouter();
router.push('/page');
```

**Q: Comment faire un appel API?**

Utilisez `dataService` et `useQuery` :
```typescript
const { data } = useQuery({
  queryKey: ['items'],
  queryFn: dataService.getItems,
});
```

---

## ✅ Checklist avant de commit

- [ ] Le code compile (pas d'erreurs TypeScript)
- [ ] Testé sur le téléphone
- [ ] Git status propre
- [ ] Message de commit clair
- [ ] Pas de fichiers sensibles

---

**Besoin de plus d'aide?** → Consultez [`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md)

**Première fois?** → Lisez [`SETUP.md`](./SETUP.md)

**Questions techniques?** → Consultez [`ARCHITECTURE.md`](./ARCHITECTURE.md)
