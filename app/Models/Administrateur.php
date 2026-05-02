<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUtilisateur;
class Administrateur extends Model

{
  use HasUtilisateur;
  protected $fillable = [
    'utilisateur_id',
    'derniere_action_log'  
  ];


  public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

  // scopes

  // scope pour les admins qui ont le compte actif
  public function scopeActif($query)
  {
      return $query->whereHas('utilisateur', fn($q) => $q->where('est_active', true));
  }
  // scope pour les admins qui ont fait une action dans les 7 derniers jours? modifiable apres pour duree
  public function scopeActionRecente($query, int $jours = 7)
  {
      return $query->where('derniere_action_log', '>=', now()->subDays($jours));
  }
}