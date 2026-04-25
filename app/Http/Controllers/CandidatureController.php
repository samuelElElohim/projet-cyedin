<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use App\Models\Document;
use Illuminate\Http\Request;

class CandidatureController extends Controller
{
    public function store(Request $request, $offre_id)
    {
        // Vérifie qu'il n'a pas déjà candidaté
        $dejaCandidate = Candidature::where('offre_id', $offre_id)
                                    ->where('etudiant_id', auth()->id())
                                    ->exists();

        if ($dejaCandidate) {
            return back()->with('error', 'Vous avez déjà candidaté à cette offre.');
        }

        $request->validate([
            'document_id' => 'required|exists:documents,id',
        ]);

        // Vérifie que le document appartient bien à l'étudiant
        $document = Document::where('id', $request->document_id)
                            ->where('utilisateurs_id', auth()->id())
                            ->firstOrFail();

        $candidature = Candidature::create([
            'offre_id'    => $offre_id,
            'etudiant_id' => auth()->id(),
            'statut'      => 'en_attente',
        ]);

        // Lie le document à la candidature
        $candidature->documents()->attach($document->id);

        return back()->with('success', 'Candidature envoyée !');
    }
}