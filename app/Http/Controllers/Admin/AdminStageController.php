<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Stage;
use App\Services\ConventionService;
use App\Services\TraceLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminStageController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Stage::with([
            'etudiant.utilisateur',
            'etudiant.filiere',
            'etudiant.dossier',
            'entreprise',
            'tuteur.utilisateur',
            'convention',
        ])->orderBy('id', 'desc');

        if ($request->filled('search')) {
            $query->where(fn($q) =>
                $q->where('sujet', 'ilike', '%' . $request->search . '%')
                  ->orWhereHas('etudiant.utilisateur', fn($sq) =>
                      $sq->where('nom', 'ilike', '%' . $request->search . '%')
                  )
                  ->orWhereHas('entreprise', fn($sq) =>
                      $sq->where('nom_entreprise', 'ilike', '%' . $request->search . '%')
                  )
            );
        }

        if ($request->filled('statut') && $request->statut !== 'all') {
            match ($request->statut) {
                'termine'    => $query->where('etat', 'termine'),
                'complet'    => $query->where('etat', 'actif')
                                      ->whereHas('etudiant.dossier', fn($q) => $q->where('est_valide', true)),
                'actif'      => $query->where('etat', 'actif')
                                      ->where(fn($q) => $q
                                          ->whereDoesntHave('etudiant.dossier')
                                          ->orWhereHas('etudiant.dossier', fn($dq) => $dq->where('est_valide', false))
                                      ),
                'en_attente' => $query->where('etat', 'en_attente_convention'),
                default      => null,
            };
        }

        $stages = $query->get()->map(function ($stage) {
            $conventionComplete = $stage->convention?->estComplete() ?? false;
            $dossierValide      = $stage->etudiant?->dossier?->est_valide ?? false;

            $stage->convention_status = ConventionService::status($stage->convention);
            $stage->dossier_valide    = $dossierValide;
            $stage->statut_global     = match(true) {
                $stage->etat === 'termine'                           => 'termine',
                $conventionComplete && $dossierValide                => 'dossier_valide',
                $conventionComplete                                  => 'actif',
                default                                              => 'en_attente',
            };

            return $stage;
        });

        return Inertia::render('Admin/admin.index.stage', [
            'stages'  => $stages,
            'count'   => $stages->count(),
            'filters' => $request->only(['search', 'statut']),
        ]);
    }

    public function terminer(int $id): RedirectResponse
    {
        $stage = Stage::with(['etudiant.utilisateur', 'convention'])->findOrFail($id);
        abort_unless(in_array($stage->etat, ['en_attente_convention', 'actif']), 422, 'Stage déjà terminé.');

        $stage->update(['etat' => 'termine']);

        Notification::create([
            'proprietaire_id' => $stage->etudiant_id,
            'message'         => 'Votre stage « ' . $stage->sujet . ' » a été clôturé par un administrateur.',
        ]);

        TraceLogger::log('admin_force_terminer_stage', [
            'stage_id' => $stage->id,
            'admin_id' => auth()->id(),
        ]);

        return back()->with('success', 'Stage clôturé.');
    }
}
