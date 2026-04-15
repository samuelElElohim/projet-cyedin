<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUtilisateur;
class Tuteur extends Utilisateur
{
    use HasUtilisateur;
    protected $fillable = [

        'utilisateurs_id',
        'departement',
        'date_affectation' // je vois pas vraiment l'interet??? 


    ];
    //
}
