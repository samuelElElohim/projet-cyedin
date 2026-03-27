CREATE TABLE utilisateur (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(15), -- peut etre null pour une entreprise, pareil pour prenom, je prevois qd meme qu'un utilisateur ne s'appelle pas mohamedibnbatotalevoyageur, donc pas besoin de plus de char
    prenom VARCHAR(15),

    email VARCHAR(42) UNIQUE NOT NULL, -- le mail composer du nom.prenom@etu.cyedin.com pour un etudiant, pour une entreprise, nomEntreprise@etre.cyedin.com, un tuteur: nom.prenom@tut.cyden.com, jury: nom.prenom@jury.cyedin.com ???
    -- sinon faut se mettre d'acc sur le format des emails et la maniere de leur generation...

    mot_de_passe TEXT NOT NULL,  -- faut prevoir une methode de cryptage, on stock quoi ducoup? le mdp crypte? decrypte et laisser l'incription au milieu du fetch?

    role VARCHAR(12) NOT NULL, -- enfaite, c'est juste pour pouvoir appeller la classe pour s'avoir si c'est un etudiant, entreprise ...
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    etat_compte BOOLEAN DEFAULT TRUE -- faut prevoir un date d'expiration, et apres une duree une date de suppresion ou bien compression et stockage d'une maniere ou une autre

);


