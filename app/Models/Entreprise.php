<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUtilisateur;

class Entreprise extends Model
{
    use HasUtilisateur;

    protected $fillable = [
        'utilisateurs_id',
        'nom_entreprise',
        'addresse',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateurs_id');
    }

    public function offres()
    {
        return $this->hasMany(Offre::class, 'entreprise_id');
    }

    public function stages()
    {
        return $this->hasMany(Stage::class, 'entreprises_id');
    }

    // filiere→secteur→tag : niveau macro
    public function filieres()
    {
        return $this->belongsToMany(Filiere::class, 'entreprises_filieres');
    }

    // niveau précis
    public function secteurs()
    {
        return $this->belongsToMany(Secteur::class, 'entreprise_secteurs');
    }

    public function scopeAvecOffres($query)
    {
        return $query->whereHas('offres');
    }

    public function scopeAvecStages($query)
    {
        return $query->whereHas('stages');
    }
}
