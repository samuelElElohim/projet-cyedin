<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUtilisateur;
class Administrateur extends Model

{
  use HasUtilisateur;
  protected $fillable = [
    'utilisateurs_id',
    'derniere_action_log'  
  ];

}