<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Offre extends Model
{
    protected $fillable = [
    'titre', 'description','entreprise_id', 'duree_semaines'
   ] ;

    public function entreprise(){
      return $this->belongsTo(Entreprise::class, 'entreprise_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'offre_tag');
    }

    public function candidatures(): HasMany
    {
    return $this->hasMany(Candidature::class);
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
}
