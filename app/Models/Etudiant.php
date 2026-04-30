<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Traits\HasUtilisateur;
class Etudiant extends Model
{
    use HasUtilisateur;
    public $incrementing = false;
    protected $fillable = [
        'utilisateur_id',
        'filiere',
        'niveau_etud',
    ];



     public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

     public function stages()
    {
        return $this->hasMany(Stage::class, 'etudiant_id');
    }

    public function dossier()
    {
        return $this->hasOne(Dossier_stage::class, 'etudiant_id');
    }

    public function centresInteret(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'etudiant_tag', 'etudiant_id', 'tag_id');
    }

    public function tuteur()
    {
        return $this->belongsToMany(
            Tuteur::class,
            'tuteur_etudiant',
            'etudiant_id',
            'tuteur_id',
            'utilisateurs_id',
            'utilisateurs_id'
        )->withTimestamps();
    }

    // Utilitaire pour vérifier si l'étudiant a un tuteur assigné
    public function hasTuteur(): bool
    {
        return $this->tuteur()->exists();
    }


    //scopes

    // Scope pour filtrer les etudiants par filiere
     public function scopeFiliere($query, string $filiere)
    {
        return $query->where('filiere', $filiere);
    }
    
    // Scope pour filtrer les etudiants par niveau
     public function scopeNiveau($query, string $niveau)
    {
        return $query->where('niveau_etud', $niveau);
    }

    // Scope pour filtrer les etudiants qui ont un stage
    public function scopeAvecStage($query)
    {
        return $query->whereHas('stages');
    }

    // Scope pour filtrer les etudiants qui n'ont pas de stage
    public function scopeSansStage($query)
    {
        return $query->whereDoesntHave('stages');
    }
}
