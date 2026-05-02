<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'id',
        'utilisateurs_id',
        'nom',
        'type',
        'categorie',
        'chemin_fichier',
    ];

    protected $guarded = ['date_depot'];

    public function utilisateur()
    {
        return $this->belongsTo(\App\Models\Utilisateur::class, 'utilisateurs_id');
    }

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