<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    // Affiche les documents de l'étudiant connecté
    public function index()
    {
        $documents = Document::where('utilisateurs_id', auth()->id())
                             ->orderBy('date_depot', 'desc')
                             ->get();

        return Inertia::render('etu.documents', [
            'documents' => $documents
        ]);
    }

    // Upload un nouveau document
    public function store(Request $request)
    {
        $request->validate([
            'fichier' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
            'nom'     => 'required|string|max:255',
            'type'    => 'nullable|string|max:50',
        ]);

        // Stocke dans storage/app/public/documents/{user_id}/
        $path = $request->file('fichier')->store(
            'documents/' . auth()->id(),
            'public'
        );

        Document::create([
            'utilisateurs_id' => auth()->id(),
            'nom'             => $request->nom,
            'type'            => $request->type ?? $request->file('fichier')->getClientOriginalExtension(),
            'chemin_fichier'  => $path,
            'date_depot'      => now(),
        ]);

        return redirect()->route('etu.documents')->with('success', 'Document uploadé !');
    }

    // Supprime un document
    public function destroy($id)
    {
        $document = Document::where('id', $id)
                            ->where('utilisateurs_id', auth()->id()) // sécurité — que ses propres docs
                            ->firstOrFail();

        Storage::disk('public')->delete($document->chemin_fichier);
        $document->delete();

        return redirect()->route('etu.documents')->with('success', 'Document supprimé.');
    }
}