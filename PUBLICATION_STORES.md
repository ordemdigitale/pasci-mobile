# Publication de l'application PdoC sur les stores

Objectif : distribuer l'application par **Google Play** (Android) puis l'**App Store** (iOS),
au lieu d'un fichier APK téléchargé sur la PdoC.

## 1. Comptes à créer (par l'organisation, pas par un développeur)

| | Google Play Console | Apple Developer Program |
|---|---|---|
| Adresse | https://play.google.com/console/signup | https://developer.apple.com/programs/enroll/ |
| Coût | 25 USD, une seule fois | 99 USD par an |
| Type de compte | **Organisation** (recommandé) | **Organisation** |
| Pièces | Numéro **D-U-N-S** de la structure, site web, email et téléphone vérifiés, pièce d'identité du représentant | Numéro **D-U-N-S**, site web, personne habilitée à engager la structure |
| Délai indicatif | quelques jours (vérification d'identité) | 1 à 3 semaines (vérification D-U-N-S) |

- Le D-U-N-S s'obtient gratuitement auprès de Dun & Bradstreet (https://www.dnb.com/duns-number/get-a-duns.html) ;
  le délai peut atteindre 30 jours : à demander en premier.
- Un compte Google Play **personnel** récent doit faire un test fermé avec au moins 12 testeurs pendant
  14 jours avant la mise en production ; un compte **organisation** n'a pas cette contrainte.
- Utiliser une adresse email de l'organisation (ex. pdoc@plateforme-osci.org), pas une adresse personnelle,
  et ajouter ensuite les développeurs comme utilisateurs du compte.

## 2. Identifiant définitif de l'application (à décider avant la 1re publication)

L'identifiant ne peut plus être changé une fois l'application publiée.

- Android, actuellement : `com.angel_code.pdocmobileIdrys` (nom de branche de développement).
- iOS : pas encore défini.
- Proposition : `org.plateformeosci.pdoc` pour les deux (domaine de la plateforme inversé).

À reporter dans `app.json` (`expo.android.package` et `expo.ios.bundleIdentifier`) avant le premier build de production.
Aucun utilisateur n'est encore sur le store : c'est le seul moment où ce changement est sans conséquence.

## 3. Builds (EAS)

```bash
npx eas-cli build --platform android --profile production   # AAB pour Google Play
npx eas-cli build --platform ios --profile production       # IPA pour l'App Store
npx eas-cli build --platform android --profile apk          # APK de test interne (hors store)
```

- `production` produit désormais un **AAB** (format exigé par Google Play) ; le numéro de version est
  incrémenté automatiquement par EAS.
- Clé de signature Android : laisser EAS la générer et la conserver, puis activer « Play App Signing ».

Envoi vers les stores :

```bash
npx eas-cli submit --platform android --profile production  # piste de test « interne », en brouillon
npx eas-cli submit --platform ios --profile production      # TestFlight
```

Android : créer dans la Play Console un compte de service Google Cloud avec accès « Release manager » et
fournir sa clé JSON à EAS (`eas credentials`), ou téléverser le premier AAB à la main.

## 4. Fiche de l'application

- **Nom** : PdoC – Plateforme digitale des OSC
- **Description courte (80 caractères)** : La plateforme des organisations de la société civile de Côte d'Ivoire.
- **Description complète** :
  > La PdoC (Plateforme Digitale des Organisations de la Société Civile) réunit les OSC, les CRASC et les
  > partenaires techniques et financiers de Côte d'Ivoire.
  > – Annuaire des OSC, des CRASC et des PTF, recherche par thématique et par région
  > – Pôles de concertation : discussions, messages et partage de documents entre OSC
  > – Formations en ligne avec certificat
  > – Offres de projets, offres d'emploi, actualités et ressources documentaires
  > – Consultation hors ligne : les informations déjà consultées restent disponibles sans connexion
  >   et sont actualisées au retour du réseau.
- **Catégorie** : Social (ou Éducation)
- **Politique de confidentialité** : https://plateforme-osci.org/politique-de-confidentialite
- **Captures d'écran** : téléphone, 2 à 8 par store (accueil, annuaire, pôle, formation, offre de projet).
  iOS : formats 6,7" et 6,5" (et iPad, l'application étant déclarée compatible tablette).
- **Icône** : 512 × 512 px (Google Play), 1024 × 1024 px sans transparence (Apple).

## 5. Questionnaires

- **Sécurité des données (Google) / Confidentialité (Apple)** — données collectées :
  nom, email, téléphone (compte et adhésion), photos/vidéos/notes vocales (uniquement si l'utilisateur en
  joint à un message), contenus publiés. Données chiffrées en transit (HTTPS). Pas de publicité, pas de
  revente. Suppression du compte sur demande (prévoir une adresse ou une page dédiée).
- **Classification du contenu** : application sans contenu sensible (messagerie entre membres à signaler).
- **Autorisations** : appareil photo, photos, micro — avec les textes d'explication déjà présents.

## 6. Après la mise en ligne

- Remplacer le téléchargement de l'APK sur le site par les liens « Disponible sur Google Play » et
  « Télécharger dans l'App Store » (le fichier `public/downloads/pdoc.apk` du site pourra alors être retiré).
- Les mises à jour se font par un nouveau build `production` puis `submit`.
