<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
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
}
