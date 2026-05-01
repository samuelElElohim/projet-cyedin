<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Offre;

use App\Services\OffreService;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class OffreController extends Controller
{   
    public function index(): Response
    {
        $offres = Offre::with(['entreprise', 'tags'])->get();

        return Inertia::render('offres.index', [
            'offres' => $offres 
        ]);
    }


    public function create(): Response
    {
        return Inertia::render('Offres/Create',['tags'=> Tag::orderBy('nom')->get()]);

    }



    public function store(Request $request): RedirectResponse
    {
        // Validation
        $validated = $request->validate([
            'titre'           => 'required|string|max:255',
            'description'     => 'required|string',
            'duree_semaines'  => 'required|integer|min:1',
            'tags'           => 'array',
            'tags.*'         => 'exists:tags,id'
        ]);

        // Insertion en BDD
        $offre = Offre::create([
            'entreprise_id' => auth()->user()->entreprise->id,
            'titre' => $validated['titre'],
            'description' => $validated['description'],
            'duree_semaines' => $validated['duree_semaines']
        ]);

        /*
        if(!empty($validated['tags'])) {
            $offre->tags()->sync($validated['tags']);
            $this->notifierEtudiants($offre, $validated['tags']);
        }*/

        return redirect()->route('offres.index')
                         ->with('success', 'Offre ajoutée avec succès!');
        
    }

    
  

}
