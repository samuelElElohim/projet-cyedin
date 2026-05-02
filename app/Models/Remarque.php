<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Remarque extends Model
{
    protected $fillable = [
        'auteur_id',
        'cible_type',
        'cible_id',
        'contenu',
        'est_visible_etudiant',
        'est_visible_entreprise',
    ];

    protected function casts(): array
    {
        return [
            'est_visible_etudiant'   => 'boolean',
            'est_visible_entreprise' => 'boolean',
        ];
    }

    // ─── Relations ───────────────────────────────────────────────────────────

    public function auteur()
    {
        return $this->belongsTo(Utilisateur::class, 'auteur_id');
    }

    public function cible()
    {
        return $this->morphTo('cible');
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    /**
     * Récupère toutes les remarques sur une entité donnée.
     *
     * Utilisation : Remarque::pour('stage', $stageId)->with('auteur')->get()
     */
    public function scopePour($query, string $cibleType, int $cibleId)
    {
        return $query->where('cible_type', $cibleType)
                     ->where('cible_id', $cibleId);
    }

    public function scopeVisibleParEtudiant($query)
    {
        return $query->where('est_visible_etudiant', true);
    }

    public function scopeVisibleParEntreprise($query)
    {
        return $query->where('est_visible_entreprise', true);
    }

    // ─── Scopes par auteur ───────────────────────────────────────────────────

    public function scopeParAuteur($query, int $auteurId)
    {
        return $query->where('auteur_id', $auteurId);
    }
}
