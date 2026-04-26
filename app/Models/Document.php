<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'id',
        'utilisateurs_id',

        'nom',
        'type',

        'chemin_fichier' // modifiable si on fais bouger le fichier ?
    ];

    protected $guarded = [

        'date_depot' // pour assurer qu'aucune date ne soit alterer, par exemple date depot du rapport du stage ...
    ];

    public function utilisateur()
    {
        return $this->belongsTo(\App\Models\Utilisateur::class, 'utilisateurs_id');
    }
 
    // Dossiers auxquels ce document appartient (many-to-many)
    public function dossiers()
    {
        return $this->belongsToMany(
            \App\Models\Dossier_stage::class,
            'dossier_documents',
            'document_id',
            'dossier_id'
        );
    }

}
