# 🎓 StageTrack – Site Web d'Archivage de Stages
> Projet Web – ING1 | CY Tech | Année 2025-2026

## 📋 Description

Plateforme web de gestion et d'archivage des stages étudiants, permettant aux étudiants, tuteurs, entreprises, jurys et administrateurs d'interagir autour du suivi de stage.

## 👥 Équipe

| Membre | Rôle principal |
|--------|---------------|
| Prénom NOM | Frontend / UX |
| Prénom NOM | Backend / API |
| Prénom NOM | Base de données |
| Prénom NOM | Auth / Sécurité |

## 🛠️ Stack technique

- **Frontend** : HTML5, CSS3, JavaScript + Framework (ex: Vue.js / React)
- **Backend** : PHP / Laravel (ou Node.js)
- **Base de données** : MySQL / PostgreSQL
- **Versioning** : Git / GitLab
- **Gestion de projet** : Trello / Notion + Gantt

## 🚀 Lancer le projet en local

```bash
# Cloner le repo
git clone <url-du-repo>
cd stagetrack

# Installer les dépendances (à adapter selon le stack)
composer install       # PHP
npm install            # JS

# Copier et configurer l'environnement
cp .env.example .env

# Lancer le serveur local
php -S localhost:8000  # ou avec WampServer / XAMPP
```

## 🗂️ Structure du projet

```
stagetrack/
├── public/             # Point d'entrée, assets publics
├── src/
│   ├── views/          # Templates HTML / composants
│   ├── controllers/    # Logique métier
│   ├── models/         # Modèles BDD
│   └── routes/         # Définition des routes
├── database/
│   ├── migrations/     # Scripts de création des tables
│   └── seeds/          # Données de test
├── assets/
│   ├── css/
│   ├── js/
│   └── img/
├── tests/              # Tests unitaires et fonctionnels
├── docs/               # Documentation, wireframes, Gantt
├── .env.example
├── .gitignore
└── README.md
```

## 🔐 Rôles utilisateurs

- **Administrateur** – gestion globale, comptes, offres, notifications
- **Étudiant** – consultation offres, dépôt documents, suivi dossier
- **Tuteur/Professeur** – validation convention, suivi étudiant
- **Entreprise** – dépôt offres, attribution missions
- **Jury** – consultation documents, validation, remarques

## 📌 Branches Git

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour la convention de branches et commits.

## 📄 Licence

Projet académique – CY Tech 2025-2026
