<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{

    protected $fillable = ['id','proprietaire_id','message','date_envoi','est_lu'];
    

    public function proprietaire()
    {
        return $this->belongsTo(Utilisateur::class, 'proprietaire_id');
    }

    public function offre(): BelongsTo
    {
        return $this->belongsTo(Offre::class);
    }

    //scopes

    // Scope pour les notifications non lues
    public function scopeNonLues($query)
    {
        return $query->where('est_lu', false);
    }

    // Scope pour les notifications lues
    public function scopeLues($query)
    {
        return $query->where('est_lu', true);
    }

    // Scope pour filtrer par proprietaire
    public function scopeParProprietaire($query, int $utilisateurId)
    {
        return $query->where('proprietaire_id', $utilisateurId);
    }
}
