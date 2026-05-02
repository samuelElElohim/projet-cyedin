# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**StageTrack** — a multi-stakeholder internship management platform for CY Tech students, built with Laravel 12 + Inertia.js + React 19. Production: https://projet-cyedin-production.up.railway.app/

## Commands

```bash
# First-time setup (copies .env, migrates, installs deps, builds)
composer setup

# Development (starts Laravel dev server + queue + log watcher + Vite, all concurrently)
composer dev

# Tests
composer test          # php artisan test with cache clear
php artisan test --filter TestClassName   # single test

# Frontend only
npm run dev            # Vite HMR server
npm run build          # Production build

# Database
php artisan migrate
php artisan migrate:fresh --seed   # reset + seed test data
php artisan db:seed
```

## Architecture

### Inertia.js Bridge
There is **no separate REST API**. Laravel controllers return `Inertia::render('PageName', $props)` which maps directly to React pages in `resources/js/Pages/`. Axios is used only for form submissions. Shared data (auth user, flash messages) is passed via `HandleInertiaRequests` middleware (`app/Http/Middleware/HandleInertiaRequests.php`).

### Role System
Users have a single-char `role` in the `utilisateurs` table:
- `A` = Admin
- `S` = Etudiant (student)
- `T` = Tuteur (company tutor)
- `E` = Entreprise (company)
- `J` = Jury

`RoleMiddleware` (`app/Http/Middleware/RoleMiddleware.php`) guards routes. Routes are prefixed by role: `/admin/`, `/etudiant/`, `/entreprise/`, `/tuteur/`, `/jury/`.

`ForcePremierMotDePasse` middleware redirects first-time logins to a mandatory password change.

### Key Domain Models (`app/Models/`)
- `Utilisateur` — base user (all roles extend this conceptually)
- `Etudiant`, `Entreprise`, `Tuteur`, `Jury`, `Administrateur` — role-specific profile models
- `Offre` — job offer posted by `Entreprise`
- `Candidature` — application linking `Etudiant` ↔ `Offre`
- `Stage` — accepted internship (created from `Candidature`)
- `Convention_stage` — internship agreement document
- `CahierStage` — logbook for the internship period
- `Secteur`, `Tag` — categorization for offers/filieres

### Frontend Structure (`resources/js/`)
Pages mirror the role hierarchy: `Pages/Admin/`, `Pages/Etudiant/`, `Pages/Entreprise/`, `Pages/Tuteur/`, `Pages/Jury/`, `Pages/Auth/`.

Path alias `@/` resolves to `resources/js/`. Use it for all imports.

Reusable UI lives in `resources/js/Components/UI/` and `resources/js/Components/Shared/`.

### File Uploads
Documents are uploaded and managed through `DocumentController`. Files stored via Laravel's storage system. `PHPOffice/PhpSpreadsheet` handles CSV/XLSX bulk user import in `AdminDashboardController`.

### Queue & Notifications
Queue driver is `database`. Run `php artisan queue:listen` (included in `composer dev`). Mail driver is `log` in development.

## Git Workflow

Follows Git Flow with Conventional Commits (see `CONTRIBUTING.md`):
- Branches: `feature/`, `fix/`, `chore/`, `docs/`
- Base branch for PRs: `develop` (not `main`)
- Commit format: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`

## Deployment

Deployed on Railway via `nixpacks.toml`. Build runs `composer install --no-dev && npm run build`. Start runs `php artisan migrate --force && php artisan serve`. No separate build step needed locally for production testing — `npm run build` output is served by Laravel.
