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

    // Scopes
    public function scopeJury($query)
    {
        return $query->where('est_jury', true);
    }

    public function scopeDepartement($query, string $departement)
    {
        return $query->where('departement', $departement);
    }
}