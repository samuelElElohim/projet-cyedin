CREATE TABLE offre_stage (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    date_publication DATE DEFAULT CURRENT_DATE,
    date_expiration DATE,
    statut VARCHAR(50) DEFAULT 'Ouverte',
    entreprise_id INTEGER REFERENCES entreprise(id) ON DELETE CASCADE
);

CREATE TABLE candidature (
    id SERIAL PRIMARY KEY,
    date_candidature TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(50) DEFAULT 'En attente',
    etudiant_id INTEGER REFERENCES etudiant(id) ON DELETE CASCADE,
    offre_id INTEGER REFERENCES offre_stage(id) ON DELETE CASCADE,
    cv_id INTEGER,  -- on prevoit des cv avec des id separees ou bien avec les meme id des etudiants???
    motivation_id INTEGER  -- meme question
);
