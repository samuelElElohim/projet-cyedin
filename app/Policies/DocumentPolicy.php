<?php

namespace App\Policies;

use App\Models\Document;
use App\Models\Utilisateur;

class DocumentPolicy
{
    public function delete(Utilisateur $user, Document $document): bool
    {
        return $user->role === 'A'
            || $document->utilisateur_id === $user->id;
    }

    public function download(Utilisateur $user, Document $document): bool
    {
        // Owner, admin, or an entreprise that received it as part of a candidature
        return $user->role === 'A'
            || $document->utilisateur_id === $user->id
            || $user->role === 'E';
    }
}
