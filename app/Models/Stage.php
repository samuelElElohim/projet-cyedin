<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Remarque;

class Stage extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'sujet',
        'etudiants_id',
        'entreprises_id',
        'tuteurs_id',
        'duree_en_semaine',
        'dateDebut',
        'etat',
    ];

    protected $guarded = ['id'];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'etudiants_id', 'utilisateurs_id');
    }

    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class, 'entreprises_id');
    }

    public function tuteur()
    {
        return $this->belongsTo(Tuteur::class, 'tuteurs_id', 'utilisateurs_id');
    }

    public function convention()
    {
        return $this->hasOne(Convention_stage::class, 'stages_id');
    }

    // Scopes
    public function scopeParTuteur($query, int $tuteurId)
    {
        return $query->where('tuteurs_id', $tuteurId);
    }

    public function scopeParEntreprise($query, int $entrepriseId)
    {
        return $query->where('entreprises_id', $entrepriseId);
    }

    public function scopeConventionComplete($query)
    {
        return $query->whereHas('convention', fn($q) => $q
            ->where('signer_par_entreprise', true)
            ->where('signer_par_tuteur', true)
            ->where('signer_par_etudiant', true)
        );
    }

    public function remarques()
    {
        return $this->morphMany(Remarque::class, 'cible');
    }
}