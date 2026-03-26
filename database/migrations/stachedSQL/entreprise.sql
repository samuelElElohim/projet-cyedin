CREATE TABLE entreprise (
    id INTEGER PRIMARY KEY REFERENCES utilisateur(id) ON DELETE CASCADE,
    nom_entreprise VARCHAR(50) NOT NULL,
    adresse TEXT,
    secteur VARCHAR(100)

    -- les  offreStages et les stagiaires dans cette seront des jointures de table
);
