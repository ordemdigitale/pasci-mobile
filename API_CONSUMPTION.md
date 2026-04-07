# 📡 Résumé des Consommations API - Pasci Mobile Idrys

## 🌐 Configuration API

**Base URL:** `https://api.plateforme-osci.org/api/v1`

**Client HTTP:** Axios avec intercepteurs pour :
- ✅ Authentification Bearer automatique
- 📊 Logging détaillé des requêtes/réponses
- 🔄 Gestion dynamique du token JWT

---

## 🔐 Authentification

| Endpoint | Méthode | Format | Rôle |
|----------|---------|--------|------|
| `/auth/login` | POST | x-www-form-urlencoded | Connexion utilisateur |
| `/users/me` | GET | - | Profil utilisateur courant |

**Stockage:** Token JWT sauvegardé de manière sécurisée via `expo-secure-store`

**Headers:** `Authorization: Bearer {jwt_token}`

---

## 📱 Endpoints par Domaine

### 1. **CRASC** (Centre Régional d'Appui à la Solidarité Communautaire)
```
GET  /crasc/crasc           # Liste tous les CRASCs
GET  /crasc/crasc/{slug}    # Détails d'un CRASC
```

### 2. **Actualités/Nouvelles**
```
GET  /news                           # Liste toutes les actualités (avec filtres optionnels)
GET  /news/{slug}                    # Détails d'une actualité
```

### 3. **Emplois/Jobs**
```
GET  /jobs                  # Liste toutes les offres d'emploi
GET  /jobs/{slug}           # Détails d'une offre d'emploi
```

### 4. **Formations**
```
GET  /formations                     # Toutes les formations (avec filtres optionnels)
GET  /formations/upcoming            # Formations à venir
GET  /formations/{slug}              # Détails d'une formation
```

### 5. **Partenaires OSC**
```
GET  /crasc/osc             # Liste des OSC
GET  /crasc/osc/{slug}      # Détails d'une OSC
```

### 6. **PTF** (Partenaires Techniques et Financiers)
```
GET  /ptf                   # Liste des PTF
GET  /ptf/{slug}            # Détails d'un PTF
```

### 7. **Offres de Projets**
```
GET  /offre-projets         # Liste des appels à projets
GET  /offre-projets/{slug}  # Détails d'un appel à projet
```

### 8. **Forum / Pôles de Concertation**
```
GET  /forum/poles                              # Liste des pôles
GET  /forum/poles/{slug}                       # Détails d'un pôle
GET  /forum/poles/{slug}/sujets                # Sujets d'un pôle
```

### 9. **Régions**
```
GET  /crasc/region          # Liste des régions disponibles
```

### 10. **Statistiques Clés**
```
GET  /key-stats             # Chiffres clés de la plateforme
```

### 11. **Documentation**
```
GET  /documentation         # Liste des documents/ressources
GET  /documentation/{slug}  # Détails d'un document
```

### 12. **Recherche**
```
GET  /search/osc?q={query}&region={region}    # Recherche OSC avec filtrage régional
GET  /search/?q={query}                        # Recherche globale
GET  /search/suggestions?q={query}             # Suggestions de recherche
```

---

## 🏗️ Stack Technique

| Élément | Technologie |
|---------|-------------|
| **Requêtes HTTP** | Axios |
| **State Management** | React Query (@tanstack/react-query) |
| **Authentification** | Bearer Token (JWT) |
| **Stockage Sécurisé** | Expo SecureStore |

---

## 📊 Types de Données

- **Crasc:** CRASCs avec informations régionales
- **News:** Actualités avec slug, tags et relations crasc/osc
- **Job:** Offres d'emploi avec missions, requirements, benefits
- **Formation:** Formations avec rubrique, formateur, participants, prix
- **Partner (OSC):** Organisations de la société civile
- **PTF:** Partenaires Techniques et Financiers
- **OffreProjet:** Appels à projets avec statut et progression
- **PoleConcertation:** Pôles du forum collaboratif
- **Documentation:** Ressources téléchargeables
- **KeyStats:** Statistiques clés

---

**Dernière mise à jour:** 2026-04-05
