# ⚙️ Guide d'installation complète - PASCI Mobile

Instructions détaillées pour une première installation du projet.

---

## 🎯 Objectif

À la fin de ce guide, vous aurez :
- ✅ Tous les outils installés
- ✅ Le projet cloné et configuré
- ✅ L'application lancée sur votre téléphone ou émulateur
- ✅ L'environnement de développement prêt

**Durée estimée : 15-20 minutes**

---

## Étape 1️⃣ : Installer Node.js

### Windows

1. Accédez à https://nodejs.org/
2. Téléchargez la version **LTS** (Recommended for most users)
3. Lancez l'installateur
4. Acceptez les termes et cliquez **Next**
5. Acceptez le chemin par défaut et cliquez **Next**
6. Cliquez **Install** et attendez la fin
7. Cliquez **Finish**

### macOS

**Option A : Téléchargement direct**

1. Accédez à https://nodejs.org/
2. Téléchargez la version **LTS**
3. Lancez le `.pkg`
4. Suivez l'assistant d'installation

**Option B : Avec Homebrew (plus rapide)**

```bash
brew install node
```

### Linux (Ubuntu/Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### ✓ Vérification

```bash
node --version
npm --version
```

Vous devriez voir quelque chose comme :
```
v20.x.x
10.x.x
```

---

## Étape 2️⃣ : Installer Git

### Windows

1. Accédez à https://git-scm.com/
2. Téléchargez l'installateur Windows
3. Lancez-le et acceptez les paramètres par défaut
4. Cliquez **Install** et **Finish**

### macOS

```bash
brew install git
```

### Linux

```bash
sudo apt-get install git
```

### ✓ Vérification

```bash
git --version
```

Vous devriez voir : `git version 2.x.x`

---

## Étape 3️⃣ : Cloner le projet

Choisissez un dossier où vous voulez travailler (ex: `Documents/Projets`)

### Avec SSH (Recommandé - nécessite une clé GitHub)

```bash
git clone git@github.com:ordemdigitale/pasci-mobile-Idrys.git
cd pasci-mobile-Idrys
```

### Avec HTTPS (Plus simple)

```bash
git clone https://github.com/ordemdigitale/pasci-mobile-Idrys.git
cd pasci-mobile-Idrys
```

---

## Étape 4️⃣ : Installer les dépendances

```bash
npm install
```

**Cela peut prendre 3-5 minutes** selon votre connexion Internet.

Vous verrez beaucoup de lignes s'afficher :
```
added XXX packages, and audited XXX packages
```

**Si vous voyez des avertissements (warnings)**, c'est normal et vous pouvez les ignorer.

---

## Étape 5️⃣ : Installer Expo Go (pour tester sur téléphone)

### Option A : Tester sur votre téléphone réel

1. Sur votre **téléphone** (Android ou iOS) :
   - Ouvrez le Play Store (Android) ou l'App Store (iOS)
   - Cherchez "Expo Go"
   - Installez-le

2. Assurez-vous que votre téléphone et votre ordinateur **sont sur le même réseau WiFi**

### Option B : Utiliser un émulateur (sans téléphone)

#### Android

1. Téléchargez **Android Studio** : https://developer.android.com/studio
2. Installez-le (acceptez tous les paramètres par défaut)
3. Lancez Android Studio
4. Créez un émulateur virtuel :
   - **Cliquez** : Virtual Device Manager
   - **Créez** : Un nouvel appareil
5. Sélectionnez l'émulateur et cliquez le bouton Play

#### iOS (macOS uniquement)

Vous aurez besoin de Xcode. C'est lourd (13 GB), donc optionnel.

```bash
# Lancez Xcode
xcode-select --install

# Puis utilisez :
npm run ios
```

---

## Étape 6️⃣ : Lancer l'application

### Dans le terminal

```bash
npm start
```

Vous devriez voir :

```
Expo Go
 ✓ Built in XXms

 › Press a to open Android
 › Press w to open web
 › Press i to open iOS simulator
 › Press r to reload app
 › Press d to open Debugger
 › Press m to toggle menu
 › Press q to quit

Logs for your project will appear below. Press Ctrl+C to stop.
```

