<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dossier_stage extends Model
{
    protected $fillale = [
        'id',
        'etudiants_id',
        'est_valide', // par default == false
        'date_soumission' // peut etre modifiable par le tuteur ou cas ou il refuse le dossier et demande une resubmition??
        //sinon on prevoit une suppression du dossier?
    ];
    //
}
