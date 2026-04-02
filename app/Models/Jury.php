<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jury extends Model
{   
        protected $fillable = [
            'utilisateur_id',
            'departement'
        ];
    //
}
