<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUtilisateur;
class Jury extends Model
{   
    use HasUtilisateur;
    protected $fillable = [
        'utilisateur_id',
        'departement'
    ];


    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    //scopes
    // Scope pour filtrer les jurys par departement
    public function scopeDepartement($query, string $departement)
    {
        return $query->where('departement', $departement);
    }
}
