<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
   
    protected $table = 'notifications';

    protected $fillable = ['id','utilisateur_id','offre_id','message','est_lu'];
   

    public function proprietaire(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
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
        return $query->where('utilisateur_id', $utilisateurId);
    }
}
