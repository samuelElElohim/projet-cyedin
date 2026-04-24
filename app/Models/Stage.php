<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    protected $fillable = ['sujet', 'etudiant_id', 'entreprise_id', 'tuteur_id', 'duree_semaines'];
    protected $guarded = ['id'];


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



    //scopes

    // Scope pour filtrer par tuteur
    public function scopeParTuteur($query, int $tuteurId)
    {
        return $query->where('tuteur_id', $tuteurId);
    }

    // Scope pour filtrer par entreprise
    public function scopeParEntreprise($query, int $entrepriseId)
    {
        return $query->where('entreprise_id', $entrepriseId);
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
