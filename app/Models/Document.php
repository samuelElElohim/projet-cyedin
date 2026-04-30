<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'id',
        'utilisateur_id',

        'nom',
        'type',
        'chemin_fichier',
    ];

    protected $guarded = [
        'date_depot' // pour assurer qu'aucune date ne soit alterer, par exemple date depot du rapport du stage ...
    ];

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