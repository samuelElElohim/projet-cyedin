<?php

namespace App\Services;

use App\Models\Offre;
use App\Models\Etudiant;
use App\Models\Utilisateur;
use App\Models\Notification;

class OffreService
{
public function notifierEtudiants(Offre $offre, array $tagIds): int
{
    $etudiants = Etudiant::whereHas('centresInteret', function ($query) use ($tagIds) {
        $query->whereIn('tag_id', $tagIds);
    })->get();

    $count = 0;

    foreach ($etudiants as $etudiant) {
        $created = Notification::create([
            'utilisateur_id' => $etudiant->utilisateur_id,
            'offre_id' => $offre->id,
            'message' => "Nouvelle offre : {$offre->titre}",
            'est_lu' => false,
        ]);

        if ($created) {
            $count++;
        }
    }

    return $count;
}


}