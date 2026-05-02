<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use App\Models\Convention_stage;
use App\Models\Document;
use App\Models\Entreprise;
use App\Models\Notification;
use App\Models\Offre;
use App\Models\Remarque;
use App\Models\Stage;
use App\Services\TraceLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EntrepriseDashboardController extends Controller
{
    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function entreprise(): Entreprise
    {
        $e = auth()->user()->entreprise;
        abort_unless($e, 403, 'Profil entreprise introuvable.');
        return $e;
    }

    // ─── Dashboard ───────────────────────────────────────────────────────────

    public function dashboard(): Response
    {
        $entreprise = $this->entreprise();

        $offres     = $entreprise->offres()->withCount('candidatures')->get();
        $stages     = Stage::with(['etudiant.utilisateur', 'convention'])
            ->where('entreprises_id', $entreprise->id)
            ->get()
            ->map(function ($stage) {
                $conv = $stage->convention;
                $stage->convention_status = $conv ? [
                    'entreprise' => $conv->signer_par_entreprise,
                    'tuteur'     => $conv->signer_par_tuteur,
                    'etudiant'   => $conv->signer_par_etudiant,
                    'complete'   => $conv->signer_par_entreprise && $conv->signer_par_tuteur && $conv->signer_par_etudiant,
                ] : null;
                return $stage;
            });

        $candidatures_pending = Candidature::with(['offre', 'etudiant'])
            ->whereHas('offre', fn($q) => $q->where('entreprise_id', $entreprise->id))
            ->where('statut', 'en_attente')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $notifications = \App\Models\Notification::where('proprietaire_id', auth()->id())
            ->where('est_lu', false)
            ->orderBy('date_envoi', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Entreprise/entreprise.dashboard', [
            'entreprise'           => $entreprise,
            'offres'               => $offres,
            'stages'               => $stages,
            'candidatures_pending' => $candidatures_pending,
            'notifications'        => $notifications,
            'stats' => [
                'offres_actives'   => $offres->where('est_active', true)->count(),
                'offres_pending'   => $offres->where('est_active', false)->count(),
                'stages'           => $stages->count(),
                'candidatures'     => Candidature::whereHas('offre', fn($q) => $q->where('entreprise_id', $entreprise->id))->count(),
            ],
        ]);
    }

    // ─── Offres ──────────────────────────────────────────────────────────────

    public function index_offre(): Response
    {
        $entreprise = $this->entreprise();
        $offres = $entreprise->offres()->withCount('candidatures')->orderBy('created_at', 'desc')->get();
 
        $filieres = \App\Models\Etudiant::select('filiere')
            ->distinct()->orderBy('filiere')->pluck('filiere');
 
        return Inertia::render('Entreprise/entreprise.offres', [
            'offres'   => $offres,
            'filieres' => $filieres,
        ]);
    }

    public function store_offre(Request $request): RedirectResponse
    {
        $request->validate([
            'titre'          => 'required|string|max:255',
            'description'    => 'required|string',
            'duree_semaines' => 'required|integer|min:1',
            'filiere_cible'  => 'nullable|string|max:100',
            'dateDebut'      => 'required|date',           // ← AJOUTER
        ]);
 
        $entreprise = $this->entreprise();
 
        Offre::create([
            'titre'          => $request->titre,
            'description'    => $request->description,
            'duree_semaines' => $request->duree_semaines,
            'filiere_cible'  => $request->filiere_cible,
            'dateDebut'      => $request->dateDebut,       // ← AJOUTER
            'entreprise_id'  => $entreprise->id,
            'est_active'     => false,
        ]);
 
        TraceLogger::log('store_offre', ['entreprise_id' => $entreprise->id]);
 
        return redirect()->route('entreprise.index.offre')
            ->with('success', 'Offre soumise, en attente de validation.');
    }


    // ─── Candidatures ────────────────────────────────────────────────────────

    public function index_candidatures(): Response
    {
        $entreprise = $this->entreprise();

        $candidatures = Candidature::with(['etudiant', 'offre'])
            ->whereHas('offre', fn($q) => $q->where('entreprise_id', $entreprise->id))
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($c) use ($entreprise) {
                $arr = $c->toArray();

                // Documents du candidat
                $arr['documents_etudiant'] = Document::where('utilisateurs_id', $c->etudiant_id)
                    ->orderBy('date_depot', 'desc')
                    ->get(['id', 'nom', 'type', 'date_depot'])
                    ->toArray();

                // Stage + convention
                $arr['stage_id']          = null;
                $arr['convention_status'] = null;

                $stage = Stage::with('convention')
                    ->where('etudiants_id', $c->etudiant_id)
                    ->where('entreprises_id', $entreprise->id)
                    ->latest('id')
                    ->first();

                if ($stage) {
                    $arr['stage_id'] = $stage->id;
                    $conv = $stage->convention;
                    if ($conv) {
                        $arr['convention_status'] = [
                            'entreprise' => $conv->signer_par_entreprise,
                            'tuteur'     => $conv->signer_par_tuteur,
                            'etudiant'   => $conv->signer_par_etudiant,
                            'complete'   => $conv->signer_par_entreprise
                                         && $conv->signer_par_tuteur
                                         && $conv->signer_par_etudiant,
                        ];
                    }
                }

                return $arr;
            })
            ->groupBy('offre_id');

        $offres = $entreprise->offres()->get()->keyBy('id');

        return Inertia::render('Entreprise/entreprise.candidatures', [
            'candidatures_par_offre' => $candidatures,
            'offres'                 => $offres,
        ]);
    }


    // ─── Convention ──────────────────────────────────────────────────────────

    public function signer_convention(int $stageId): RedirectResponse
    {
        $entreprise = $this->entreprise();

        $stage = Stage::where('id', $stageId)
            ->where('entreprises_id', $entreprise->id)
            ->firstOrFail();

        $convention = Convention_stage::firstOrCreate(
            ['stages_id' => $stage->id],
            [
                'signer_par_entreprise' => false,
                'signer_par_tuteur'     => false,
                'signer_par_etudiant'   => false,
            ]
        );

        $convention->signer_par_entreprise = true;
        $convention->save();

        Notification::create([
            'proprietaire_id' => $stage->etudiants_id,
            'message'         => "L'entreprise {$entreprise->nom_entreprise} a signé votre convention de stage.",
        ]);
        if ($stage->tuteurs_id) {
            Notification::create([
                'proprietaire_id' => $stage->tuteurs_id,
                'message'         => "L'entreprise {$entreprise->nom_entreprise} a signé la convention du stage de l'étudiant #{$stage->etudiants_id}.",
            ]);
        }

        TraceLogger::log('signer_convention_entreprise', [
            'entreprise_id' => $entreprise->id,
            'stage_id'      => $stageId,
        ]);

        return back()->with('success', 'Convention signée.');
    }

    // ─── Stages & missions ───────────────────────────────────────────────────

    public function index_stages(): Response
    {
        $entreprise = $this->entreprise();

        $stages = Stage::with([
            'etudiant.utilisateur',
            'tuteur.utilisateur',
            'convention',
        ])
            ->where('entreprises_id', $entreprise->id)
            ->get()
            ->map(function ($stage) {
                $conv = $stage->convention;
                $stage->convention_status = $conv ? [
                    'entreprise' => $conv->signer_par_entreprise,
                    'tuteur'     => $conv->signer_par_tuteur,
                    'etudiant'   => $conv->signer_par_etudiant,
                    'complete'   => $conv->signer_par_entreprise && $conv->signer_par_tuteur && $conv->signer_par_etudiant,
                ] : null;
                return $stage;
            });

        return Inertia::render('Entreprise/entreprise.stages', [
            'stages' => $stages,
        ]);
    }

    public function store_mission(Request $request, int $stageId): RedirectResponse
    {
        $entreprise = $this->entreprise();

        $stage = Stage::where('id', $stageId)
            ->where('entreprises_id', $entreprise->id)
            ->firstOrFail();

        $request->validate([
            'contenu' => 'required|string|max:2000',
        ]);

        Remarque::create([
            'auteur_id'              => auth()->id(),
            'cible_type'             => 'stage',
            'cible_id'               => $stage->id,
            'contenu'                => $request->contenu,
            'est_visible_etudiant'   => true,
            'est_visible_entreprise' => true,
        ]);

        Notification::create([
            'proprietaire_id' => $stage->etudiants_id,
            'message'         => "L'entreprise {$entreprise->nom_entreprise} vous a attribué une nouvelle mission.",
        ]);

        TraceLogger::log('store_mission', [
            'entreprise_id' => $entreprise->id,
            'stage_id'      => $stageId,
        ]);

        return back()->with('success', 'Mission attribuée.');
    }

    public function index_stage_detail(int $stageId): Response
    {
        $entreprise = $this->entreprise();

        $stage = Stage::with([
            'etudiant.utilisateur',
            'tuteur.utilisateur',
            'convention',
        ])
            ->where('id', $stageId)
            ->where('entreprises_id', $entreprise->id)
            ->firstOrFail();

        $missions = Remarque::pour('stage', $stage->id)
            ->where('auteur_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        $tous_remarques = Remarque::pour('stage', $stage->id)
            ->with('auteur')
            ->visibleParEntreprise()
            ->orderBy('created_at', 'desc')
            ->get();

        $conv = $stage->convention;
        $conventionStatus = $conv ? [
            'entreprise' => $conv->signer_par_entreprise,
            'tuteur'     => $conv->signer_par_tuteur,
            'etudiant'   => $conv->signer_par_etudiant,
            'complete'   => $conv->signer_par_entreprise && $conv->signer_par_tuteur && $conv->signer_par_etudiant,
        ] : null;

        return Inertia::render('Entreprise/entreprise.stage.detail', [
            'stage'             => $stage,
            'convention_status' => $conventionStatus,
            'missions'          => $missions,
            'remarques'         => $tous_remarques,
        ]);
    }
}