### 📱 Sur un téléphone réel

1. **Ouvrez Expo Go** sur votre téléphone
2. **Scannez le QR code** affiché dans le terminal
3. **Attendez le chargement** (30 secondes)
4. ✅ L'app s'affiche sur votre téléphone!

### 🤖 Sur un émulateur Android

```bash
npm run android
```

Ou dans le terminal principal, appuyez sur `a`

### 🍎 Sur un simulateur iOS (macOS)

```bash
npm run ios
```

Ou dans le terminal principal, appuyez sur `i`

---

## Étape 7️⃣ : Vérifier que tout fonctionne

Une fois l'app lancée, vérifiez :

- ✅ La page d'accueil s'affiche
- ✅ Vous voyez des onglets en bas (Accueil, Annuaire, Collab, Profil)
- ✅ Les couleurs orange et gris sont présentes
- ✅ Vous pouvez naviguer entre les pages

---

## 🔄 Votre premier changement

### Tester un changement de code

1. **Ouvrez** : `app/(tabs)/index.tsx`
2. **Trouvez** : `<Text>Accueil</Text>` (près du début)
3. **Changez-le** en : `<Text>Accueil - Testé!</Text>`
4. **Enregistrez** le fichier (Ctrl+S ou Cmd+S)
5. **Regardez votre téléphone** : Le changement apparaît automatiquement!
6. **Appuyez sur `r`** dans le terminal si le changement ne s'affiche pas
7. **Revertiez le changement** (remettez `<Text>Accueil</Text>`)

Félicitations! Vous avez votre environnement de développement prêt! 🎉

---

## 📝 Fichiers de configuration importants

| Fichier | Utilité |
|---------|---------|
| `package.json` | Liste les dépendances et commandes |
| `app.json` | Configuration Expo et branding |
| `tailwind.config.js` | Couleurs et thème |
| `tsconfig.json` | Configuration TypeScript |
| `babel.config.js` | Configuration du compilateur |

Vous pouvez les ignorer pour l'instant.

---

## 🆘 Problèmes courants à l'installation

### ❌ `npm: command not found`

**Solution** : Node.js n'est pas installé. Relancez la [Étape 1️⃣](#étape-1️⃣--installer-nodejs)

### ❌ `git: command not found`

**Solution** : Git n'est pas installé. Relancez la [Étape 2️⃣](#étape-2️⃣--installer-git)

### ❌ `npm ERR! code EACCES`

**Solution (macOS/Linux)** :
```bash
sudo chown -R $(whoami) ~/.npm
```

### ❌ L'app ne charge pas sur le téléphone

**Solutions** :
1. Redémarrez Expo Go sur votre téléphone
2. Vérifiez que téléphone et ordi sont sur **le même WiFi**
3. Dans le terminal, appuyez sur `r` pour redémarrer
4. Scannez le QR code à nouveau

### ❌ `Module not found`

**Solution** :
```bash
rm -rf node_modules
npm install
npm start
```

---

## ✅ Checklist d'installation

- [ ] Node.js installé et vérifié (`node --version`)
- [ ] Git installé et vérifié (`git --version`)
- [ ] Projet cloné (`cd pasci-mobile-Idrys`)
- [ ] Dépendances installées (`npm install` terminé)
- [ ] Expo Go installé sur le téléphone
- [ ] Terminal affiche le QR code
- [ ] App lancée sur téléphone/émulateur
- [ ] Navigation fonctionne

---

## 🎓 Prochaines étapes

Une fois l'installation réussie :

1. **Lisez** : [`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md) pour plus de détails
2. **Consultez** : [`API_CONSUMPTION.md`](./API_CONSUMPTION.md) pour comprendre l'API
3. **Modifiez** : N'importe quel fichier dans `app/` ou `components/`
4. **Testez** : En appuyant sur `r` dans le terminal

---

**Vous êtes prêt! Bon développement! 🚀**

Si vous êtes bloqué, consultez le [`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md) dans la section **Dépannage**.
