<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Candidature;
use App\Models\Dossier_stage;
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
                'actif'      => $query->where('etat', 'actif'),
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
                $stage->etat === 'termine' => 'termine',
                $conventionComplete        => 'actif',
                default                    => 'en_attente',
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

        // Reset dossier so the student can start a fresh cycle
        Dossier_stage::where('etudiant_id', $stage->etudiant_id)
            ->update(['est_valide' => false]);

        // Archive all candidatures tied to this stage's offer
        $acceptedCandidature = Candidature::where('etudiant_id', $stage->etudiant_id)
            ->where('statut', 'acceptee')
            ->whereHas('offre', fn($q) => $q->where('entreprise_id', $stage->entreprise_id))
            ->latest()
            ->first();

        if ($acceptedCandidature) {
            // Deactivate the offer so it disappears from the student feed
            $acceptedCandidature->offre->update(['est_active' => false]);

            // Archive the confirmed candidature itself
            $acceptedCandidature->update(['statut' => 'annulee']);

            // Cancel any remaining pending candidatures on the same offer
            Candidature::where('offre_id', $acceptedCandidature->offre_id)
                ->whereIn('statut', ['en_attente', 'accepted_pending_choice'])
                ->update(['statut' => 'annulee']);
        }

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
