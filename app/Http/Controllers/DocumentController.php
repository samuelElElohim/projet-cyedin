<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Dossier_stage;
use App\Services\TraceLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    // ─── Constantes ──────────────────────────────────────────────────────────

    // Types autorisés et leur extension normalisée
    private const TYPES_AUTORISES = [
        'application/pdf'                                                          => 'pdf',
        'application/msword'                                                       => 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
        'image/jpeg'                                                               => 'jpeg',
        'image/png'                                                                => 'png',
    ];

    private const MAX_TAILLE_MB = 10;

    // ─── Affichage ───────────────────────────────────────────────────────────

    public function index(): Response
    {
        $user = auth()->user();

        $documents = Document::where('utilisateurs_id', $user->id)
            ->orderBy('date_depot', 'desc')
            ->get();

        return Inertia::render('Document/document.index', [
            'documents' => $documents,
        ]);
    }

    // ─── Upload ──────────────────────────────────────────────────────────────

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'fichier' => [
                'required',
                'file',
                'max:' . (self::MAX_TAILLE_MB * 1024),
                'mimes:pdf,doc,docx,jpeg,jpg,png',
            ],
            'nom'  => 'nullable|string|max:255',
            'type' => 'nullable|string|max:50',
        ]);

        $fichier   = $request->file('fichier');
        $user      = auth()->user();

        // Chemin : documents/{userId}/{timestamp}_{nom_original}
        $nomFichier = time() . '_' . $fichier->getClientOriginalName();
        $chemin     = $fichier->storeAs(
            "documents/{$user->id}",
            $nomFichier,
            'local'     // disk = storage/app/private
        );

        $document = Document::create([
            'utilisateurs_id' => $user->id,
            'nom'             => $request->nom ?: $fichier->getClientOriginalName(),
            'type'            => $request->type ?: $fichier->getClientMimeType(),
            'chemin_fichier'  => $chemin,
        ]);

        // Rattacher automatiquement au dossier de stage si l'utilisateur est étudiant
        if ($user->role === 'S') {
            $dossier = Dossier_stage::firstOrCreate(
                ['etudiants_id' => $user->id],
                ['est_valide' => false]
            );
            // Évite les doublons dans la table pivot
            $dossier->documents()->syncWithoutDetaching([$document->id]);
        }

        TraceLogger::log('upload_document', [
            'user_id'  => $user->id,
            'document' => $document->nom,
            'type'     => $document->type,
        ]);

        return back()->with('success', 'Document déposé avec succès.');
    }

    // ─── Téléchargement ──────────────────────────────────────────────────────

    public function download(Document $document): StreamedResponse
    {
        $this->autoriserAcces($document);

        abort_unless(
            Storage::disk('local')->exists($document->chemin_fichier),
            404,
            'Fichier introuvable sur le serveur.'
        );

        return Storage::disk('local')->download(
            $document->chemin_fichier,
            $document->nom
        );
    }

    // ─── Suppression ─────────────────────────────────────────────────────────

    public function destroy(Document $document): RedirectResponse
    {
        // Seul le propriétaire ou un admin peut supprimer
        $user = auth()->user();
        if ($document->utilisateurs_id !== $user->id && $user->role !== 'A') {
            abort(403);
        }

        // Supprimer le fichier physique
        if (Storage::disk('local')->exists($document->chemin_fichier)) {
            Storage::disk('local')->delete($document->chemin_fichier);
        }

        TraceLogger::log('delete_document', [
            'document_id' => $document->id,
            'nom'         => $document->nom,
            'deleted_by'  => $user->id,
        ]);

        $document->delete();

        return back()->with('success', 'Document supprimé.');
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    /**
     * Vérifie que l'utilisateur connecté a le droit de télécharger ce document.
     *
     * Règles :
     *  - Le propriétaire du document : toujours
     *  - Admin (A)  : toujours
     *  - Tuteur (T) : si l'étudiant lui est assigné
     *  - Jury  (J)  : toujours (pour évaluation)
     *  - Entreprise (E) : uniquement les documents de ses propres candidats
     */
    private function autoriserAcces(Document $document): void
    {
        $user = auth()->user();

        if ($document->utilisateurs_id === $user->id) return;
        if (in_array($user->role, ['A', 'J'])) return;

        if ($user->role === 'T') {
            $tuteur = $user->tuteur;
            $ok = $tuteur && $tuteur->stages()
                ->where('etudiants_id', $document->utilisateurs_id)
                ->exists();
            abort_unless($ok, 403);
            return;
        }

        if ($user->role === 'E') {
            // L'entreprise peut voir les docs des étudiants qui ont postulé à ses offres
            $entreprise = $user->entreprise;
            $ok = $entreprise && \App\Models\Candidature::whereHas('offre', function ($q) use ($entreprise) {
                $q->where('entreprise_id', $entreprise->id);
            })->where('etudiant_id', $document->utilisateurs_id)->exists();
            abort_unless($ok, 403);
            return;
        }

        abort(403);
    }
}
