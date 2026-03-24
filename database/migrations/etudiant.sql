CREATE TABLE etudiant (
    id INTEGER PRIMARY KEY REFERENCES utilisateur(id) ON DELETE CASCADE,
    filiere VARCHAR(5) NOT NULL,
    niveauEtud INTEGER(1) NOT NULL
    -- Document et Stage seront dans une table separee, donc pas besoin de stocker le cv, puisque le cv est un doc..., ainsi que les docs administratifs
);
