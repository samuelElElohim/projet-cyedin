<?php

namespace App\Http\Controllers;

use App\Models\Filiere;
use App\Models\Secteur;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminHierarchieController extends Controller
{
    // ─── Index ────────────────────────────────────────────────────────────────

    public function index()
    {
        // Hiérarchie complète avec compteurs
        $filieres = Filiere::withCount('secteurs')
            ->with(['secteurs' => fn($q) => $q->withCount('tags')])
            ->orderBy('filiere')
            ->get();

        $tags = Tag::with('secteur.filiere')->orderBy('tag')->get();

        return Inertia::render('Admin/admin.hierarchie', [
            'filieres' => $filieres,
            'tags'     => $tags,
        ]);
    }

    // ─── Filière ─────────────────────────────────────────────────────────────

    public function store_filiere(Request $request)
    {
        $request->validate(['filiere' => 'required|string|max:100|unique:filieres,filiere']);
        Filiere::create(['filiere' => strtoupper(trim($request->filiere))]);
        return back()->with('success', 'Filière créée.');
    }

    public function update_filiere(Request $request, int $id)
    {
        $request->validate(['filiere' => 'required|string|max:100|unique:filieres,filiere,' . $id]);
        Filiere::findOrFail($id)->update(['filiere' => strtoupper(trim($request->filiere))]);
        return back()->with('success', 'Filière mise à jour.');
    }

    public function destroy_filiere(int $id)
    {
        Filiere::findOrFail($id)->delete();
        return back()->with('success', 'Filière supprimée (secteurs + tags en cascade).');
    }

    // ─── Secteur ─────────────────────────────────────────────────────────────

    public function store_secteur(Request $request)
    {
        $request->validate([
            'secteur'    => 'required|string|max:100',
            'filiere_id' => 'required|integer|exists:filieres,id',
        ]);
        Secteur::create([
            'secteur'    => trim($request->secteur),
            'filiere_id' => $request->filiere_id,
        ]);
        return back()->with('success', 'Secteur créé.');
    }

    public function update_secteur(Request $request, int $id)
    {
        $request->validate([
            'secteur'    => 'required|string|max:100',
            'filiere_id' => 'required|integer|exists:filieres,id',
        ]);
        Secteur::findOrFail($id)->update([
            'secteur'    => trim($request->secteur),
            'filiere_id' => $request->filiere_id,
        ]);
        return back()->with('success', 'Secteur mis à jour.');
    }

    public function destroy_secteur(int $id)
    {
        Secteur::findOrFail($id)->delete();
        return back()->with('success', 'Secteur supprimé (tags en cascade).');
    }

    // ─── Tag ─────────────────────────────────────────────────────────────────

    public function store_tag(Request $request)
    {
        $request->validate([
            'tag'        => 'required|string|max:100',
            'secteur_id' => 'required|integer|exists:secteurs,id',
        ]);
        Tag::create([
            'tag'        => trim($request->tag),
            'secteur_id' => $request->secteur_id,
        ]);
        return back()->with('success', 'Tag créé.');
    }

    public function update_tag(Request $request, int $id)
    {
        $request->validate([
            'tag'        => 'required|string|max:100',
            'secteur_id' => 'required|integer|exists:secteurs,id',
        ]);
        Tag::findOrFail($id)->update([
            'tag'        => trim($request->tag),
            'secteur_id' => $request->secteur_id,
        ]);
        return back()->with('success', 'Tag mis à jour.');
    }

    public function destroy_tag(int $id)
    {
        Tag::findOrFail($id)->delete();
        return back()->with('success', 'Tag supprimé.');
    }
}
