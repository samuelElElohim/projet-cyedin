<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUtilisateur;

// app/Models/Candidature.php
class Candidature extends Model
{
    protected $fillable = ['offre_id', 'etudiant_id', 'statut', 'message'];

    public function documents() {
        return $this->belongsToMany(Document::class, 'candidature_documents');
    }
    public function etudiant() {
        return $this->belongsTo(Utilisateur::class, 'etudiant_id');
    }
}

