<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUtilisateur;

class Tuteur extends Model
{
    use HasUtilisateur;


    protected $fillable = [
        'utilisateur_id',
        'filiere_id',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    public function stages()
    {
        return $this->hasMany(Stage::class, 'tuteur_id', 'utilisateur_id');
    }

    public function etudiants()
    {
        return $this->belongsToMany(
            Etudiant::class,
            'tuteur_etudiant',
            'tuteur_id',
            'etudiant_id',
            'utilisateurs_id',
            'utilisateurs_id'
        )->withTimestamps();
    }

    // filiere principale (optionnel, pour filtre rapide)
    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    // secteurs précis supervisés par ce tuteur
    public function secteurs()
    {
        return $this->belongsToMany(
            Secteur::class,
            'tuteur_secteurs',
            'tuteur_id',
            'secteur_id',
            'utilisateur_id'
        )->withTimestamps();
    }

    public function scopeJury($query)
    {
        return $query->where('est_jury', true);
    }
}
