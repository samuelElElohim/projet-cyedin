CREATE TABLE admin (
    id INTEGER PRIMARY KEY REFERENCES utilisateur(id) ON DELETE CASCADE,
    niveau_acces INTEGER DEFAULT 1, -- je vois pas quoi l'dmin aurra comme atributs? sinon un niveau d'access comme j'avais propose. pour au moins avoir un super-admin qui peut hiroshima le site.
    derniere_action_log TIMESTAMP
);
