<?php

namespace App\Console\Commands;

use App\Models\Administrateur;
use App\Models\DemandeFormation;
use App\Models\Notification;
use App\Models\Offre;
use App\Models\Utilisateur;
use Illuminate\Console\Command;

class NotificationsPeriodiques extends Command
{
    protected $signature   = 'admin:notifications-periodiques';
    protected $description = 'Envoie aux admins un résumé périodique des requêtes en attente';

    public function handle(): void
    {
        $offresEnAttente      = Offre::where('est_active', false)->count();
        $entreprisesEnAttente = Utilisateur::where('role', 'E')->where('est_active', false)->count();
        $demandesEnAttente    = DemandeFormation::enAttente()->count();

        if ($offresEnAttente === 0 && $entreprisesEnAttente === 0 && $demandesEnAttente === 0) {
            $this->info('Aucune requête en attente. Aucune notification envoyée.');
            return;
        }

        $message = "📊 Résumé périodique : "
            . "{$offresEnAttente} offre(s) en attente de validation, "
            . "{$entreprisesEnAttente} entreprise(s) à valider, "
            . "{$demandesEnAttente} demande(s) de formation en attente.";

        $adminIds = Administrateur::pluck('utilisateurs_id');

        foreach ($adminIds as $adminId) {
            Notification::create([
                'proprietaire_id' => $adminId,
                'message'         => $message,
            ]);
        }

        $this->info("Notification envoyée à {$adminIds->count()} admin(s).");
    }
}
