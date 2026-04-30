<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CahierStage extends Model
{
    protected $table = 'cahier_stages';

    protected $fillable = [
        'etudiant_id',
        'date_entree',
        'titre',
        'contenu',
        'visible_tuteur',
        'visible_jury',
    ];

    protected function casts(): array
    {
        return [
            'date_entree'    => 'date',
            'visible_tuteur' => 'boolean',
            'visible_jury'   => 'boolean',
        ];
    }

    public function etudiant()
    {
        return $this->belongsTo(Utilisateur::class, 'etudiant_id');
    }

    // Scopes

    public function scopeParEtudiant($query, int $etudiantId)
    {
        return $query->where('etudiant_id', $etudiantId);
    }

    public function scopeVisibleTuteur($query)
    {
        return $query->where('visible_tuteur', true);
    }

    public function scopeVisibleJury($query)
    {
        return $query->where('visible_jury', true);
    }
}
