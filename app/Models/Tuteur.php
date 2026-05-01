<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUtilisateur;

class Tuteur extends Model
{
    use HasUtilisateur;

    protected $primaryKey = 'utilisateurs_id';
    public $incrementing  = false;

    protected $fillable = [
        'utilisateurs_id',
        'departement',
        'est_jury',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateurs_id');
    }

    public function stages()
    {
        return $this->hasMany(Stage::class, 'tuteurs_id', 'utilisateurs_id');
    }

    /**
     * Étudiants suivis par ce tuteur (table pivot tuteur_etudiant).
     */
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

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    // Scopes
    public function scopeJury($query)
    {
        return $query->where('est_jury', true);
    }


    // deprecated
    public function scopeDepartement($query, string $departement)
    {
        return $query->where('departement', $departement);
    }
}