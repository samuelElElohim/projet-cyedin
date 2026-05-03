<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use App\Models\Convention_stage;
use App\Models\Document;
use App\Models\Entreprise;
use App\Models\Notification;
use App\Models\Offre;
use App\Models\Remarque;
use App\Models\Secteur;
use App\Models\Stage;
use App\Models\Tag;
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
            ->where('entreprise_id', $entreprise->id)
            ->get()
            ->map(function ($stage) {
                $stage->convention_status = \App\Services\ConventionService::status($stage->convention);
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
        // Charger les offres avec secteur, filière et tags
        $offres = $entreprise->offres()
            ->with(['secteur.filiere', 'tags'])
            ->withCount('candidatures')
            ->orderBy('created_at', 'desc')
            ->get();

        // Secteurs disponibles groupés par filière pour le formulaire
        $secteurs = Secteur::with('filiere')->orderBy('secteur')->get();
        $tags = Tag::with('secteur')->orderBy('tag')->get();

        return Inertia::render('Entreprise/entreprise.offres', [
            'offres'   => $offres,
            'secteurs' => $secteurs,
            'tags'     => $tags,
        ]);
    }

    public function store_offre(Request $request): RedirectResponse
    {
        $request->validate([
            'titre'          => 'required|string|max:255',
            'description'    => 'required|string',
            'duree_semaines' => 'required|integer|min:1',
            'secteur_id'     => 'nullable|integer|exists:secteurs,id',
            'tags_ids'       => 'nullable|array',
            'tags_ids.*'     => 'integer|exists:tags,id',
            'dateDebut'      => 'required|date',
        ]);

        $entreprise = $this->entreprise();

        $offre = Offre::create([
            'titre'          => $request->titre,
            'description'    => $request->description,
            'duree_semaines' => $request->duree_semaines,
            'secteur_id'     => $request->secteur_id,
            // filiere_id déduit du secteur
            'filiere_id'     => $request->secteur_id
                ? Secteur::find($request->secteur_id)?->filiere_id
                : null,
            'dateDebut'      => $request->dateDebut,
            'entreprise_id'  => $entreprise->id,
            'est_active'     => false,
        ]);

        // Tags many-to-many
        if ($request->filled('tags_ids')) {
            $offre->tags()->sync($request->tags_ids);
        }

        TraceLogger::log('store_offre', ['entreprise_id' => $entreprise->id, 'offre_id' => $offre->id]);

        return redirect()->route('entreprise.index.offre')
            ->with('success', 'Offre publiée avec succès.');
    }

    public function destroy_offre(Offre $offre): RedirectResponse
    {
        $entreprise = $this->entreprise();
        abort_unless($offre->entreprise_id === $entreprise->id, 403);
        $etudiantIds = Candidature::where('offre_id', $offre->id)->pluck('etudiant_id');

        abort_if(
            Stage::where('entreprise_id', $entreprise->id)
                ->whereIn('etat', ['en_attente_convention', 'actif'])
                ->whereIn('etudiant_id', $etudiantIds)
                ->exists(),
            422,
            'Impossible de supprimer une offre liée à un stage actif.'
        );

        $offre->delete();

        return back()->with('success', 'Offre supprimée.');
    }


    // ─── Candidatures ────────────────────────────────────────────────────────

    public function index_candidatures(): Response
    {
        $entreprise = $this->entreprise();

        $candidatures = Candidature::with(['etudiant', 'offre'])
            ->whereHas('offre', fn($q) => $q->where('entreprise_id', $entreprise->id))
            ->whereNotIn('statut', ['annulee', 'expiree'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($c) use ($entreprise) {
                $arr = $c->toArray();

                // Documents du candidat
                $arr['documents_etudiant'] = Document::where('utilisateur_id', $c->etudiant_id)
                    ->orderBy('date_depot', 'desc')
                    ->get(['id', 'nom', 'type', 'date_depot'])
                    ->toArray();

                // Stage + convention — uniquement pour les stages encore actifs
                $arr['stage_id']          = null;
                $arr['convention_status'] = null;

                $stage = Stage::with('convention')
                    ->where('etudiant_id', $c->etudiant_id)
                    ->where('entreprise_id', $entreprise->id)
                    ->whereIn('etat', ['en_attente_convention', 'actif'])
                    ->latest('id')
                    ->first();

                if ($stage) {
                    $arr['stage_id']          = $stage->id;
                    $arr['convention_status'] = \App\Services\ConventionService::status($stage->convention);
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
            ->where('entreprise_id', $entreprise->id)
            ->firstOrFail();

        $result = app(\App\Services\ConventionService::class)->sign($stage, 'entreprise', auth()->id());

        return $result === 'already_signed'
            ? back()->with('error', 'Vous avez déjà signé cette convention.')
            : back()->with('success', 'Convention signée.');
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
            ->where('entreprise_id', $entreprise->id)
            ->get()
            ->map(function ($stage) {
                $stage->convention_status = \App\Services\ConventionService::status($stage->convention);
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
            ->where('entreprise_id', $entreprise->id)
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
            'proprietaire_id' => $stage->etudiant_id,
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
            ->where('entreprise_id', $entreprise->id)
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

        return Inertia::render('Entreprise/entreprise.stage.detail', [
            'stage'             => $stage,
            'convention_status' => \App\Services\ConventionService::status($stage->convention),
            'missions'          => $missions,
            'remarques'         => $tous_remarques,
        ]);
    }
}