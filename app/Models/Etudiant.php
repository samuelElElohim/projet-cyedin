<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUtilisateur;
class Etudiant extends Model
{
    use HasUtilisateur;
    protected $fillable = [
        'utilisateurs_id',
        'filiere',
        'niveau_etud'
    ];


    protected $guarded = [
        'id'  // doit etre systematiquement identique au foreignId 'utilisateurs_id' et emmuable
    ];
}
