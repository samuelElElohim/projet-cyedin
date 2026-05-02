<?php

namespace App\Http\Controllers;

use App\Models\Remarque;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RemarqueController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'cible_type'             => 'required|string|in:stage,dossier_stage,document,offre',
            'cible_id'               => 'required|integer',
            'contenu'                => 'required|string|max:2000',
            'est_visible_etudiant'   => 'boolean',
            'est_visible_entreprise' => 'boolean',
        ]);

        $user = auth()->user();

        Remarque::create([
            'auteur_id'              => $user->id,
            'cible_type'             => $request->cible_type,
            'cible_id'               => $request->cible_id,
            'contenu'                => $request->contenu,
            'est_visible_etudiant'   => $request->boolean('est_visible_etudiant', true),
            'est_visible_entreprise' => $request->boolean('est_visible_entreprise', false),
        ]);

        return back()->with('success', 'Remarque ajoutée.');
    }

    public function destroy(Remarque $remarque): RedirectResponse
    {
        $user = auth()->user();

        // Seul l'auteur ou un admin peut supprimer
        if ($remarque->auteur_id !== $user->id && $user->role !== 'A') {
            abort(403);
        }

        $remarque->delete();

        return back()->with('success', 'Remarque supprimée.');
    }
}
