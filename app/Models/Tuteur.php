<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tuteur extends Utilisateur
{
    protected $fillable = [

        'utilisateurs_id',
        'departement',


    ];
    //
}
