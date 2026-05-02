# ARCHITECTURAL REFERENCE — Projet CYÉdIN
### Laravel 12 + Inertia.js + React — Document de référence technique

---

## 1. STACK TECHNIQUE

| Technologie | Rôle |
|-------------|------|
| **Laravel 12** | Framework backend — routing, ORM Eloquent, middleware, auth, policies |
| **Inertia.js v2** | Pont Laravel ↔ React — envoie les props PHP directement aux composants JSX, zéro API REST |
| **React 19** | Interface utilisateur — hooks, composants, rendu conditionnel |
| **Vite 6** | Bundler — HMR en dev, build production optimisé |
| **PostgreSQL** | Base de données relationnelle |
| **Tailwind CSS 3.4** | CSS utilitaire — pas de CSS custom sauf cas exceptionnels |
| **Ziggy 2** | Partage les noms de routes Laravel vers JavaScript — `route('etudiant.offres')` dans React |
| **PHPOffice/PHPSpreadsheet** | Import CSV/XLSX pour création en masse d'utilisateurs |

**Pourquoi Inertia plutôt qu'une API REST ?**
Session unique, validation serveur directe vers les composants, gestion du CSRF automatique, pas de double authentification à gérer.

---

## 2. RÔLES UTILISATEURS

| Rôle | Code | Middleware | Espace |
|------|------|-----------|--------|
| Administrateur | A | `auth`, `role:A` | `/admin/*` |
| Étudiant | S | `auth`, `role:S`, `ForcePremierMotDePasse` | `/etudiant/*` |
| Entreprise | E | `auth`, `role:E` | `/entreprise/*` |
| Tuteur | T | `auth`, `role:T` | `/tuteur/*` |
| Jury | J | `auth`, `role:J` | `/jury/*` |

**Administrateur** — Crée tous les utilisateurs, active les offres, valide les entreprises, gère la hiérarchie Filière/Secteur/Tag, visualise les traces, archive et remet à zéro l'année académique.

**Étudiant** — Consulte les offres, postule, confirme une offre acceptée (crée le stage), dépose des documents, tient son cahier de stage, signe la convention.

