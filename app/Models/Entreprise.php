<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entreprise extends Model
{ 
    protected $primaryKey = 'utilisateurs_id'; // ← indique la vraie PK
    protected $fillable = [
        'utilisateurs_id',
        'nom_entreprise',
        'addresse',
        'secteur'
    ];
    public function utilisateur() {
        return $this->belongsTo(Utilisateur::class, 'utilisateurs_id');
    }

}
