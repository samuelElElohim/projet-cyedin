<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tuteur extends Utilisateur
{
    protected $fillable = [

        'utilisateurs_id',
        'departement',
        'date_affectation' // je vois pas vraiment l'interet??? 


    ];
    //
}
