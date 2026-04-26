<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidature extends Model
{
    protected $fillable = [
        'etudiant_id',
        'offre_id',
        'statut',
        'lettre_motivation',
        'chemin_cv',
        'commentaire_entreprise',
    ];

    // ─── Relations ───────────────────────────────────────────────────────────

    public function etudiant()
    {
        return $this->belongsTo(Utilisateur::class, 'etudiant_id');
    }

    public function offre()
    {
        return $this->belongsTo(Offre::class, 'offre_id');
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'en_attente');
    }

    public function scopeAcceptee($query)
    {
        return $query->where('statut', 'acceptee');
    }

    public function scopeRefusee($query)
    {
        return $query->where('statut', 'refusee');
    }

    public function scopeParEtudiant($query, int $etudiantId)
    {
        return $query->where('etudiant_id', $etudiantId);
    }

    public function scopeParOffre($query, int $offreId)
    {
        return $query->where('offre_id', $offreId);
    }
}
