<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    public $timestamps = false;

    protected $fillable = ['id', 'proprietaire_id', 'message', 'date_envoi', 'est_lu'];

    public function proprietaire()
    {
        return $this->belongsTo(Utilisateur::class, 'proprietaire_id');
    }

    // Scopes
    public function scopeNonLues($query)
    {
        return $query->where('est_lu', false);
    }

    public function scopeLues($query)
    {
        return $query->where('est_lu', true);
    }

    public function scopeParProprietaire($query, int $utilisateurId)
    {
        return $query->where('proprietaire_id', $utilisateurId);
    }
}