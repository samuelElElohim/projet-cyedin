<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    protected $fillable = ['sujet', 'etudiants_id', 'entreprises_id', 'tuteurs_id', 'duree_semaines'];
    protected $guarded = ['id'];


    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'etudiants_id', 'utilisateurs_id');
    }

    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class, 'entreprises_id');
    }

    public function tuteur()
    {
        return $this->belongsTo(Tuteur::class, 'tuteurs_id', 'utilisateurs_id');
    }

    public function convention()
    {
        return $this->hasOne(Convention_stage::class, 'stages_id');
    }



    //scopes

    // Scope pour filtrer par tuteur
    public function scopeParTuteur($query, int $tuteurId)
    {
        return $query->where('tuteurs_id', $tuteurId);
    }

    // Scope pour filtrer par entreprise
    public function scopeParEntreprise($query, int $entrepriseId)
    {
        return $query->where('entreprises_id', $entrepriseId);
    }

    // Scope pour filtrer les conventions completes
    public function scopeConventionComplete($query)
    {
        return $query->whereHas('convention', fn($q) => $q->where('signer_par_entreprise', true)
            ->where('signer_par_tuteur', true)
            ->where('signer_par_etudiant', true)
        );
    }
}
