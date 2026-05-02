<?php

namespace App\Console\Commands;

use App\Models\Candidature;
use App\Models\Notification;
use Illuminate\Console\Command;

class ExpirerCandidatures extends Command
{
    protected $signature   = 'candidatures:expirer';
    protected $description = 'Expire les candidatures dont le délai de 7 jours est dépassé';

    public function handle(): void
    {
        $expirees = Candidature::with(['offre.entreprise'])
            ->where('statut', 'accepted_pending_choice')
            ->where('deadline_choix', '<', now())
            ->get();

        foreach ($expirees as $candidature) {
            $candidature->update(['statut' => 'expiree']);

            // Notifier l'étudiant
            Notification::create([
                'proprietaire_id' => $candidature->etudiant_id,
                'message'         => 'Votre délai pour confirmer « ' . $candidature->offre->titre . ' » a expiré. L\'offre n\'est plus disponible.',
            ]);

            // Notifier l'entreprise
            if ($candidature->offre->entreprise?->utilisateur_id) {
                Notification::create([
                    'proprietaire_id' => $candidature->offre->entreprise->utilisateur_id,
                    'message'         => 'L\'étudiant n\'a pas répondu dans les délais pour « ' . $candidature->offre->titre . ' ».',
                ]);
            }
        }

        $count = $expirees->count();
        $this->info("{$count} candidature(s) expirée(s).");
    }
}