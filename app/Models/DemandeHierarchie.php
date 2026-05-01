<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemandeHierarchie extends Model
{
    protected $table = 'demande_hierarchies';

    protected $fillable = [
        'auteur_id', 'type', 'nom',
        'filiere_id', 'secteur_id',
        'justification', 'statut',
        'admin_id', 'commentaire_admin',
    ];

    public function auteur()
    {
        return $this->belongsTo(Utilisateur::class, 'auteur_id');
    }

    public function admin()
    {
        return $this->belongsTo(Utilisateur::class, 'admin_id');
    }

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    public function secteur()
    {
        return $this->belongsTo(Secteur::class);
    }

    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'en_attente');
    }
}
