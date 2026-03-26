CREATE TABLE document (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    date_depot TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    chemin_fichier TEXT NOT NULL,
    proprietaire_id INTEGER REFERENCES utilisateur(id) ON DELETE CASCADE
);

CREATE TABLE dossier_stage (
    id SERIAL PRIMARY KEY,
    statut_validation INTEGER(1), -- soit on prevois -1 pour non valider, 0 en cours de validation et 1 pour valider. sinon un boolean vrai ou faux direct?
    date_soumission TIMESTAMP,
    etudiant_id INTEGER UNIQUE REFERENCES etudiant(id) ON DELETE CASCADE
);

CREATE TABLE dossier_documents (
    dossier_id INTEGER REFERENCES dossier_stage(id) ON DELETE CASCADE,
    document_id INTEGER REFERENCES document(id) ON DELETE CASCADE,
    PRIMARY KEY (dossier_id, document_id)
);
