<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Offre extends Model
{
   protected $fillable = [
    'titre', 'description','entreprise_id', 'duree_semaines'
   ] ;

   public function entreprise(){
      return $this->belongsTo(Entreprise::class);
    }
}
