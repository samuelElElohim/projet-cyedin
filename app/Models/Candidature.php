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
    'nom_cv_original',
    'chemin_lettre',
    'nom_lettre_original',
    'commentaire_entreprise',
    'deadline_choix',
];

    protected $casts = [
        'deadline_choix' => 'datetime',
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

    // ─── Helpers ─────────────────────────────────────────────────────────────

    public function isExpired(): bool
    {
        return $this->deadline_choix && now()->isAfter($this->deadline_choix);
    }

    public function joursRestants(): int
    {
        if (!$this->deadline_choix) return 0;
        return max(0, (int) now()->diffInDays($this->deadline_choix, false));
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