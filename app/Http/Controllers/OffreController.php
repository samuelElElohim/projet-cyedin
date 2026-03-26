<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Offre;
class OffreController extends Controller
{
    public function create()
    {
        return Inertia::render('offres.create');
    }
    public function store(Request $request)
    {
        // Validation
        $validated = $request->validate([
            'titre'           => 'required|string|max:255',
            'description'     => 'required|string',
            'entreprise'      => 'required|string|max:255',
            'duree_semaines'  => 'required|integer|min:1',
        ]);

        // Insertion en BDD
        Offre::create($validated);

        return redirect()->route('offres.index')
                         ->with('success', 'Offre ajoutée !');
    }

    public function index()
{
    $offres = Offre::all();

    return Inertia::render('offres.index', [
        'offres' => $offres  // envoi les données à React
    ]);
}

}
