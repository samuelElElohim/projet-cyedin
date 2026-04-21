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
        'secteur'
    ];
    public function utilisateur() {
        return $this->belongsTo(Utilisateur::class, 'utilisateurs_id');
    }

    public function offres()
    {
        return $this->hasMany(Offre::class, 'entreprise_id', 'id');
    }
}
