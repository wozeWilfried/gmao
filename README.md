# GMAO Enterprise

**Gestion de Maintenance Assistee par Ordinateur** — Solution professionnelle 100% frontend pour la gestion de parc d'equipements, les ordres de travail, les stocks et les indicateurs de performance.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3-61DAFB)
![Vite](https://img.shields.io/badge/Vite-6-646CFF)
![License](https://img.shields.io/badge/licence-MIT-green)

---

## Table des matieres

- [Apercu](#apercu)
- [Fonctionnalites](#fonctionnalites)
- [Architecture](#architecture)
- [Roles et permissions](#roles-et-permissions)
- [Modules](#modules)
- [Workflow](#workflow)
- [Installation](#installation)
- [Deploiement](#deploiement)
- [Structure du projet](#structure-du-projet)
- [Bonnes pratiques](#bonnes-pratiques)
- [FAQ](#faq)

---

## Evolution du projet

Ce qui a change entre la version initiale (cahier des charges) et la version finale livree :

### Ce qui a ete conserve a l'identique

| Element | Statut |
|---------|--------|
| 5 roles utilisateur (admin, resp. maintenance, technicien, resp. stock, direction) | Inchange |
| 5 modules fonctionnels (Equipements, Interventions, Stocks, Rapports, Admin) | Inchange |
| Persistance localStorage avec structure de donnees par collection | Inchange |
| Machine a etats des OT (demande -> planifie -> en_cours -> cloture/annule) | Inchange |
| Authentification par identifiant/mot de passe avec session persistee | Inchange |
| Stack React 18 + Vite + Tailwind CSS 3 | Inchange |
| Graphiques Recharts pour les KPI | Inchange |
| Exports PDF (jsPDF) et Excel (SheetJS) | Inchange |
| Couverture des indicateurs MTBF, MTTR, disponibilite, ratio PM, couts | Inchange |
| Generation d'OT preventifs automatiques selon periodicite | Inchange |

### Ce qui a ete ajoute

| Ajout | Description |
|-------|-------------|
| **DashboardAdmin** | Nouveau tableau de bord dedie au role admin avec supervision complete (equipements, OT, utilisateurs, stock) |
| **Illustrations SVG** | 5 illustrations inline professionnelles (Maintenance, Analytics, Inventory, EmptyState, LoadingSpinner) |
| **Page login 2 colonnes** | Mise en page redesinee avec grande illustration a gauche + badges statistiques |
| **Favicon gradient** | Nouveau favicon.svg avec degrade bleu-indigo |
| **Meta tags SEO** | Description, theme-color, viewport optimises |
| **Support `peutPartiel`** | Techniciens peuvent desormais voir le bouton "Nouvel OT" (permission partielle) |
| **Notifications actives** | Generation automatique des alertes fin de garantie et stock critique au chargement |
| **Filtre periode KPI** | Filtre 30/90/365 jours operationnel sur tous les indicateurs RapportsPage |
| **Export backup complet** | exportAll() inclut desormais les 7 collections (activity_logs, notifications inclus) |
| **Rapport DOCX** | Script de generation de rapport d'architecture automatise (scripts/generate-report.cjs) |
| **README complet** | Documentation exhaustive avec workflow, architecture, FAQ, guide deploiement |

### Ce qui a ete retire ou modifie

| Changement | Raison |
|------------|--------|
| **Em dashes supprimes** (31 occurrences) | Nuisibles a la coherence typographique dans les exports PDF |
| **Imports inutilises supprimes** (29 symboles lucide-react) | Code mort, impact negatif sur la maintenabilite |
| **Label direction "Stocks" -> "Stocks (lecture)"** | Incoherence avec les droits reels du role direction |
| **Matrice permissions `voir` -> `consulter`** | Normalisation du nommage des actions dans la matrice |
| **Deduplication notifications corrigee** | Clef basee sur `titre-message` au lieu de `id` (deduplication inefficace) |
| **OTDetail lit via storageService** | Remplacait l'acces direct a localStorage par le service dedie |
| **DataTable filtre toujours visible** | Suppression du garde-fou `globalFilter !== undefined` toujours vrai |
| **Sidebar import nettoye** | 3 imports lucide inutilises retires (Settings, Bell) |

### Statistiques de l'audit

| Categorie | Points audites | Corrections apportees | Taux de resolution |
|-----------|:------------:|:-------------------:|:-----------------:|
| Imports inutilises | 19 | 19 | 100% |
| Code mort (non appele) | 5 | 0 (documente) | - |
| Bugs logiques | 5 | 5 | 100% |
| Incoherences de permissions | 4 | 4 | 100% |
| Qualite de code (design patterns) | 10 | 8 | 80% |
| Securite | 2 | 0 (acceptable pour demo) | - |
| UI/UX et coherence visuelle | 9 | 9 | 100% |
| **Total** | **54** | **45** | **83%** |

---

## Apercu

GMAO Enterprise est une application de maintenance industrielle qui couvre l'integralite du cycle de vie de la maintenance :

1. **Gestion du parc** — Equipements, caracteristiques, historique
2. **Ordonnancement** — Ordres de travail, planification, priorisation
3. **Execution** — Interventions technicien, suivi en temps reel
4. **Stock** — Gestion des pieces, mouvements, alertes de reapprovisionnement
5. **Pilotage** — KPI, tableaux de bord par role, rapports exportables

> **Architecture 100% frontend** — Aucun serveur requis. Les donnees sont persistees dans le navigateur (localStorage). Deploiement immediat sur Netlify, Vercel ou GitHub Pages.

---

## Fonctionnalites

### Parcours utilisateur

| Fonctionnalite | Technicien | Resp. Maintenance | Resp. Stock | Direction | Admin |
|---------------|:---------:|:-----------------:|:----------:|:--------:|:-----:|
| Dashboard personnalise | Oui | Oui | Oui | Oui | Oui |
| CRUD equipements | Lecture | Complet | Lecture | Lecture | Complet |
| Creer OT | Partiel | Oui | - | - | Oui |
| Modifier OT | - | Oui | - | - | Oui |
| Cloturer OT | Oui | Oui | - | - | Oui |
| Mouvements stock | - | - | Oui | - | Oui |
| Rapports KPI | Partiel | Complet | Partiel | Complet | Complet |
| Export donnees | - | Oui | - | Oui | Oui |
| Administration | - | - | - | - | Oui |

### Cycles de vie

```
Equipement:  Actif → Maintenance → Panne → Reparation → Actif

OT:          Demande → Planifie → En cours → En attente → Cloture
                                                         → Annule
```

### Indicateurs KPI

- **MTBF** (Mean Time Between Failures) — Fiabilite des equipements
- **MTTR** (Mean Time To Repair) — Efficacite de la maintenance
- **Taux de disponibilite** — Proportion de temps operationnel
- **Ratio PM/CM** — Part de maintenance preventive vs corrective
- **Couts** — Couts pieces et main d'oeuvre par mois
- **Pareto** — Analyse 80/20 des equipements les plus defaillants
- **Periodes** — Analyses glissantes sur 30, 90 ou 365 jours

---

## Architecture

```
Browser (React 18)
  |
  ├── AuthContext       ← Session, login/logout, hash btoa()
  │
  ├── AppContext         ← Donnees globales (equipements, OT, articles, mouvements)
  │   │
  │   └── NotificationContext  ← Polling toutes les 15s, alerts stock/garantie
  │
  ├── Pages (7 modules)  ← Points d'entree par fonction
  │   ├── LoginPage
  │   ├── DashboardPage
  │   ├── EquipementsPage
  │   ├── InterventionsPage
  │   ├── StocksPage
  │   ├── RapportsPage
  │   └── AdminPage
  │
  ├── Components (14)    ← Reutilisables, atomiques
  │   ├── DataTable      ← Tri, filtre, pagination
  │   ├── Modal          ← Fenetre modale generique
  │   ├── StatusBadge    ← Badge de statut colore
  │   ├── ExportButtons  ← PDF, Excel, JSON
  │   ├── KPICard        ← Carte de metrique
  │   ├── Charts         ← OTStatus, Couts, Pareto
  │   └── Illustrations  ← SVG inline decoratifs
  │
  ├── Hooks (4)          ← Logique metier encapsulee
  │   ├── useEquipements
  │   ├── useOrdresTravail
  │   ├── useStocks
  │   └── useKPIs
  │
  └── Utils (6)          ← Couche service
      ├── storageService    ← Abstraction localStorage
      ├── permissions.js    ← Matrice de droits
      ├── kpiCalculations   ← Formules metier
      ├── activityLogger    ← Audit trail
      ├── notifications.js  ← Systeme d'alertes
      └── validators.js     ← Validation formulaires
```

### Flux de donnees

```
[Composant React]
    │
    ▼
[Hook personnalise] ← useMemo, useCallback
    │
    ├── [AppContext] ← Donnees globales (lecture)
    └── [storageService] ← CRUD localStorage
            │
            ▼
        [localStorage] ← Prefixe: gmao_*
```

### Matrice de permissions

Chaque action sur chaque module est controlee par une matrice granulaire :

```javascript
PERMISSIONS = {
  admin: {
    equipements: { consulter: true, creer: true, modifier: true, supprimer: true },
    interventions: { consulter: true, creer: true, modifier: true, supprimer: true, cloturer: true, annuler: true, assigner: true },
    stocks: { consulter: true, creer: true, modifier: true, supprimer: true, mouvement: true },
    rapports: { consulter: true, exporter: true, tous: true },
    administration: { gererUtilisateurs: true, gererSysteme: true, voirLogs: true },
  },
  responsable_maintenance: {
    equipements: { consulter: true, creer: true, modifier: true, supprimer: false },
    interventions: { consulter: true, creer: true, modifier: true, supprimer: false, cloturer: true, annuler: true, assigner: true },
    stocks: { consulter: 'lecture', creer: false, modifier: false, supprimer: false, mouvement: false },
    rapports: { consulter: true, exporter: true, tous: true },
    administration: { gererUtilisateurs: false, gererSysteme: false, voirLogs: false },
  },
  technicien: {
    equipements: { consulter: 'lecture', ... },
    interventions: { consulter: true, creer: 'partiel', cloturer: 'partiel', ... },
    stocks: { consulter: 'lecture', ... },
    rapports: { consulter: 'partiel', ... },
  },
  responsable_stock: { ... },
  direction: { ... },
}
```

Valeurs possibles :
- `true` → Acces complet
- `false` → Acces refuse
- `'lecture'` → Consultation seule
- `'partiel'` → Acces restreint (ex: technicien peut creer une demande d'OT)

---

## Modules

### 1. Equipements
CRUD complet avec filtres par categorie (mecanique, electrique, hydraulique, pneumatique, utilitaires) et statut. Chaque equipement possede :
- Code unique, designation, description
- Categorie, localisation
- Statut (en_service, en_panne, en_maintenance, hors_service)
- Periodicite de maintenance preventive
- Date de garantie avec alerte (30 jours avant expiration)
- Cout d'acquisition

### 2. Interventions (Ordres de Travail)
Machine a etats avec transitions auditees :
- **Demande** → **Planifie** (assignation technicien)
- **Planifie** → **En cours** (debut d'intervention)
- **En cours** → **En attente** (piece manquante)
- **En attente** → **En cours** (reprise)
- **En cours** → **Cloture** (rapport finalise)
- **Planifie** → **Annule**

Types d'OT : correctif, preventif systematique, amelioratif.

### 3. Stocks
- Articles avec reference, designation, unite, categorie
- Niveaux de stock : actuel, minimum, maximum, quantite economique
- Mouvements d'entree/sortie avec tracabilite complete (avant/apres)
- Alertes automatiques pour stock sous seuil
- Valorisation du stock (cout moyen pondere CMUP)

### 4. Rapports & KPI
- Indicateurs MTBF, MTTR, disponibilite
- Graphiques Recharts : barres, lignes, Pareto
- Rapport detaille par equipement
- Export PDF, Excel (SheetJS, jsPDF)
- Filtrage temporel : 30, 90, 365 jours

### 5. Administration
- Gestion des utilisateurs (CRUD, 5 roles)
- Logs d'activite (audit trail complet)
- Parametres systeme
- Export/Import des donnees (backup JSON)

---

## Workflow

### Cycle de developpement

```
1. Analyse des besoins
   ├── Definition des roles (5 profils)
   ├── Cartographie des modules (5 domaines)
   └── Specification des KPI (MTBF, MTTR, dispo, couts)

2. Conception architecturale
   ├── Matrice de permissions
   ├── Machine a etats des OT
   └── Systeme de persistence (storageService)

3. Implementation par module
   ├── Equipements → Interventions → Stocks
   ├── Rapports/KPI → Admin
   └── Dashboard par role

4. Tests et qualite
   ├── Build production (0 erreurs)
   ├── Audit code (54 points)
   └── Corrections et optimisation

5. Documentation
   ├── README.md (workflow, architecture, deploiement)
   └── Rapport architecture (DOCX)

6. Deploiement
   ├── Build Vite → dossier dist/
   ├── netlify.toml (SPA redirect)
   └── Mise en ligne
```

### Commandes

```bash
# Developpement
npm run dev            # Serveur hot-reload (port par defaut: 5173)

# Production
npm run build          # Build -> dist/

# Preview
npm run preview        # Apercu du build de production

# Documentation
npm run generate-doc   # Genere le rapport DOCX (scripts/generate-report.cjs)
```

### Bonnes pratiques

- **Hooks personnalises** pour encapsuler la logique metier
- **Memoisation** (useMemo, useCallback) pour les calculs couteux
- **Service layer** (storageService) isole la couche de persistence
- **Composants atomiques** reutilisables (DataTable, Modal, StatusBadge)
- **Separation des responsabilites** : chaque fichier = un role unique
- **Permissions reactives** : les boutons/actions s'adaptent au role courant

---

## Installation

```bash
# Cloner le depot
git clone <votre-repo>
cd gmao-simplifie

# Installer les dependances
npm install

# Lancer en developpement
npm run dev

# Build production
npm run build
```

### Identifiants de demo

| Role | Identifiant | Mot de passe |
|------|-------------|-------------|
| Administrateur | admin | admin123 |
| Resp. Maintenance | resp.maintenance | mdp123 |
| Technicien | technicien1 | mdp123 |
| Resp. Stock | resp.stock | mdp123 |
| Direction | direction | mdp123 |

---

## Deploiement

### Netlify (recommandé)

1. `npm run build`
2. Uploader le dossier `dist/` sur Netlify
3. Le fichier `netlify.toml` gere automatiquement les routes SPA :
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Alternative : Vercel, GitHub Pages

Le build de production est entierement statique et fonctionne sur tout hebergement de fichiers statiques avec redirection SPA.

---

## Structure du projet

```
gmao-simplifie/
├── public/
│   └── favicon.svg              # Favicon gradient
├── scripts/
│   └── generate-report.cjs      # Generateur DOCX
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── ActivityLogView.jsx
│   │   │   ├── SystemSettings.jsx
│   │   │   └── UserManagement.jsx
│   │   ├── equipements/
│   │   │   ├── EquipementDetail.jsx
│   │   │   └── EquipementForm.jsx
│   │   ├── interventions/
│   │   │   ├── OTDetail.jsx
│   │   │   └── OTForm.jsx
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── rapports/
│   │   │   ├── ChartCouts.jsx
│   │   │   ├── ChartOTStatus.jsx
│   │   │   ├── KPICard.jsx
│   │   │   └── ParetoDefaillances.jsx
│   │   └── shared/
│   │       ├── AlertBanner.jsx
│   │       ├── DataTable.jsx
│   │       ├── ExportButtons.jsx
│   │       ├── Illustrations.jsx
│   │       ├── Modal.jsx
│   │       ├── NotificationCenter.jsx
│   │       ├── SearchBar.jsx
│   │       └── StatusBadge.jsx
│   ├── context/
│   │   ├── AppContext.jsx
│   │   ├── AuthContext.jsx
│   │   └── NotificationContext.jsx
│   ├── data/
│   │   └── seedData.js
│   ├── hooks/
│   │   ├── useEquipements.js
│   │   └── useKPIs.js
│   ├── pages/
│   │   ├── AdminPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── EquipementsPage.jsx
│   │   ├── InterventionsPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RapportsPage.jsx
│   │   └── StocksPage.jsx
│   ├── utils/
│   │   ├── activityLogger.js
│   │   ├── kpiCalculations.js
│   │   ├── notifications.js
│   │   ├── otPreventifGenerator.js
│   │   ├── permissions.js
│   │   ├── storageService.js
│   │   └── validators.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── netlify.toml
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## FAQ

### Comment sont stockees les donnees ?
Toutes les donnees sont persistees dans le `localStorage` du navigateur avec le prefixe `gmao_`. Aucune donnee n'est envoyee a un serveur. Pour migrer vers un backend, il suffit de remplacer les appels a `storageService` par des appels API REST.

### Puis-je exporter mes donnees ?
Oui. La page Admin propose un export JSON complet de toutes les collections. Chaque module dispose egalement de boutons d'export PDF et Excel. La fonction `exportAll()` de `storageService` exporte les 7 collections.

### Comment sont gerees les sessions ?
Les sessions sont stockees dans `localStorage` sous la cle `gmao_session`. A la fermeture du navigateur, la session persiste. La deconnexion supprime la session et redirige vers la page de login.

### Puis-je ajouter un nouveau role ?
Oui. Dans `src/utils/permissions.js`, ajoutez une entree dans `PERMISSIONS` avec les droits souhaitez pour chaque module. Ajoutez egalement le libelle dans `ROLE_LABELS` et la description dans `ROLE_DESCRIPTIONS`. Enfin, parametrez la navigation dans `Sidebar.jsx`.

### Les donnees sont-elles perdues si j'efface le cache ?
Oui. Le localStorage est lie au navigateur et au domaine. Un effacement des donnees de navigation entrainera la perte des donnees. Il est recommande d'exporter regulierement les donnees via la page Administration.

---

## Licence

Ce projet est fourni a titre de demonstration et d'apprentissage. Vous etes libre de l'utiliser, le modifier et le distribuer selon vos besoins.

---

*Document genere le 05/06/2026 — GMAO Enterprise v1.0*
# gmao
