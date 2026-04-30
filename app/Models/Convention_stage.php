<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Convention_stage extends Model
{
    
    protected $fillable = ['stage_id', 'date_creation', 'signer_par_entreprise', 'signer_par_tuteur', 'signer_par_etudiant'];


    public function stage()
    {
        return $this->belongsTo(Stage::class, 'stage_id');
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