<?php

namespace App\Services;

use App\Models\Offre;
use App\Models\Etudiant;
use App\Models\Notification;

class OffreService
{
    public function notifierEtudiants(Offre $offre, array $tagIds): void
    {
        $etudiants = Etudiant::whereHas('centresInteret', function ($query) use ($tagIds) {
            $query->whereIn('tags.id', $tagIds);
        })->get();

        $notifications = $etudiants->map(fn($etudiant) => [
            'proprietaire_id' => $etudiant->utilisateurs_id,
            'offre_id'        => $offre->id,
            'message'         => "Une nouvelle offre correspond à vos centres d'intérêt : « {$offre->titre} »",
            'date_envoi'      => now(),
            'est_lu'          => false,
        ])->toArray();

        if (!empty($notifications)) {
            Notification::insert($notifications);
        }
    }
}