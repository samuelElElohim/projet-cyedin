-- enfaite ces pour cree un systeme d'alert...
CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lu BOOLEAN DEFAULT FALSE, -- faut le changer qd il devient ouvert ...
    destinataire_id INTEGER REFERENCES utilisateur(id) ON DELETE CASCADE
);
