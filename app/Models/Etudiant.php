<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Traits\HasUtilisateur;
class Etudiant extends Model
{
    use HasUtilisateur;
    protected $primaryKey = 'utilisateurs_id';
    public $incrementing = false;
    protected $fillable = [
        'utilisateurs_id',
        'filiere',
        'niveau_etud',
    ];



     public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateurs_id');
    }

     public function stages()
    {
        return $this->hasMany(Stage::class, 'etudiants_id', 'utilisateurs_id');
    }

    public function dossier()
    {
        return $this->hasOne(Dossier_stage::class, 'etudiants_id', 'utilisateurs_id');
    }

    public function centresInteret(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'etudiant_tag', 'etudiant_id', 'tag_id');
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
