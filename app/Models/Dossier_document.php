<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dossier_document extends Model
{
    protected $fillable = ['dossier_id', 'document_id'];
    

     public function dossier()
    {
        return $this->belongsTo(Dossier_stage::class, 'dossier_id');
    }

    //scopes

    // Scope pour filtrer par type de document
    public function scopeType($query, string $type)
    {
        return $query->where('type', $type);
    }

    // Scope pour les documents deposees apres une date donnee
    public function scopeDeposeApres($query, $date)
    {
        return $query->where('date_depot', '>=', $date);
    }

}
