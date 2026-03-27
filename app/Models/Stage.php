<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    protected $fillable = [

        'sujet',

        'etudiants_id',
        'entreprises_id',
        'tuteurs_id',

        'duree_semaines'
    ];

    protected $guarded = [
        'id'
    ];
}
