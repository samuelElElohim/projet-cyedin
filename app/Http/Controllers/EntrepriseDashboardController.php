<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Entreprise;
use App\Models\Offre;

class EntrepriseDashboardController extends Controller
{
    public function index_offre()
    {
        $entreprise = auth()->user()->entreprise;

        if (!$entreprise) {
            abort(403, 'Entreprise inexistante');
        }

        $offres = $entreprise->offres()->orderBy('created_at', 'desc')->get();

        // BUG FIX : 'entreprise.index.offre' → 'Entreprise/entreprise.index.offre'
        return Inertia::render('Entreprise/entreprise.index.offre', [
            'offres' => $offres,
        ]);
    }

    public function store_offre(Request $request)
    {
        $request->validate([
            'titre'          => 'required|string|max:255',
            'description'    => 'required|string',
            'duree_semaines' => 'required|integer|min:1',
        ]);

        $entreprise = auth()->user()->entreprise;

        if (!$entreprise) {
            abort(403, 'Entreprise introuvable');
        }

        Offre::create([
            'titre'          => $request->titre,
            'description'    => $request->description,
            'duree_semaines' => $request->duree_semaines,
            'entreprise_id'  => $entreprise->id,
            'est_active'     => false, // attente validation admin
        ]);

        return redirect()->route('entreprise.index.offre')->with('success', 'Offre soumise, en attente de validation.');
    }
}