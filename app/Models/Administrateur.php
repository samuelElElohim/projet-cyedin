<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Administrateur extends Utilisateur
{
    protected $fillable = [
      'utilisateurs_id',
      'derniere_action_log'  
    ];
    //

}