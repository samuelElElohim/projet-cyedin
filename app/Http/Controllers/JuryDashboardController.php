<?php

namespace App\Http\Controllers;

use App\Models\CahierStage;
use App\Models\Dossier_stage;
use App\Models\Document;
use App\Models\Notification;
use App\Models\Remarque;
use App\Models\Stage;
use App\Services\TraceLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JuryDashboardController extends Controller
{
    // ─── Dashboard ───────────────────────────────────────────────────────────

    public function dashboard(): Response
    {
        $notifications = Notification::where('proprietaire_id', auth()->id())
            ->where('est_lu', false)
            ->orderBy('date_envoi', 'desc')
            ->take(5)
            ->get();

        $dossiers_pending = Dossier_stage::with(['etudiant.utilisateur'])
            ->where('est_valide', false)
            ->whereNotNull('date_soumission')
            ->orderBy('date_soumission', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Jury/jury.dashboard', [
            'notifications'   => $notifications,
            'dossiers_pending' => $dossiers_pending,
            'stats' => [
                'dossiers_total'   => Dossier_stage::count(),
                'dossiers_valides' => Dossier_stage::where('est_valide', true)->count(),
                'dossiers_pending' => Dossier_stage::where('est_valide', false)
                                        ->whereNotNull('date_soumission')->count(),
                'stages_total'     => Stage::count(),
            ],
        ]);
    }

    // ─── Dossiers ────────────────────────────────────────────────────────────

    public function index_dossiers(Request $request): Response
    {
        $query = Dossier_stage::with(['etudiant.utilisateur', 'documents'])
            ->orderBy('date_soumission', 'desc');

        if ($request->filled('search')) {
            $query->whereHas('etudiant.utilisateur', fn($q) =>
                $q->where('nom', 'ilike', '%' . $request->search . '%')
                  ->orWhere('email', 'ilike', '%' . $request->search . '%')
            );
        }

        if ($request->filled('statut') && $request->statut !== 'all') {
            $query->where('est_valide', $request->statut === 'valide');
        }

        $dossiers = $query->get();

        return Inertia::render('Jury/jury.dossiers', [
            'dossiers' => $dossiers,
            'filters'  => $request->only(['search', 'statut']),
        ]);
    }

        public function show_dossier(int $dossierId): Response
    {
        $dossier = Dossier_stage::with([
            'etudiant.utilisateur',
            'documents',
        ])->findOrFail($dossierId);
 
        $stage = $dossier->etudiant?->stages()
            ->with(['entreprise', 'tuteur.utilisateur', 'convention'])
            ->latest('id')
            ->first();
 
        $remarques = Remarque::pour('dossier_stage', $dossier->id)
            ->with('auteur')
            ->orderBy('created_at', 'desc')
            ->get();
 
        $cahier = CahierStage::where('etudiant_id', $dossier->etudiants_id)
            ->visibleJury()
            ->orderBy('date_entree', 'desc')
            ->get();
 
        // Missions affectées par les tuteurs sur le stage
        $missions = $stage
            ? Remarque::where('cible_type', 'stage')
                ->where('cible_id', $stage->id)
                ->whereHas('auteur', fn($q) => $q->where('role', 'T'))
                ->with('auteur')
                ->orderBy('created_at', 'asc')
                ->get()
            : collect();
 
        return Inertia::render('Jury/jury.dossier.detail', [
            'dossier'   => $dossier,
            'stage'     => $stage,
            'remarques' => $remarques,
            'cahier'    => $cahier,
            'missions'  => $missions,
        ]);
    }

    public function valider_dossier(int $dossierId): RedirectResponse
    {
        $dossier = Dossier_stage::findOrFail($dossierId);
        $dossier->est_valide      = true;
        $dossier->date_soumission = $dossier->date_soumission ?? now();
        $dossier->save();

        Notification::create([
            'proprietaire_id' => $dossier->etudiants_id,
            'message'         => 'Votre dossier de stage a été validé par le jury. Félicitations !',
        ]);

        TraceLogger::log('jury_valider_dossier', ['dossier_id' => $dossierId, 'jury_id' => auth()->id()]);

        return back()->with('success', 'Dossier validé.');
    }

    public function invalider_dossier(int $dossierId): RedirectResponse
    {
        $dossier = Dossier_stage::findOrFail($dossierId);
        $dossier->est_valide = false;
        $dossier->save();

        Notification::create([
            'proprietaire_id' => $dossier->etudiants_id,
            'message'         => 'Votre dossier de stage a été retourné par le jury. Consultez les remarques.',
        ]);

        TraceLogger::log('jury_invalider_dossier', ['dossier_id' => $dossierId, 'jury_id' => auth()->id()]);

        return back()->with('success', 'Dossier retourné à l\'étudiant.');
    }

    // ─── Remarques ───────────────────────────────────────────────────────────

    public function store_remarque(Request $request): RedirectResponse
    {
        $request->validate([
            'cible_type'          => 'required|in:dossier_stage,stage',
            'cible_id'            => 'required|integer',
            'contenu'             => 'required|string|max:2000',
            'visible_etudiant'    => 'boolean',
        ]);

        Remarque::create([
            'auteur_id'              => auth()->id(),
            'cible_type'             => $request->cible_type,
            'cible_id'               => $request->cible_id,
            'contenu'                => $request->contenu,
            'est_visible_etudiant'   => $request->boolean('visible_etudiant', true),
            'est_visible_entreprise' => false,
        ]);

        return back()->with('success', 'Remarque ajoutée.');
    }

    // ─── Stages ──────────────────────────────────────────────────────────────

    public function index_stages(Request $request): Response
    {
        $query = Stage::with([
            'etudiant.utilisateur',
            'entreprise',
            'tuteur.utilisateur',
            'convention',
        ])->orderBy('id', 'desc');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('sujet', 'ilike', '%' . $request->search . '%')
                  ->orWhereHas('etudiant.utilisateur', fn($sq) =>
                      $sq->where('nom', 'ilike', '%' . $request->search . '%')
                  );
            });
        }

        $stages = $query->get()->map(function ($stage) {
            $conv = $stage->convention;
            $stage->convention_complete = $conv
                && $conv->signer_par_entreprise
                && $conv->signer_par_tuteur
                && $conv->signer_par_etudiant;
            return $stage;
        });

        return Inertia::render('Jury/jury.stages', [
            'stages'  => $stages,
            'filters' => $request->only(['search']),
        ]);
    }
}
