<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Dossier_stage;
use App\Models\Etudiant;
use App\Services\TraceLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    private const TYPES_AUTORISES = [
        'application/pdf'                                                          => 'pdf',
        'application/msword'                                                       => 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
        'image/jpeg'                                                               => 'jpeg',
        'image/png'                                                                => 'png',
    ];

    private const MAX_TAILLE_MB  = 10;
    // Limite du stash (hors conventions)
    private const MAX_STASH_DOCS = 4;

    // ─── Porte-document étudiant ──────────────────────────────────────────────

    public function porte_document(): Response
    {
        $user     = auth()->user();
        $etudiant = $user->etudiant;

        $stash = Document::where('utilisateurs_id', $user->id)
            ->where('categorie', '!=', 'convention')
            ->orderBy('date_depot', 'desc')
            ->get();

        return Inertia::render('Etudiant/etudiant.porte.document', [
            'etudiant'  => $etudiant,
            'stash'     => $stash,
            'max_docs'  => self::MAX_STASH_DOCS,
        ]);
    }

    // ─── Index générique ──────────────────────────────────────────────────────

    public function index(): Response
    {
        $user = auth()->user();
        $documents = Document::where('utilisateurs_id', $user->id)
            ->orderBy('date_depot', 'desc')
            ->get();
        return Inertia::render('Document/document.index', ['documents' => $documents]);
    }

    // ─── Upload stash ─────────────────────────────────────────────────────────

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'fichier'   => ['required', 'file', 'max:' . (self::MAX_TAILLE_MB * 1024), 'mimes:pdf,doc,docx,jpeg,jpg,png'],
            'nom'       => 'nullable|string|max:255',
            'type'      => 'nullable|string|max:50',
            'categorie' => 'nullable|in:cv,lettre,convention,autre',
        ]);

        $user      = auth()->user();
        $categorie = $request->categorie ?? 'autre';

        // Vérifier la limite stash pour les étudiants
        if ($user->role === 'S' && $categorie !== 'convention') {
            $count = Document::where('utilisateurs_id', $user->id)
                ->where('categorie', '!=', 'convention')
                ->count();
            abort_if($count >= self::MAX_STASH_DOCS, 422,
                'Limite de ' . self::MAX_STASH_DOCS . ' documents atteinte. Supprimez-en un pour continuer.');
        }

        $fichier    = $request->file('fichier');
        $nomFichier = time() . '_' . $fichier->getClientOriginalName();
        $chemin     = $fichier->storeAs("documents/{$user->id}", $nomFichier, 'local');

        $document = Document::create([
            'utilisateurs_id' => $user->id,
            'nom'             => $request->nom ?: $fichier->getClientOriginalName(),
            'type'            => $fichier->getClientMimeType(),
            'categorie'       => $categorie,
            'chemin_fichier'  => $chemin,
        ]);

        // Rattacher au dossier de stage si convention
        if ($user->role === 'S' && $categorie === 'convention') {
            $dossier = Dossier_stage::firstOrCreate(
                ['etudiants_id' => $user->id],
                ['est_valide' => false]
            );
            $dossier->documents()->syncWithoutDetaching([$document->id]);
        }

        TraceLogger::log('upload_document', ['user_id' => $user->id, 'doc' => $document->nom, 'categorie' => $categorie]);

        return back()->with('success', 'Document ajouté.');
    }

    // ─── Définir comme CV principal ───────────────────────────────────────────

    public function set_main_cv(Document $document): RedirectResponse
    {
        $user = auth()->user();
        abort_unless($document->utilisateurs_id === $user->id, 403);
        abort_unless($user->role === 'S', 403);

        Etudiant::where('utilisateurs_id', $user->id)->update([
            'chemin_cv' => $document->chemin_fichier,
            'nom_cv'    => $document->nom,
        ]);

        return back()->with('success', '« ' . $document->nom . ' » défini comme CV principal.');
    }

    // ─── Upload CV principal direct ───────────────────────────────────────────

    public function store_main_cv(Request $request): RedirectResponse
    {
        $request->validate([
            'fichier' => ['required', 'file', 'max:' . (self::MAX_TAILLE_MB * 1024), 'mimes:pdf,doc,docx'],
        ]);

        $user       = auth()->user();
        abort_unless($user->role === 'S', 403);

        $fichier    = $request->file('fichier');
        $nomFichier = time() . '_' . $fichier->getClientOriginalName();
        $chemin     = $fichier->storeAs("documents/{$user->id}/cv", $nomFichier, 'local');

        Etudiant::where('utilisateurs_id', $user->id)->update([
            'chemin_cv' => $chemin,
            'nom_cv'    => $fichier->getClientOriginalName(),
        ]);

        TraceLogger::log('upload_main_cv', ['user_id' => $user->id]);

        return back()->with('success', 'CV principal mis à jour.');
    }

    // ─── Téléchargement ──────────────────────────────────────────────────────

    public function download(Document $document): StreamedResponse
    {
        $this->autoriserAcces($document);
        abort_unless(Storage::disk('local')->exists($document->chemin_fichier), 404, 'Fichier introuvable.');
        return Storage::disk('local')->download($document->chemin_fichier, $document->nom);
    }

    // ─── Suppression ─────────────────────────────────────────────────────────

    public function destroy(Document $document): RedirectResponse
    {
        $user = auth()->user();
        abort_unless($document->utilisateurs_id === $user->id || $user->role === 'A', 403);

        if (Storage::disk('local')->exists($document->chemin_fichier)) {
            Storage::disk('local')->delete($document->chemin_fichier);
        }

        TraceLogger::log('delete_document', ['id' => $document->id, 'nom' => $document->nom]);
        $document->delete();

        return back()->with('success', 'Document supprimé.');
    }

    // ─── Contrôle d'accès ─────────────────────────────────────────────────────

    private function autoriserAcces(Document $document): void
    {
        $user = auth()->user();
        if ($document->utilisateurs_id === $user->id) return;
        if (in_array($user->role, ['A', 'J'])) return;

        if ($user->role === 'T') {
            $tuteur = $user->tuteur;
            abort_unless($tuteur && $tuteur->stages()->where('etudiants_id', $document->utilisateurs_id)->exists(), 403);
            return;
        }

        if ($user->role === 'E') {
            $entreprise = $user->entreprise;
            $ok = $entreprise && \App\Models\Candidature::whereHas('offre', fn($q) => $q->where('entreprise_id', $entreprise->id))
                ->where('etudiant_id', $document->utilisateurs_id)->exists();
            abort_unless($ok, 403);
            return;
        }

        abort(403);
    }
}
