<?php

namespace App\Services;

use App\Models\Convention_stage;
use App\Models\Notification;
use App\Models\Stage;

class ConventionService
{
    /**
     * Sign a convention for one party and handle all side effects.
     *
     * @param  Stage   $stage
     * @param  string  $role   'etudiant' | 'tuteur' | 'entreprise'
     * @param  int     $signerId  auth()->id() of the signer
     * @return 'signed' | 'already_signed'
     */
    public function sign(Stage $stage, string $role, int $signerId): string
    {
        $convention = $stage->convention;
        abort_unless($convention, 404, 'Aucune convention associée à ce stage.');

        $field = match($role) {
            'etudiant'   => 'signer_par_etudiant',
            'tuteur'     => 'signer_par_tuteur',
            'entreprise' => 'signer_par_entreprise',
        };

        if ($convention->$field) {
            return 'already_signed';
        }

        $convention->update([$field => true]);
        $convention->refresh();
        $convention->activerStageIfComplete();

        $this->notify($stage, $role, $convention);

        TraceLogger::log("{$role}_signe_convention", [
            'stage_id'      => $stage->id,
            'signer_id'     => $signerId,
            'convention_id' => $convention->id,
        ]);

        return 'signed';
    }

    /**
     * Build the convention_status array used by multiple controllers.
     */
    public static function status(?Convention_stage $convention): ?array
    {
        if (!$convention) {
            return null;
        }

        return [
            'entreprise' => (bool) $convention->signer_par_entreprise,
            'tuteur'     => (bool) $convention->signer_par_tuteur,
            'etudiant'   => (bool) $convention->signer_par_etudiant,
            'complete'   => $convention->estComplete(),
        ];
    }

    private function notify(Stage $stage, string $role, Convention_stage $convention): void
    {
        $label = match($role) {
            'etudiant'   => "L'étudiant",
            'tuteur'     => 'Le tuteur',
            'entreprise' => "L'entreprise",
        };

        $msg = "📄 {$label} a signé la convention pour le stage « {$stage->sujet} ».";

        if ($stage->etudiant_id && $role !== 'etudiant') {
            Notification::create(['proprietaire_id' => $stage->etudiant_id, 'message' => $msg]);
        }
        if ($stage->tuteur_id && $role !== 'tuteur') {
            Notification::create(['proprietaire_id' => $stage->tuteur_id, 'message' => $msg]);
        }
        if ($stage->entreprise_id && $role !== 'entreprise') {
            Notification::create(['proprietaire_id' => $stage->entreprise_id, 'message' => $msg]);
        }

        if ($convention->estComplete()) {
            Notification::create([
                'proprietaire_id' => $stage->etudiant_id,
                'message'         => '✅ Toutes les parties ont signé la convention. Votre stage est maintenant actif !',
            ]);
        }
    }
}
