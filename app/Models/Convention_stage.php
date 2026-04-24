<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Convention_stage extends Model  // probleme de extends, Model au lieu de Stage
{
    
    protected $fillable = ['stage_id', 'date_creation', 'signer_par_entreprise', 'signer_par_tuteur', 'signer_par_etudiant'];


    // une convention appartient un stage
    public function stage()
    {
        return $this->belongsTo(Stage::class, 'stage_id');
    }


    //scopes

    // Scope pour les conventions completes
    public function scopeComplete($query)
    {
        return $query->where('signer_par_entreprise', true)
                     ->where('signer_par_tuteur', true)
                     ->where('signer_par_etudiant', true);
    }

    // Scope pour les conventions en attente de signature
    public function scopeEnAttente($query)
    {
        return $query->where(fn($q) =>
            $q->where('signer_par_entreprise', false)
              ->orWhere('signer_par_tuteur', false)
              ->orWhere('signer_par_etudiant', false)
        );
    }

    // Scope pour les conventions signees par l'etudiant
    public function scopeSigneeParEtudiant($query)
    {
        return $query->where('signer_par_etudiant', true);
    }
    
}
