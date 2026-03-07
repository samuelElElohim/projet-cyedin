# Guide de Contribution – Convention Git

## Stratégie de branches (Git Flow simplifié)

```
main
 └── develop
      ├── feature/nom-de-la-feature
      ├── fix/nom-du-bug
      └── docs/nom-de-la-doc
```

### Branches principales

| Branche | Rôle |
|---------|------|
| `main` | Code stable, **prêt pour la démo/soutenance**. On ne push jamais directement dessus. |
| `develop` | Branche d'intégration. Toutes les features mergent ici d'abord. |

### Branches de travail

| Préfixe | Usage | Exemple |
|---------|-------|---------|
| `feature/` | Nouvelle fonctionnalité | `feature/auth-login` |
| `fix/` | Correction de bug | `fix/upload-rapport` |
| `docs/` | Documentation uniquement | `docs/readme-update` |
| `style/` | CSS / UI sans logique | `style/responsive-navbar` |
| `db/` | Migrations, modèles BDD | `db/table-stages` |

## 📝 Convention de commits (Conventional Commits)

Format : `type(scope): message court en français ou anglais`

### Types

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation |
| `style` | Mise en forme (pas de logique) |
| `refactor` | Refacto sans ajout de feature |
| `test` | Ajout ou modif de tests |
| `chore` | Tâche technique (config, deps…) |
| `db` | Base de données |

### Exemples

```
feat(auth): ajout de la connexion étudiant
fix(upload): correction du bug sur le dépôt de rapport PDF
docs(readme): mise à jour de la section installation
db(migration): création de la table offres_stages
style(dashboard): responsive mobile du dashboard tuteur
```

## Workflow pour contribuer

```bash
# 1. Se mettre à jour depuis develop
git checkout develop
git pull origin develop

# 2. Créer sa branche
git checkout -b feature/ma-feature

# 3. Travailler, committer régulièrement
git add .
git commit -m "feat(scope): description claire"

# 4. Push et ouvrir une Merge Request vers develop
git push origin feature/ma-feature
```

## Merge Request (MR)

- Toujours merger vers `develop`, jamais vers `main` directement
- Le titre de la MR doit décrire ce qu'elle apporte
- Faire relire par au moins **1 autre membre** avant de merger
- `main` ← `develop` uniquement en fin de sprint ou pour la démo

## À ne jamais faire

- `git push --force` sur `main` ou `develop`
- Committer des fichiers `.env` ou credentials
- Des commits vides ou avec message `"fix"`, `"test"`, `"aaa"`
