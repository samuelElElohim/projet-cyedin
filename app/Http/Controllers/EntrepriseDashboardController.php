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

        // Charge les candidatures + l'étudiant pour chaque offre
        $offres = $entreprise->offres()->with([
            'candidatures.etudiant',
            'candidatures.documents'
        ])->get();

        return Inertia::render('entreprise.index.offre', [
            'offres' => $offres
        ]);
    }

    public function store_offre(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'duree_semaines' => 'required|integer|min:1',
        ]);

        $entreprise = auth()->user()->entreprise;

        if (!$entreprise) {
            abort(403, "Entreprise introuvable");
        }

        Offre::create([
            'titre' => $request->titre,
            'description' => $request->description,
            'duree_semaines' => $request->duree_semaines,
            'entreprise_id' => $entreprise->id,
        ]);

        return redirect()->route('entreprise.index.offre');
    }
}
