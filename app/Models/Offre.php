<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Offre extends Model
{
   protected $fillable = [
    'titre', 'description', 'entreprise_id', 'duree_semaines', 'filiere_cible'
];

   public function entreprise(){
      return $this->belongsTo(Entreprise::class, 'entreprise_id');
    }


    //scopes

    // Scope pour filtrer les offres récentes (par défaut, les offres créées dans les 30 derniers jours)
    public function scopeRecente($query, int $jours = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($jours));
    }


   // Scope pour filtrer les offres par secteur d'activité de l'entreprise
    public function scopeDureeMax($query, int $semaines)
    {
        return $query->where('duree_semaines', '<=', $semaines);
    }

    public function candidatures()
    {
        return $this->hasMany(\App\Models\Candidature::class, 'offre_id');
    }
 
    public function remarques()
    {
        return $this->morphMany(\App\Models\Remarque::class, 'cible');
        // Note : cible_type = 'offre', cible_id = id de l'offre
        // (nécessite d'utiliser Remarque::scopePour('offre', $id) car pas de vraie relation Eloquent polymorphe ici)
    }
}