**Entreprise** — Publie des offres (inactives par défaut, activées par l'admin), accepte/refuse les candidatures, signe la convention, assigne des missions (remarques) au stage.

**Tuteur** — Suit ses étudiants (many-to-many), visualise le cahier et les documents, signe la convention.

**Jury** — Lit les dossiers de stage, valide ou invalide, ajoute des remarques.

---

## 3. MODÈLE DE DONNÉES

### Groupe : Utilisateurs

```
Utilisateur (utilisateurs)
  id, nom, prenom, email, mot_de_passe, role (A/S/T/E/J),
  est_active, premier_mdp_changer
  ↳ hasOne → Administrateur | Etudiant | Tuteur | Entreprise | Jury

Etudiant (etudiants)          PK = utilisateurs_id
  filiere_id, niveau_etud, chemin_cv, nom_cv
  ↳ belongsTo  Filiere
  ↳ hasMany    Stage          (via etudiants_id)
  ↳ hasOne     Dossier_stage
  ↳ belongsToMany Tuteur      (pivot: tuteur_etudiant)

Tuteur (tuteurs)              PK = utilisateurs_id
  filiere_id
  ↳ hasMany    Stage          (via tuteurs_id)
  ↳ belongsToMany Etudiant    (pivot: tuteur_etudiant)
  ↳ belongsToMany Secteur     (pivot: tuteur_secteurs)

Entreprise (entreprises)
  nom_entreprise, addresse
  ↳ hasMany    Offre
  ↳ hasMany    Stage
  ↳ belongsToMany Filiere / Secteur
```

### Groupe : Workflow stage

```
Offre (offres)
  titre, description, entreprise_id, filiere_id, secteur_id,
  duree_semaines, dateDebut, est_active (false par défaut)
  ↳ belongsToMany Tag        (pivot: offres_tags)
  ↳ hasMany Candidature

Candidature (candidatures)
  etudiant_id, offre_id, statut*, chemin_cv, chemin_lettre, deadline_choix
  * statuts: en_attente → accepted_pending_choice → acceptee / refusee / annulee

Stage (stages)
  sujet, etudiants_id, entreprises_id, tuteurs_id,
  duree_en_semaine, dateDebut, etat**
  ** etat: en_attente_convention → actif
  ↳ hasOne    Convention_stage
  ↳ morphMany Remarque       ('stage')

Convention_stage (convention_stages)   PK = stages_id
  signer_par_etudiant (bool)
  signer_par_tuteur   (bool)
  signer_par_entreprise (bool)
  ↳ estComplete()           → retourne true si les 3 bools sont vrais
  ↳ activerStageIfComplete() → stage.etat='actif' + dossier auto-validé

Dossier_stage (dossier_stages)
  etudiants_id, est_valide, date_soumission
  ↳ belongsToMany Document  (pivot: dossier_documents)
  ↳ morphMany Remarque      ('dossier_stage')
```

### Groupe : Documents & suivi

```
Document (documents)
  utilisateurs_id, nom, type (MIME), categorie (cv/lettre/convention/autre),
  chemin_fichier
  ↳ Stocké dans storage/app/documents/{user_id}/

CahierStage (cahier_stages)
  etudiant_id, date_entree, titre, contenu,
  visible_tuteur (bool), visible_jury (bool)

Remarque (remarques)  — POLYMORPHIQUE
  auteur_id, cible_type ('stage' | 'dossier_stage'), cible_id,
  contenu, est_visible_etudiant, est_visible_entreprise
  ↳ morphTo('cible') → Stage | Dossier_stage

Notification (notifications)
  proprietaire_id, message, date_envoi, est_lu (bool)
```

### Groupe : Hiérarchie

```
Filiere → hasMany Secteur → hasMany Tag
Secteur ↔ Tuteur, Entreprise (many-to-many)
Tag     ↔ Offre              (many-to-many)
DemandeHierarchie — suggestions utilisateurs, approuvées par admin
```

---

## 4. LE FLUX MÉTIER PRINCIPAL

```
[Admin crée utilisateurs]
         ↓
[Entreprise publie Offre]  →  est_active = false
         ↓
[Admin active l'Offre]     →  est_active = true
         ↓
[Étudiant postule]         →  Candidature { statut = 'en_attente' }
         ↓
[Entreprise accepte]       →  statut = 'accepted_pending_choice'
                               deadline_choix = now() + 7 jours
         ↓
[Étudiant confirme < 7j]   ──── DB::transaction() ──────────────────
     │   Stage          { etat = 'en_attente_convention' }
     │   Convention_stage { 3 × false }
     │   Dossier_stage  { est_valide = false }
     │   Candidature    { statut = 'acceptee' }
     │   Autres candidatures → 'annulee'
     └───────────────────────────────────────────────────────────────
         ↓
[3 parties signent la convention]  ← ConventionService::sign()
     │   Chaque signature  →  notification aux 2 autres parties
     │   Dès que les 3 signent → activerStageIfComplete()
     │       Stage.etat = 'actif'
     │       Dossier_stage.est_valide = true
     └───────────────────────────────────────────────────────────────
         ↓
[Stage actif : étudiant travaille]
     │   Cahier de stage (entrées quotidiennes/hebdo)
     │   Documents déposés (convention PDF, rapports...)
     │   Remarques/missions du tuteur & entreprise
     └───────────────────────────────────────────────────────────────
         ↓
[Jury valide le dossier]   →  notification étudiant "Dossier validé !"
         ↓
[Admin archive l'année]    →  JSON snapshot + reset tables opérationnelles
```

---

## 5. ARCHITECTURE MVC APPLIQUÉE AU PROJET

### M — Modèles (app/Models/)

Les modèles représentent les entités métier. Patterns notables :

**Polymorphisme** (`Remarque`) — `morphMany` sur `Stage` et `Dossier_stage`, morphMap enregistré dans `AppServiceProvider` avec des clés courtes (`'stage'`, `'dossier_stage'`). Permet un système de commentaires partagé sans tables dupliquées.

**Mutateur** (`Utilisateur::setMotDePasseAttribute`) — centralise le hashage du mot de passe. Assigner `mot_de_passe = 'valeur'` le hash automatiquement si ce n'est pas déjà un hash bcrypt/argon.

**Scopes** — `Dossier_stage::valide()`, `Candidature::enAttente()`, `Remarque::visibleParEtudiant()`. Rendent les requêtes lisibles et chainables.

**Logique domaine dans les modèles** — `Convention_stage::estComplete()`, `activerStageIfComplete()`, `Candidature::isExpired()`, `joursRestants()`.

**Clés primaires non-standard** — `Etudiant`, `Tuteur`, `Administrateur` ont `utilisateurs_id` comme PK (non auto-incrémenté), reflétant la relation 1-to-1 obligatoire avec `Utilisateur`.

---

### V — Vues (React via Inertia)

Inertia remplace les templates Blade. Le contrôleur appelle :

```php
return Inertia::render('Etudiant/etudiant.offres', [
    'offres' => $offres,
    'stash'  => $stash,
]);
```

Le composant React reçoit directement les props PHP :

```jsx
export default function EtudiantOffres({ offres, stash }) {
    // offres et stash sont déjà hydratés, pas de fetch() nécessaire
}
```

**Layouts** — Un layout par rôle (`EtudiantLayout`, `AdminLayout`, etc.) qui encapsule la navigation latérale. Le composant de page choisit son layout.

**Props partagées** via `HandleInertiaRequests` (middleware Inertia) — disponibles sur toutes les pages via `usePage().props` :

| Prop | Contenu |
|------|---------|
| `auth.user` | Utilisateur connecté |
| `notifications` | 20 dernières notifications non lues |
| `etudiant_flags` | `{ has_stage, convention_complete, dossier_valide }` |

**Ziggy** — `route('admin.index.user')` en React génère l'URL correcte. Aucune URL hardcodée côté front.

---

### C — Contrôleurs (app/Http/Controllers/)

Organisation par domaine et rôle :

| Contrôleur | Responsabilité |
|-----------|---------------|
| `AdminDashboardController` | Dashboard admin : stats et alertes en attente |
| `Admin/AdminUserController` | CRUD utilisateurs |
| `Admin/AdminOffreController` | Activation des offres |
| `Admin/AdminEntrepriseController` | Validation des entreprises |
| `Admin/AdminDossierController` | Toggle validation dossier |
| `Admin/AdminStageController` | Suivi des stages |
| `Admin/AdminTraceController` | Logs, archives, reset annuel |
| `Admin/AdminHierarchieController` | CRUD Filière/Secteur/Tag |
| `EtudiantDashboardController` | Dashboard, offres, candidatures, dossier, cahier |
| `EntrepriseDashboardController` | Dashboard, offres, candidatures, stages, missions |
| `TuteurDashboardController` | Dashboard, étudiants, cahier, convention |
| `JuryDashboardController` | Dashboard, dossiers, validation |
| `CandidatureController` | Postuler, accepter, refuser, confirmer (multi-rôle) |
| `DocumentController` | Upload, download, portfolio |
| `RemarqueController` | Créer/supprimer commentaires polymorphes |
| `DemandeHierarchieController` | Suggestions + approbation admin |

---

### S — Services (app/Services/)

Les services extraient la logique métier complexe ou réutilisée hors des contrôleurs.

**`ConventionService`** — Centralise la signature de convention :

- `sign($stage, $role, $signerId)` — met à jour le flag, appelle `activerStageIfComplete()`, envoie les notifications, log la trace. Retourne `'signed'` ou `'already_signed'`.
- `status($convention)` — construit le tableau `['etudiant'=>bool, 'tuteur'=>bool, 'entreprise'=>bool, 'complete'=>bool]` utilisé dans 4 contrôleurs.

**`TraceLogger`** — Audit trail :

- `log($action, $context)` — écrit dans `storage/logs/trace.log`
- `tail($n)` — lit les N dernières lignes pour la vue admin

Format d'une ligne de trace :
```
[2026-05-02 14:23:45] user:5 role:S ip:192.168.1.100 | store_candidature | {"etudiant_id":5,"offre_id":12}
```

---

### P — Policies (app/Policies/)

Autorisations au niveau de l'objet, enregistrées dans `AppServiceProvider` via `Gate::policy()`.

**`CandidaturePolicy`** :

- `view` → admin OU étudiant propriétaire OU entreprise concernée
- `destroy` → propriétaire ET statut = `en_attente` seulement

**`DocumentPolicy`** :

- `delete` → admin OU propriétaire
- `download` → admin OU propriétaire OU rôle=E (entreprise peut télécharger les CVs des candidatures)

---

## 6. SÉCURITÉ ET AUTHENTIFICATION

**Login** — Session Laravel classique, garde `web`. Champ custom `mot_de_passe` au lieu de `password` (`getAuthPassword()` overridé dans `Utilisateur`).

**Premier mot de passe** — Middleware `ForcePremierMotDePasse` intercepte toute requête authentifiée et redirige vers `/password/premier` si `premier_mdp_changer = false`. L'admin crée les comptes avec le mot de passe "password", l'utilisateur doit en choisir un vrai à la première connexion.

**Protection des routes** — Double garde : `auth` (connecté) + `role:X` (bon rôle) + `est_active = true` (compte actif). Une entreprise non encore validée est redirigée vers une page d'attente.

**CSRF** — Géré automatiquement par Inertia (header `X-XSRF-TOKEN`).

**Fichiers hors web root** — Documents stockés dans `storage/app/` (inaccessibles directement), servis uniquement via `DocumentController::download()` après vérification des droits.

**HTTPS forcé en production** — `URL::forceScheme('https')` dans `AppServiceProvider::boot()`.

**Hashage centralisé** — Mutateur `setMotDePasseAttribute()` vérifie si la valeur est déjà un hash bcrypt/argon avant de hasher, évitant le double-hashage.

---

## 7. STRUCTURE DES FICHIERS CLÉS

```
app/
├── Http/Controllers/
│   ├── AdminDashboardController.php      ← dashboard stats seulement (42 lignes)
│   ├── Admin/                            ← 7 contrôleurs admin ciblés
│   │   ├── AdminUserController.php
│   │   ├── AdminOffreController.php
│   │   ├── AdminEntrepriseController.php
│   │   ├── AdminDossierController.php
│   │   ├── AdminStageController.php
│   │   ├── AdminTraceController.php
│   │   └── AdminHierarchieController.php
│   ├── EtudiantDashboardController.php
│   ├── EntrepriseDashboardController.php
│   ├── TuteurDashboardController.php
│   ├── JuryDashboardController.php
│   ├── CandidatureController.php         ← multi-rôle
│   ├── DocumentController.php
│   ├── RemarqueController.php
│   └── Auth/                             ← login, 2FA, premier mdp
├── Models/                               ← 17 modèles Eloquent
│   ├── Utilisateur.php                   ← base auth
│   ├── Etudiant / Tuteur / Entreprise / Administrateur / Jury.php
│   ├── Stage.php
│   ├── Convention_stage.php              ← machine à états
│   ├── Dossier_stage.php
│   ├── Offre / Candidature.php
│   ├── Document / CahierStage.php
│   ├── Remarque.php                      ← polymorphique
│   ├── Notification.php
│   └── Filiere / Secteur / Tag / DemandeHierarchie.php
├── Services/
│   ├── ConventionService.php             ← signature + notifications
│   └── TraceLogger.php                   ← audit trail
├── Policies/
│   ├── CandidaturePolicy.php
│   └── DocumentPolicy.php
└── Providers/AppServiceProvider.php      ← morphmap, policies, HTTPS

routes/
├── web.php                               ← 130 routes, 5 groupes par rôle
└── auth.php                              ← login, register, 2FA, reset

resources/js/
├── Pages/                                ← ~35 composants JSX (1 par page)
│   ├── Etudiant/    (dashboard, offres, candidatures, dossier, cahier)
│   ├── Admin/       (dashboard, users, offres, stages, dossiers, trace)
│   ├── Entreprise/  (dashboard, offres, candidatures, stages)
│   ├── Tuteur/      (dashboard, étudiants, cahier)
│   └── Jury/        (dashboard, dossiers, validation)
└── Layouts/                              ← 1 layout par rôle

storage/app/
├── documents/{user_id}/                  ← fichiers hors web root
├── archives/                             ← snapshots JSON annuels
└── logs/trace.log                        ← audit trail append-only
```

---

## 8. POINTS TECHNIQUES NOTABLES POUR LA SOUTENANCE

### 1. Machine à états — Convention tripartite
3 booléens indépendants (`signer_par_etudiant`, `signer_par_tuteur`, `signer_par_entreprise`). Activation automatique quand tous vrais via `activerStageIfComplete()`. Aucune intervention manuelle d'un admin requise pour passer le stage à `actif`.

### 2. Polymorphisme — Remarque
Un seul modèle `Remarque` commente soit un `Stage`, soit un `Dossier_stage`. Les flags de visibilité (`visible_etudiant`, `visible_entreprise`) créent des vues filtrées de la même donnée selon le rôle.

```php
// Créer une mission (remarque sur stage)
Remarque::create([
    'auteur_id'             => auth()->id(),
    'cible_type'            => 'stage',
    'cible_id'              => $stage->id,
    'contenu'               => 'Mission : ...',
    'est_visible_etudiant'  => true,
    'est_visible_entreprise'=> true,
]);

// Lire les remarques visibles par l'étudiant
$stage->remarques()->where('est_visible_etudiant', true)->get();
```

### 3. Transaction DB — Confirmation de candidature
La confirmation crée 3 enregistrements liés (Stage, Convention_stage, Dossier_stage) dans un seul `DB::transaction()`. Si l'un échoue, rien n'est créé et la base reste cohérente.

### 4. Inertia vs API REST
Un seul aller-retour HTTP, session partagée, pas de JWT, validation serveur → erreurs directement dans les composants React. Choix pragmatique qui réduit la complexité architecturale pour un projet monolithique.

### 5. TraceLogger — Audit trail
Chaque action significative est logguée avec user, rôle, IP, timestamp. Exportable par l'admin. Sert à la fois pour le débogage et pour justifier les actions en cas de litige.

### 6. Reset annuel
`AdminTraceController::resetAnnee()` crée un snapshot JSON complet de l'année avant de vider les tables opérationnelles (`candidatures`, `stages`, `dossiers`, etc.). L'historique reste consultable à tout moment sans alourdir la base de données active.

### 7. Stash documents & candidature
Les étudiants maintiennent un portefeuille de documents (max 4 hors convention). À la candidature, ils choisissent leur CV parmi : CV principal, document du stash, ou nouveau fichier. La résolution de fichier se fait côté serveur dans `CandidatureController::store()`.

### 8. Ziggy — Cohérence front/back des routes
`resources/js/ziggy.js` est généré par `php artisan ziggy:generate`. React utilise `route('nom.route')` exactement comme PHP. Renommer une route côté Laravel se répercute automatiquement côté front.

---

## GLOSSAIRE

| Terme | Définition |
|-------|-----------|
| **Stage** | L'enregistrement central de l'alternance/stage (lien étudiant-entreprise-tuteur) |
| **Convention** | Accord tripartite signé électroniquement avant que le stage ne devienne actif |
| **Dossier** | Dossier de soumission de l'étudiant contenant les documents et la convention |
| **Offre** | Annonce publiée par une entreprise, activée par l'admin |
| **Candidature** | Candidature d'un étudiant à une offre, avec son CV et lettre |
| **Cahier** | Journal de bord du stage (entrées quotidiennes/hebdo) |
| **Remarque** | Commentaire polymorphe sur un Stage ou Dossier (missions, feedback jury) |
| **Filière** | Parcours académique (ex. Informatique) |
| **Secteur** | Spécialisation dans une filière (ex. Web/Mobile) |
| **Tag** | Compétence/technologie associée aux offres (ex. React, Docker) |
| **TraceLogger** | Service d'audit trail — log toutes les actions importantes dans un fichier |
| **Stash** | Portefeuille de documents de l'étudiant réutilisables lors des candidatures |
| **Inertia** | Middleware JS/PHP qui remplace les appels API par un partage direct de props |

---

*Document généré le 2 mai 2026 — Projet CYÉdIN, CY Tech*
