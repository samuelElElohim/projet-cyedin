<?php

namespace App\Http\Controllers;

use App\Models\CahierStage;
use App\Models\Candidature;
use App\Models\DemandeFormation;
use App\Models\Document;
use App\Models\Dossier_stage;
use App\Models\Etudiant;
use App\Models\Notification;
use App\Models\Offre;
use App\Models\Remarque;
use App\Models\Administrateur;
use App\Services\TraceLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EtudiantDashboardController extends Controller
{
    // ─── Dashboard ───────────────────────────────────────────────────────────

    public function dashboard(): Response
    {
        $user    = auth()->user();
        $etudiant = $user->etudiant;

        $stageEnCours = $etudiant?->stages()
            ->with(['entreprise', 'tuteur.utilisateur', 'convention'])
            ->latest('id')
            ->first();

        $dossier = $etudiant
            ? Dossier_stage::with('documents')
                ->where('etudiant_id', $user->id)
                ->first()
            : null;

        $notifications = Notification::where('utilisateur_id', $user->id)
            ->where('est_lu', false)
            ->orderBy('date_envoi', 'desc')
            ->take(5)
            ->get();

        $nbCandidatures = Candidature::where('etudiant_id', $user->id)->count();
        $nbDocuments    = Document::where('utilisateur_id', $user->id)->count();
        $nbCahier       = CahierStage::where('etudiant_id', $user->id)->count();

        $conventionStatus = null;
        if ($stageEnCours?->convention) {
            $c = $stageEnCours->convention;
            $conventionStatus = [
                'entreprise' => $c->signer_par_entreprise,
                'tuteur'     => $c->signer_par_tuteur,
                'etudiant'   => $c->signer_par_etudiant,
                'complete'   => $c->signer_par_entreprise && $c->signer_par_tuteur && $c->signer_par_etudiant,
            ];
        }

        return Inertia::render('Etudiant/etudiant.dashboard', [
            'etudiant'          => $etudiant,
            'stage_en_cours'    => $stageEnCours,
            'convention_status' => $conventionStatus,
            'dossier'           => $dossier,
            'notifications'     => $notifications,
            'stats' => [
                'candidatures' => $nbCandidatures,
                'documents'    => $nbDocuments,
                'cahier'       => $nbCahier,
                'dossier_valide' => $dossier?->est_valide ?? false,
            ],
            // Indique si l'étudiant a un tuteur (pour afficher le bouton de message)
            'has_tuteur'        => $stageEnCours && $stageEnCours->tuteurs_id !== null,
        ]);
    }

    // ─── Notifier le tuteur ──────────────────────────────────────────────────

    /**
     * Permet à l'étudiant d'envoyer un message d'avancement à son tuteur.
     */
    public function notify_tuteur(Request $request): RedirectResponse
    {
        $user     = auth()->user();
        $etudiant = $user->etudiant;
        abort_unless($etudiant, 403);

        $request->validate([
            'message' => 'required|string|min:5|max:1000',
        ]);

        $stage = $etudiant->stages()
            ->with('tuteur.utilisateur')
            ->whereNotNull('tuteurs_id')
            ->latest('id')
            ->first();

        abort_unless($stage && $stage->tuteurs_id, 422, 'Aucun tuteur assigné à votre stage.');

        // Notification au tuteur
        Notification::create([
            'utilisateur_id' => $stage->tuteurs_id,
            'message'         => "📢 Message d'avancement de {$user->prenom} {$user->nom} : {$request->message}",
        ]);

        // Aussi créer une remarque visible sur le stage pour traçabilité
        Remarque::create([
            'auteur_id'              => $user->id,
            'cible_type'             => 'stage',
            'cible_id'               => $stage->id,
            'contenu'                => "[Message au tuteur] {$request->message}",
            'est_visible_etudiant'   => true,
            'est_visible_entreprise' => false,
        ]);

        TraceLogger::log('notify_tuteur', [
            'etudiant_id' => $user->id,
            'tuteur_id'   => $stage->tuteurs_id,
            'stage_id'    => $stage->id,
        ]);

        return back()->with('success', 'Message envoyé à votre tuteur.');
    }

    // ─── Offres ──────────────────────────────────────────────────────────────

    public function offres(Request $request): Response
    {
        $user = auth()->user();

        $query = Offre::with('entreprise')
            ->where('est_active', true);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('titre', 'ilike', '%' . $request->search . '%')
                  ->orWhere('description', 'ilike', '%' . $request->search . '%');
            });
        }

        if ($request->filled('duree_max')) {
            $query->where('duree_semaines', '<=', $request->duree_max);
        }

        if ($request->filled('duree_min')) {
            $query->where('duree_semaines', '>=', $request->duree_min);
        }

        if ($request->filled('secteur')) {
            $query->whereHas('entreprise', fn ($q) =>
                $q->where('secteur', 'ilike', '%' . $request->secteur . '%')
            );
        }

        if ($request->filled('filiere')) {
            $query->where('filiere_cible', $request->filiere);
        }

        $offres = $query->orderBy('created_at', 'desc')->get();

        $dejaCandidature = Candidature::where('etudiant_id', $user->id)
            ->pluck('statut', 'offre_id');

        $secteurs = \App\Models\Entreprise::select('secteur')
            ->distinct()
            ->orderBy('secteur')
            ->pluck('secteur');

        return Inertia::render('Etudiant/etudiant.offres', [
            'offres'            => $offres,
            'deja_candidature'  => $dejaCandidature,
            'secteurs'          => $secteurs,
            'filieres' => Etudiant::select('filiere')->distinct()->orderBy('filiere')->pluck('filiere'),
            'filters'  => $request->only(['search', 'duree_min', 'duree_max', 'secteur', 'filiere']),
        ]);
    }

    // ─── Dossier de stage ────────────────────────────────────────────────────

    public function dossier(): Response
    {
        $user = auth()->user();

        $dossier = Dossier_stage::with('documents')
            ->where('etudiant_id', $user->id)
            ->first();

        $documents = Document::where('utilisateur_id', $user->id)
            ->orderBy('date_depot', 'desc')
            ->get();

        $stage = $user->etudiant?->stages()
            ->with(['convention', 'entreprise', 'tuteur.utilisateur'])
            ->latest('id')
            ->first();

        $remarques = $dossier
            ? Remarque::pour('dossier_stage', $dossier->id)
                ->with('auteur')
                ->visibleParEtudiant()
                ->orderBy('created_at', 'desc')
                ->get()
            : collect();

        return Inertia::render('Etudiant/etudiant.dossier', [
            'dossier'   => $dossier,
            'documents' => $documents,
            'stage'     => $stage,
            'remarques' => $remarques,
        ]);
    }

    // ─── Cahier de stage ─────────────────────────────────────────────────────

    public function cahier(): Response
    {
        $user     = auth()->user();
        $etudiant = $user->etudiant;

        $stage = $etudiant?->stages()
            ->with('tuteur.utilisateur')
            ->whereNotNull('tuteurs_id')
            ->latest('id')
            ->first();

        $entrees = CahierStage::where('etudiant_id', auth()->id())
            ->orderBy('date_entree', 'desc')
            ->get();

        return Inertia::render('Etudiant/etudiant.cahier', [
            'entrees'    => $entrees,
            'has_tuteur' => $stage && $stage->tuteurs_id !== null,
            'tuteur_nom' => $stage?->tuteur?->utilisateur
                ? trim($stage->tuteur->utilisateur->prenom . ' ' . $stage->tuteur->utilisateur->nom)
                : null,
        ]);
    }

    public function store_cahier(Request $request): RedirectResponse
    {
        $request->validate([
            'date_entree'    => 'required|date',
            'titre'          => 'nullable|string|max:255',
            'contenu'        => 'required|string|max:10000',
            'visible_tuteur' => 'boolean',
            'visible_jury'   => 'boolean',
        ]);

        CahierStage::create([
            'etudiant_id'    => auth()->id(),
            'date_entree'    => $request->date_entree,
            'titre'          => $request->titre,
            'contenu'        => $request->contenu,
            'visible_tuteur' => $request->boolean('visible_tuteur', true),
            'visible_jury'   => $request->boolean('visible_jury', false),
        ]);

        return back()->with('success', 'Entrée ajoutée au cahier.');
    }

    public function destroy_cahier(CahierStage $entree): RedirectResponse
    {
        abort_unless($entree->etudiant_id === auth()->id(), 403);

        $entree->delete();

        return back()->with('success', 'Entrée supprimée.');
    }

    // ─── Candidatures ────────────────────────────────────────────────────────

    public function candidatures(): Response
    {
        $candidatures = Candidature::with(['offre.entreprise'])
            ->where('etudiant_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Etudiant/etudiant.candidatures', [
            'candidatures' => $candidatures,
        ]);
    }

    // ─── Ajouter une remarque sur son propre stage / dossier ─────────────────

    public function store_remarque(Request $request): RedirectResponse
    {
        $request->validate([
            'cible_type' => 'required|in:stage,dossier_stage',
            'cible_id'   => 'required|integer',
            'contenu'    => 'required|string|max:2000',
        ]);

        Remarque::create([
            'auteur_id'              => auth()->id(),
            'cible_type'             => $request->cible_type,
            'cible_id'               => $request->cible_id,
            'contenu'                => $request->contenu,
            'est_visible_etudiant'   => true,
            'est_visible_entreprise' => false,
        ]);

        return back()->with('success', 'Remarque ajoutée.');
    }

    // ─── Demande de filière ───────────────────────────────────────────────────

    public function index_demande_formation(): Response
    {
        $etudiantId = auth()->id();

        $demandes = DemandeFormation::where('etudiant_id', $etudiantId)
            ->orderBy('created_at', 'desc')
            ->get();

        $filieres = Etudiant::select('filiere')
            ->distinct()
            ->pluck('filiere')
            ->sort()
            ->values();

        return Inertia::render('Etudiant/etudiant.demande.formation', [
            'demandes' => $demandes,
            'filieres' => $filieres,
        ]);
    }

    public function store_demande_formation(Request $request): RedirectResponse
    {
        $request->validate([
            'formation_demandee' => 'required|string|max:100',
            'justification'      => 'nullable|string|max:1000',
        ]);

        $demande = DemandeFormation::create([
            'etudiant_id'        => auth()->id(),
            'formation_demandee' => $request->formation_demandee,
            'justification'      => $request->justification,
        ]);

        $adminIds = Administrateur::pluck('utilisateurs_id');
        foreach ($adminIds as $adminId) {
            Notification::create([
                'proprietaire_id' => $adminId,
                'message'         => "Nouvelle demande de filière « {$request->formation_demandee} » de la part de " . auth()->user()->nom . '.',
            ]);
        }

        TraceLogger::log('store_demande_formation', [
            'etudiant_id' => auth()->id(),
            'formation'   => $request->formation_demandee,
        ]);

        return back()->with('success', 'Demande envoyée.');
    }

    public function entreprises(Request $request): Response
    {
        $query = \App\Models\Entreprise::withCount([
            'offres as offres_actives_count' => fn($q) => $q->where('est_active', true),
        ]);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('nom_entreprise', 'ilike', '%' . $request->search . '%')
                ->orWhere('addresse', 'ilike', '%' . $request->search . '%');
            });
        }

        if ($request->filled('secteur')) {
            $query->where('secteur', $request->secteur);
        }

        $entreprises = $query->orderBy('nom_entreprise')->get();

        $secteurs = \App\Models\Entreprise::select('secteur')
            ->distinct()
            ->orderBy('secteur')
            ->pluck('secteur');

        return Inertia::render('Etudiant/etudiant.entreprises', [
            'entreprises' => $entreprises,
            'secteurs'    => $secteurs,
            'filters'     => $request->only(['search', 'secteur']),
        ]);
    }
}