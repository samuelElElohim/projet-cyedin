<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{

    protected $fillable = [
        'id',
        'proprietaire_id',
        'message',
        'date_envoi',
        'est_lu'
    ];
    //
}
