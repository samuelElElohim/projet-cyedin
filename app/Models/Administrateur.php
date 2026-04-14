<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Administrateur extends Model
{
    protected $fillable = [
      'utilisateurs_id',
      'derniere_action_log'  
    ];
    //

}