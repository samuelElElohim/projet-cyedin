--Structure des Fichiers SQL

Les fichiers doivent etre executes dans l'ordre suivant pour respecter les dependances :

utilisateur.sql : Cree la table de base avec l'id, le nom, le prenom, l'email, le mot de passe, le role et la date de creation.

etudiant.sql : Ajoute les infos specifiques comme la filiere, le niveau d'etude et le lien vers son dossier de stage.

entreprise.sql : Ajoute le nom de l'entreprise, l'adresse et le secteur d'activite.

tuteur.sql : Contient le departement du tuteur et la liste des etudiants qu'il suit.

admin.sql : Table pour les administrateurs qui gerent les profils et les publications.

offres_candidatures.sql : Gere les offres de stage (titre, description, dates) et les candidatures des etudiants.

documents_et_dossiers.sql : Permet de stocker les fichiers comme le CV ou la lettre de motivation et de valider les dossiers.

stage_et_convention.sql : Gere le stage final (sujet, dates) et les signatures de la convention par l'etudiant, le tuteur et l'entreprise.

notifications.sql : Gere l'envoi de messages aux utilisateurs et le suivi des messages lus.





--Points Importants

Heritage : Les tables etudiant, entreprise, tuteur et admin utilisent l'ID de la table utilisateur comme cle primaire.

Cas de l'entreprise : Pour une entreprise, les champs nom et prenom de la table utilisateur peuvent rester vides (null), car le nom de la societe est stocke dans sa propre table.

Signatures : La convention de stage ne peut etre validee que si les trois cases de signature (etudiant, tuteur, entreprise) sont vraies.

Nettoyage : Les notifications sont concues pour etre effacees automatiquement apres un certain temps ou quand elles deviennent trop nombreuses.





--Installation

Pour installer la base de donnees, utilisez un client PostgreSQL et importez les fichiers .sql un par un en respectant la numerotation des noms de fichiers.
