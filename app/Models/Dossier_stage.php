<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dossier_stage extends Model
{
    protected $fillable = ['id','etudiants_id','est_valide','date_soumission' ];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'etudiants_id', 'utilisateurs_id');
    }

    public function documents()
    {
        /*
        on a plusieurs documents dans dossier_stage, et un meme document peut appartenir a plusieurs dossiers
        donc il faut la table pivot qui est dossier_documents, qui va contenir a la fois les ids dossier_stages avec les ids des documents dedans 
        relation many to many ...
        */

        return $this->belongsToMany(
            Document::class,
            'dossier_documents',   // table pivot
            'dossier_id',          // FK vers dossiers_stages
            'document_id'          // FK vers documents
        );
    }



    //scopes

    // Scope pour les dossiers valides
    public function scopeValide($query)
    {
        return $query->where('est_valide', true);
    }

    // Scope pour les dossiers en attente de validation
    public function scopeEnAttente($query)
    {
        return $query->where('est_valide', false);
    }

    // Scope pour les dossiers soumis apres une date donnee
    public function scopeSoumisApres($query, $date)
    {
        return $query->where('date_soumission', '>=', $date);
    }

}
