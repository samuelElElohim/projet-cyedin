<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offre extends Model
{
   protected $fillable = [
    'titre', 'description', 'entreprise', 'duree_semaines'
   ] ;

   
}
