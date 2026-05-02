<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use App\Models\Document;
use App\Models\Etudiant;
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
            ->get()
            ->map(fn ($c) => array_merge($c->toArray(), [
                'jours_restants' => $c->joursRestants(),
            ]));

        return Inertia::render('Etudiant/etudiant.candidatures', [
            'candidatures' => $candidatures,
        ]);
    }

    public function download(Candidature $candidature, string $type)
    {
        abort_unless(
            $candidature->offre->entreprise->utilisateurs_id === auth()->id(),
            403
        );

        [$path, $friendlyName] = match($type) {
            'cv'     => [$candidature->chemin_cv, $candidature->nom_cv_original ?? 'cv.pdf'],
            'lettre' => [$candidature->chemin_lettre, $candidature->nom_lettre_original ?? 'lettre.pdf'],
            default  => abort(404),
        };

        if (!$path || !Storage::disk('local')->exists($path)) {
            abort(404, "Le fichier est introuvable sur le serveur.");
        }

        return Storage::disk('local')->download($path, $friendlyName);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'offre_id'          => 'required|integer|exists:offres,id',
            'lettre_motivation' => 'nullable|string|max:2000',
            // CV : l'un des trois modes doit être fourni
            'use_main_cv'       => 'nullable|boolean',
            'cv_document_id'    => 'nullable|integer|exists:documents,id',
            'cv'                => 'nullable|file|max:5120|mimes:pdf,doc,docx,jpg,jpeg,png',
            // Lettre : document existant ou nouveau fichier
            'lettre_document_id' => 'nullable|integer|exists:documents,id',
            'lettre_fichier'     => 'nullable|file|max:5120|mimes:pdf,doc,docx',
        ]);

        $etudiantId = auth()->id();
        $offre      = Offre::findOrFail($request->offre_id);
        abort_unless($offre->est_active, 422, 'Cette offre n\'est plus disponible.');

        $existe = Candidature::where('etudiant_id', $etudiantId)
            ->where('offre_id', $request->offre_id)
            ->exists();
        abort_if($existe, 422, 'Vous avez déjà postulé à cette offre.');

        // ── Résoudre le CV ────────────────────────────────────────────────────
        $cvPath = null;
        $cvName = null;

        if ($request->boolean('use_main_cv')) {
            $etudiant = Etudiant::where('utilisateurs_id', $etudiantId)->first();
            abort_unless($etudiant?->chemin_cv, 422, 'Aucun CV principal défini. Ajoutez-en un dans votre porte-document.');
            $cvPath = $etudiant->chemin_cv;
            $cvName = $etudiant->nom_cv;
        } elseif ($request->filled('cv_document_id')) {
            $doc = Document::where('id', $request->cv_document_id)
                ->where('utilisateurs_id', $etudiantId)
                ->firstOrFail();
            $cvPath = $doc->chemin_fichier;
            $cvName = $doc->nom;
        } elseif ($request->hasFile('cv')) {
            $file   = $request->file('cv');
            $cvPath = $file->store('candidatures/cvs', 'local');
            $cvName = $file->getClientOriginalName();
        } else {
            abort(422, 'Vous devez fournir un CV (principal, depuis le stash, ou nouveau fichier).');
        }

        // ── Résoudre la lettre ────────────────────────────────────────────────
        $lettrePath = null;
        $lettreName = null;

        if ($request->filled('lettre_document_id')) {
            $doc = Document::where('id', $request->lettre_document_id)
                ->where('utilisateurs_id', $etudiantId)
                ->firstOrFail();
            $lettrePath = $doc->chemin_fichier;
            $lettreName = $doc->nom;
        } elseif ($request->hasFile('lettre_fichier')) {
            $file       = $request->file('lettre_fichier');
            $lettrePath = $file->store('candidatures/lettres', 'local');
            $lettreName = $file->getClientOriginalName();
        }

        Candidature::create([
            'etudiant_id'         => $etudiantId,
            'offre_id'            => $request->offre_id,
            'lettre_motivation'   => $request->lettre_motivation,
            'chemin_cv'           => $cvPath,
            'nom_cv_original'     => $cvName,
            'chemin_lettre'       => $lettrePath,
            'nom_lettre_original' => $lettreName,
        ]);

        if ($offre->entreprise?->utilisateurs_id) {
            Notification::create([
                'proprietaire_id' => $offre->entreprise->utilisateurs_id,
                'message'         => 'Nouvelle candidature reçue pour l\'offre « ' . $offre->titre . ' ».',
            ]);
        }

        TraceLogger::log('store_candidature', ['etudiant_id' => $etudiantId, 'offre_id' => $request->offre_id]);

        return back()->with('success', 'Candidature envoyée.');
    }

    public function destroy(Candidature $candidature): RedirectResponse
    {
        abort_unless($candidature->etudiant_id === auth()->id(), 403);
        abort_if($candidature->statut !== 'en_attente', 422, 'Impossible de retirer une candidature traitée.');

        $candidature->delete();

        return back()->with('success', 'Candidature retirée.');
    }

    // ─── Étudiant : confirmer / décliner une offre acceptée ─────────────────

    public function confirmer(Candidature $candidature): RedirectResponse
    {
        abort_unless($candidature->etudiant_id === auth()->id(), 403);
        abort_unless($candidature->statut === 'accepted_pending_choice', 422, 'Cette candidature ne peut plus être confirmée.');
        abort_if($candidature->isExpired(), 422, 'Le délai de 7 jours est dépassé.');

        // Créer le stage
        // Récupérer le tuteur de l'étudiant (si déjà assigné)
        $tuteurId = \App\Models\Etudiant::where('utilisateurs_id', auth()->id())
            ->first()
            ?->tuteur()
            ->first()
            ?->utilisateurs_id;

        $stage = \App\Models\Stage::create([
            'etudiants_id'     => auth()->id(),
            'entreprises_id'   => $candidature->offre->entreprise_id,
            'tuteurs_id'       => $tuteurId,
            'sujet'            => $candidature->offre->titre,
            'duree_en_semaine' => $candidature->offre->duree_semaines,
            'dateDebut'        => $candidature->offre->dateDebut ?? now()->toDateString(),
        ]);

        // Créer le dossier de stage
        \App\Models\Dossier_stage::create([
            'etudiants_id' => auth()->id(),
            'stage_id'     => $stage->id,
        ]);

        // Valider cette candidature
        $candidature->update(['statut' => 'acceptee']);

        // Annuler toutes les autres candidatures actives de l'étudiant
        Candidature::where('etudiant_id', auth()->id())
            ->where('id', '!=', $candidature->id)
            ->whereIn('statut', ['en_attente', 'accepted_pending_choice'])
            ->update(['statut' => 'annulee']);

        // Notifier l'entreprise
        if ($candidature->offre->entreprise?->utilisateurs_id) {
            Notification::create([
                'proprietaire_id' => $candidature->offre->entreprise->utilisateurs_id,
                'message'         => 'L\'étudiant a confirmé sa candidature pour « ' . $candidature->offre->titre . ' ».',
            ]);
        }

        TraceLogger::log('confirmer_candidature', [
            'candidature_id' => $candidature->id,
            'stage_id'       => $stage->id,
        ]);

        return back()->with('success', 'Stage confirmé ! Votre dossier a été créé.');
    }

    public function refuserParEtudiant(Candidature $candidature): RedirectResponse
    {
        abort_unless($candidature->etudiant_id === auth()->id(), 403);
        abort_unless($candidature->statut === 'accepted_pending_choice', 422, 'Cette candidature ne peut plus être modifiée.');

        $candidature->update(['statut' => 'refusee']);

        if ($candidature->offre->entreprise?->utilisateurs_id) {
            Notification::create([
                'proprietaire_id' => $candidature->offre->entreprise->utilisateurs_id,
                'message'         => 'L\'étudiant a décliné votre offre « ' . $candidature->offre->titre . ' ».',
            ]);
        }

        TraceLogger::log('refuser_par_etudiant', ['candidature_id' => $candidature->id]);

        return back()->with('success', 'Offre déclinée. Vos autres candidatures restent actives.');
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

        $candidature->update([
            'statut'         => 'accepted_pending_choice',
            'deadline_choix' => now()->addDays(7),
        ]);

        Notification::create([
            'proprietaire_id' => $candidature->etudiant_id,
            'message'         => 'Votre candidature pour « ' . $candidature->offre->titre . ' » a été acceptée ! Vous avez 7 jours pour confirmer votre choix.',
        ]);

        TraceLogger::log('accepter_candidature', ['candidature_id' => $candidature->id]);

        return back()->with('success', 'Candidature acceptée — l\'étudiant a 7 jours pour confirmer.');
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