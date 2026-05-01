<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUtilisateur;
class Entreprise extends Model
{ 
    use HasUtilisateur;
    //protected $primaryKey = 'utilisateurs_id'; // ← indique la vraie PK
    protected $fillable = [
        'utilisateurs_id',
        'nom_entreprise',
        'addresse',
        //'secteur'
    ];




    public function utilisateur() {
        return $this->belongsTo(Utilisateur::class, 'utilisateurs_id');
    }

    public function offres()
    {
        return $this->hasMany(Offre::class, 'entreprise_id');
    }

     public function stages()
    {
        return $this->hasMany(Stage::class, 'entreprises_id');
    }


    //scopes
    // Scope pour filtrer les entreprises par secteur
    public function scopeSecteur($query, string $secteur)
    {
        return $query->where('secteur', $secteur);
    }

    // Scope pour filtrer les entreprises qui ont des offres
    public function scopeAvecOffres($query)
    {
        return $query->whereHas('offres');
    }

    // Scope pour filtrer les entreprises qui ont des stages en cours
    public function scopeAvecStages($query)
    {
        return $query->whereHas('stages');
    }






}
