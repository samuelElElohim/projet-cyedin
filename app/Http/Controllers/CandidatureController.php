<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use App\Models\Notification;
use App\Models\Offre;
use App\Services\TraceLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class CandidatureController extends Controller
{
    // ─── Étudiant ────────────────────────────────────────────────────────────

    public function index(): Response
    {
        $candidatures = Candidature::with(['offre.entreprise'])
            ->where('etudiant_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Etudiant/etudiant.candidatures', [
            'candidatures' => $candidatures,
        ]);
    }



    public function download(Candidature $candidature, string $type): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        abort_unless(
            $candidature->offre->entreprise->utilisateurs_id === auth()->id(),
            403
        );

        $path = match($type) {
            'cv'     => $candidature->chemin_cv,
            'lettre' => $candidature->chemin_lettre,
            default  => abort(404),
        };

        //abort_if(!$path || !Storage::disk('private')->exists($path), 404);

        $fullPath = storage_path('app/' . $path);
        abort_unless(file_exists($fullPath), 404);
        return response()->download($fullPath);
    }


   public function store(Request $request): RedirectResponse
{
    $request->validate([
        'offre_id'          => 'required|integer|exists:offres,id',
        'lettre_motivation' => 'nullable|string|max:2000',
        'cv'                => 'required|file|max:5120|mimes:pdf,doc,docx,jpg,jpeg,png',
        'lettre_fichier'    => 'nullable|file|max:5120|mimes:pdf,doc,docx',
    ]);

    $etudiantId = auth()->id();

    $etudiant = Etudiant::where('utilisateurs_id', $etudiantId)->firstOrFail();
    abort_unless($etudiant->hasTuteur(), 422, 'Vous devez avoir un tuteur assigné pour postuler.');

    $offre = Offre::findOrFail($request->offre_id);
    abort_unless($offre->est_active, 422, 'Cette offre n\'est plus disponible.');

    $existe = Candidature::where('etudiant_id', $etudiantId)
        ->where('offre_id', $request->offre_id)
        ->exists();
    abort_if($existe, 422, 'Vous avez déjà postulé à cette offre.');

    // Stockage des fichiers
    $cvPath     = $request->file('cv')->store('candidatures/cvs', 'local');
    $lettrePath = $request->hasFile('lettre_fichier')
        ? $request->file('lettre_fichier')->store('candidatures/lettres', 'local')
        : null;

    Candidature::create([
        'etudiant_id'       => $etudiantId,
        'offre_id'          => $request->offre_id,
        'lettre_motivation' => $request->lettre_motivation,
        'chemin_cv'         => $cvPath,
        'chemin_lettre'     => $lettrePath,
    ]);

    // Notifier l'entreprise
    if ($offre->entreprise?->utilisateurs_id) {
        Notification::create([
            'proprietaire_id' => $offre->entreprise->utilisateurs_id,
            'message'         => 'Nouvelle candidature reçue pour l\'offre « ' . $offre->titre . ' ».',
        ]);
    }

    TraceLogger::log('store_candidature', [
        'etudiant_id' => $etudiantId,
        'offre_id'    => $request->offre_id,
    ]);

    return back()->with('success', 'Candidature envoyée.');
}

    public function destroy(Candidature $candidature): RedirectResponse
    {
        abort_unless($candidature->etudiant_id === auth()->id(), 403);
        abort_if($candidature->statut !== 'en_attente', 422, 'Impossible de retirer une candidature traitée.');

        $candidature->delete();

        return back()->with('success', 'Candidature retirée.');
    }

    // ─── Entreprise ──────────────────────────────────────────────────────────

    public function indexEntreprise(): Response
    {
        $entreprise = auth()->user()->entreprise;
        abort_unless($entreprise, 403);

        $candidatures = Candidature::with(['etudiant', 'offre'])
            ->whereHas('offre', fn ($q) => $q->where('entreprise_id', $entreprise->id))
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Entreprise/entreprise.candidatures', [
            'candidatures' => $candidatures,
        ]);
    }

    public function accepter(Candidature $candidature): RedirectResponse
    {
        $this->verifierAppartientEntreprise($candidature);

        $candidature->update(['statut' => 'acceptee']);

        Notification::create([
            'proprietaire_id' => $candidature->etudiant_id,
            'message'         => 'Votre candidature pour l\'offre « ' . $candidature->offre->titre . ' » a été acceptée !',
        ]);

        TraceLogger::log('accepter_candidature', ['candidature_id' => $candidature->id]);

        return back()->with('success', 'Candidature acceptée.');
    }

    public function refuser(Candidature $candidature): RedirectResponse
    {
        $this->verifierAppartientEntreprise($candidature);

        $candidature->update(['statut' => 'refusee']);

        Notification::create([
            'proprietaire_id' => $candidature->etudiant_id,
            'message'         => 'Votre candidature pour l\'offre « ' . $candidature->offre->titre . ' » n\'a pas été retenue.',
        ]);

        TraceLogger::log('refuser_candidature', ['candidature_id' => $candidature->id]);

        return back()->with('success', 'Candidature refusée.');
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    public function indexAdmin(): Response
    {
        $candidatures = Candidature::with(['etudiant', 'offre.entreprise'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/admin.index.candidature', [
            'candidatures' => $candidatures,
            'count'        => $candidatures->count(),
        ]);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function verifierAppartientEntreprise(Candidature $candidature): void
    {
        $entreprise = auth()->user()->entreprise;
        abort_unless($entreprise, 403);

        $candidature->load('offre');
        abort_unless(
            $candidature->offre->entreprise_id === $entreprise->id,
            403
        );
    }
}
