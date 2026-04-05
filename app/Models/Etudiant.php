<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    protected $fillable = [
        'utilisateurs_id',
        'filiere',
        'niveau_etud'
    ];

}
