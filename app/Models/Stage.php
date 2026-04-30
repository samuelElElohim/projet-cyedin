<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    protected $fillable = ['sujet', 'etudiant_id', 'entreprise_id', 'tuteur_id', 'duree_semaines'];
    protected $guarded = ['id'];
    public $timestamps = false;
   


    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'etudiant_id', 'utilisateur_id');
    }

    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class, 'entreprise_id');
    }

    public function tuteur()
    {
        return $this->belongsTo(Tuteur::class, 'tuteur_id', 'utilisateur_id');
    }

    public function convention()
    {
        return $this->hasOne(Convention_stage::class, 'stage_id');
    }

    // Scopes
    public function scopeParTuteur($query, int $tuteurId)
    {
        return $query->where('tuteur_id', $tuteurId);
    }

    public function scopeParEntreprise($query, int $entrepriseId)
    {
        return $query->where('entreprise_id', $entrepriseId);
    }

    public function scopeConventionComplete($query)
    {
        return $query->whereHas('convention', fn($q) => $q
            ->where('signer_par_entreprise', true)
            ->where('signer_par_tuteur', true)
            ->where('signer_par_etudiant', true)
        );
    }

    public function remarques()
    {
        return \App\Models\Remarque::where('cible_type', 'stage')
                                    ->where('cible_id', $this->id);
    }
}