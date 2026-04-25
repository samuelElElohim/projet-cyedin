<?php

namespace App\Http\Controllers;

use App\Models\Offre;
use App\Models\Candidature;
use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedController extends Controller

{
    public function index_feed()
{
    $offres = Offre::with('entreprise')
                   ->where('est_active', true)
                   ->orderBy('created_at', 'desc')
                   ->get();

    // IDs des offres où l'étudiant a déjà candidaté
    $dejasCandidatures = Candidature::where('etudiant_id', auth()->id())
                                    ->pluck('offre_id')
                                    ->toArray();

    // Documents de l'étudiant pour le select
    $documents = Document::where('utilisateurs_id', auth()->id())->get();

    return Inertia::render('etu.main.feed', [
        'offres'             => $offres,
        'dejasCandidatures'  => $dejasCandidatures,
        'documents'          => $documents,
    ]);
}
}
