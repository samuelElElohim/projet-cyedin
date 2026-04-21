<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Convention_stage extends Model  // probleme de extends, Model au lieu de Stage
{
    
    protected $fillable = [
        'stages_id',
        'date_creation',
        'signer_par_entreprise',
        'signer_par_tuteur',
        'signer_par_etudiant'
    ];

    
}
