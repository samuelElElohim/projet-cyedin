CREATE TABLE tuteur (
    id INTEGER PRIMARY KEY REFERENCES utilisateur(id) ON DELETE CASCADE,
    departement VARCHAR(15) NOT NULL,
    -- les listes etudiantSuivis et rapports necessitent des tables de liaison, ou des cles etrangeres dans les tables 'etudiant' et 'rapport'. A voir
    date_affectation DATE DEFAULT CURRENT_DATE
);
