<?php

namespace App\Policies;

use App\Models\Candidature;
use App\Models\Utilisateur;

class CandidaturePolicy
{
    public function view(Utilisateur $user, Candidature $candidature): bool
    {
        return $user->role === 'A'
            || $candidature->etudiant_id === $user->id
            || $candidature->offre?->entreprise?->utilisateur_id === $user->id;
    }

    public function destroy(Utilisateur $user, Candidature $candidature): bool
    {
        return $candidature->etudiant_id === $user->id
            && $candidature->statut === 'en_attente';
    }
}
