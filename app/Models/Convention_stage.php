<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Dossier_stage;

class Convention_stage extends Model
{
    public $timestamps   = false;
    public $incrementing = false;
    protected $primaryKey = 'stage_id';

    protected $fillable = [
        'stage_id',
        'date_creation',
        'signer_par_entreprise',
        'signer_par_tuteur',
        'signer_par_etudiant',
    ];

    public function stage()
    {
        return $this->belongsTo(Stage::class, 'stage_id');
    }

    public function estComplete(): bool
    {
        return $this->signer_par_entreprise
            && $this->signer_par_tuteur
            && $this->signer_par_etudiant;
    }

    public function activerStageIfComplete(): void
    {
        if (!$this->estComplete()) return;

        $stage = $this->stage()->first();
        if (!$stage) return;

        $stage->update(['etat' => 'actif']);

        Dossier_stage::where('etudiants_id', $stage->etudiants_id)
            ->update(['est_valide' => true, 'date_soumission' => now()]);
    }

    // Scopes
    public function scopeComplete($query)
    {
        return $query->where('signer_par_entreprise', true)
                     ->where('signer_par_tuteur', true)
                     ->where('signer_par_etudiant', true);
    }

    public function scopeEnAttente($query)
    {
        return $query->where(fn($q) =>
            $q->where('signer_par_entreprise', false)
              ->orWhere('signer_par_tuteur', false)
              ->orWhere('signer_par_etudiant', false)
        );
    }

    public function scopeSigneeParEtudiant($query)
    {
        return $query->where('signer_par_etudiant', true);
    }
}