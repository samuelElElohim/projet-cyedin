<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUtilisateur;
class Tuteur extends Model //extends Model au lieu de Utilisateur
{
    use HasUtilisateur;
    protected $fillable = [
        'utilisateurs_id',
        'departement',
        'est_jury',
    ];
    //

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateurs_id');
    }

    public function stages()
    {
        return $this->hasMany(Stage::class, 'tuteurs_id', 'utilisateurs_id');
    }


    //scopes
    // Scope pour filtrer les tuteurs qui sont jury
    public function scopeJury($query)
    {
        return $query->where('est_jury', true);
    }

    // Scope pour filtrer les tuteurs par departement
    public function scopeDepartement($query, string $departement)
    {
        return $query->where('departement', $departement);
    }
}
