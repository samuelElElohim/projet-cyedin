<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entreprise extends  Utilisateur
{ 
    protected $primaryKey = 'utilisateurs_id'; // ← indique la vraie PK
    protected $fillable = [
        'utilisateurs_id',
        'nom_entreprise',
        'addresse',
        'secteur'
    ];

}
