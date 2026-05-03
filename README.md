# StageTrack – Plateforme de gestion des stages
> Projet Web – ING1 | CY Tech | Année 2025-2026

## Description

Plateforme multi-rôles de gestion et de suivi des stages étudiants : dépôt d'offres, candidatures, conventions, cahier de stage, documents et notifications.

**Production** : https://projet-cyedin-production.up.railway.app/ (ne marche plus)

## Equipe

| Membre | Rôle principal |
|--------|---------------|
| Franck BAZOGE--COVILLE | Frontend / UX |
| Samuel BOUCHERON SEGUIN | Backend / Auth |
| Younes FIKRI | Base de données |

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 19 + Inertia.js |
| Backend | Laravel 12 (PHP 8.2+) |
| Base de données | PostgreSQL |
| Build | Vite |
| Styles | Tailwind CSS v4 |
| Versioning | Git / GitLab |

## Prérequis

- PHP >= 8.2 avec les extensions `pdo_pgsql`, `mbstring`, `openssl`, `tokenizer`
- Composer >= 2
- Node.js >= 18 + npm
- PostgreSQL >= 14 — une base de données créée et accessible

## Lancer le projet en local

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd projet-cyedin
```

### 2. Configurer l'environnement

```bash
cp .env.example .env
```

Ouvrir `.env` et renseigner les identifiants PostgreSQL :

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=cyedin-db      # nom de votre base
DB_USERNAME=               # votre utilisateur PostgreSQL
DB_PASSWORD=               # votre mot de passe PostgreSQL
```

### 3. Installation complète (une seule commande)

```bash
composer setup
```

Cette commande enchaîne automatiquement : `composer install`, génération de la clé d'app, migrations, et `npm install`.

### 4. Charger des données de test

```bash
php artisan migrate:fresh --seed
```

### 5. Lancer le serveur de développement

```bash
composer dev
```
Ou bien : 
```bash
npm run dev (dans un terminal)
php artisan serve (dans un autre)
```
Démarre en parallèle : serveur Laravel (`localhost:8000`), Vite (HMR), queue worker et log watcher.

L'application est disponible sur **http://localhost:8000**.

### 6. Ouvrir l'authentification à 2 facteurs
```bash
tail -f storage/logs/laravel.log | grep "2FA"
```

## Structure du projet

```
projet-cyedin/
├── app/
│   ├── Http/Controllers/   # Contrôleurs par rôle (Etudiant, Tuteur, Entreprise…)
│   ├── Models/             # Modèles Eloquent (Etudiant, Stage, Offre…)
│   ├── Services/           # Logique métier (ConventionService…)
│   └── Http/Middleware/    # Auth, rôles, premier mot de passe
├── database/
│   ├── migrations/         # Schéma de base de données
│   └── seeders/            # Données de test
├── resources/
│   ├── js/
│   │   ├── Pages/          # Pages React par rôle (Etudiant/, Tuteur/, Admin/…)
│   │   ├── Components/     # Composants réutilisables (UI/, Shared/)
│   │   └── Layouts/        # Layouts par rôle
│   └── views/              # Template Blade racine (app.blade.php)
├── routes/
│   └── web.php             # Toutes les routes (groupées par rôle)
├── .env.example
└── README.md
```

## Rôles utilisateurs

| Rôle | Accès |
|------|-------|
| Administrateur (`A`) | Gestion globale : comptes, offres, imports CSV, notifications |
| Etudiant (`S`) | Offres, candidatures, documents, cahier de stage |
| Tuteur (`T`) | Suivi étudiant, signature convention, remarques, cahier |
| Entreprise (`E`) | Dépôt d'offres, gestion des candidatures |
| Jury (`J`) | Consultation dossiers, validation, notes |

## Branches Git

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour la convention de branches et commits.

---

Projet académique – CY Tech 2025-2026
