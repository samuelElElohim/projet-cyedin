<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Entreprise;
use App\Models\Utilisateur;
use App\Models\Stage;
use App\Models\Offre;


class EntrepriseDashboardController extends Controller
{
    
    public function index_offre()
{
    $entreprise = auth()->user()->entreprise;

    if (!$entreprise) {
        abort(403, 'Entreprise inexistante');
    }

    $offres = $entreprise->offres;

    return Inertia::render('entreprise.index.offre', [
        'offres' => $offres
    ]);
}
}
