<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Entreprise;
use App\Models\Utilisateur;
use App\Models\Stage;
use App\Models\Offre;
// younes: test notif
use App\Models\Tag;           
use App\Models\Notification; 
use App\Models\Etudiant;      
use App\Services\OffreService;

class EntrepriseDashboardController extends Controller
{
    
    public function index_offre()
    {
        $entreprise = auth()->user()->entreprise;

        if (!$entreprise) {
            abort(403, 'Entreprise inexistante');
        }

        $offres = $entreprise->offres()->with('tags')->get();

        return Inertia::render('entreprise.index.offre', [
            'offres' => $offres,
            'tags' => Tag::orderBy('nom')->get() // younes: test notif
        ]);
    }

    public function store_offre(Request $request, OffreService $offreService)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'duree_semaines' => 'required|integer|min:1',
            'tags' => 'array', // younes: test notif
            'tags.*' => 'exists:tags,id' // younes: test notif
        ]);

        $entreprise = auth()->user()->entreprise;

        if (!$entreprise) {
            abort(403, "Entreprise introuvable");
        }

        $offre = Offre::create([
            'titre' => $request->titre,
            'description' => $request->description,
            'duree_semaines' => $request->duree_semaines,
            'entreprise_id' => $entreprise->id
        ]);

        // younes: test notif
        if ($request->filled('tags')) {
            $offre->tags()->sync($request->tags);
            $offreService->notifierEtudiants($offre, $request->tags);
        }

        return redirect()->route('entreprise.index.offre');

    }

    
}
