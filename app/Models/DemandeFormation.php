<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemandeFormation extends Model
{
    protected $table = 'demandes_formations';

    protected $fillable = [
        'etudiant_id',
        'formation_demandee',
        'justification',
        'statut',
        'admin_id',
        'commentaire_admin',
    ];

    public function etudiant()
    {
        return $this->belongsTo(Utilisateur::class, 'etudiant_id');
    }

    public function admin()
    {
        return $this->belongsTo(Utilisateur::class, 'admin_id');
    }

    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'en_attente');
    }
}
