CREATE TABLE stage (
    id SERIAL PRIMARY KEY,
    sujet TEXT NOT NULL,
    date_debut DATE,
    date_fin DATE,
    statut INTEGER(1), -- meme qst que dans le dossier_stage ... -1 0 1 ou bien un bool direct.
    etudiant_id INTEGER REFERENCES etudiant(id),
    entreprise_id INTEGER REFERENCES entreprise(id),
    tuteur_id INTEGER REFERENCES tuteur(id)
);

CREATE TABLE convention_stage (
    id SERIAL PRIMARY KEY,
    stage_id INTEGER UNIQUE REFERENCES stage(id) ON DELETE CASCADE,
    date_creation DATE DEFAULT CURRENT_DATE,
    statut VARCHAR(50),
    signature_entreprise BOOLEAN DEFAULT FALSE,
    signature_tuteur BOOLEAN DEFAULT FALSE,
    signature_etudiant BOOLEAN DEFAULT FALSE
);
