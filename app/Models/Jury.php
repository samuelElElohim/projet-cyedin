<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUtilisateur;
class Jury extends Model
{   
    use HasUtilisateur;
    protected $fillable = [
        'utilisateur_id',
        'departement'
    ];

}
