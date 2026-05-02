<?php

namespace App\Http\Middleware;

use App\Models\Dossier_stage;
use App\Models\Notification;
use App\Models\Stage;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'notifications' => fn () => $request->user()
                ? Notification::where('proprietaire_id', $request->user()->id)
                    ->orderBy('date_envoi', 'desc')
                    ->take(20)
                    ->get()
                : [],
            'etudiant_flags' => fn () => $this->getEtudiantFlags($request),
        ];
    }

private function getEtudiantFlags(Request $request): array
    {
        $user = $request->user();

        if (!$user || $user->role !== 'S') {
            return [
                'has_stage'           => false,
                'convention_complete' => false,
                'dossier_valide'      => false,
            ];
        }

        $stage = Stage::with('convention')
            ->where('etudiant_id', $user->id)
            ->latest('id')
            ->first();

        if (!$stage) {
            return [
                'has_stage'           => false,
                'convention_complete' => false,
                'dossier_valide'      => false,
            ];
        }

        $conv = $stage->convention;
        $conventionComplete = $conv
            && $conv->signer_par_entreprise
            && $conv->signer_par_tuteur
            && $conv->signer_par_etudiant;

        $dossier = Dossier_stage::where('etudiant_id', $user->id)->first();
        $dossierValide = $dossier?->est_valide ?? false;

        return [
            'has_stage'           => true,
            'convention_complete' => $conventionComplete,
            'dossier_valide'      => $dossierValide,
        ];
    }
}