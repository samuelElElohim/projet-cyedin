<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entreprise extends  Utilisateur
{ 
    protected $fillable = [
        'utilisateurs_id',
        'nom_entreprise',
        'addresse',
        'secteur'
    ];

}
