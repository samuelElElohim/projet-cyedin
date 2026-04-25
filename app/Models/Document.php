<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    public $timestamps = false;
    protected $table = 'documents';
    protected $fillable = [
        'utilisateurs_id',
        'nom',
        'type',
        'chemin_fichier',
        'date_depot'
    ];


    
    public function candidatures() {
        return $this->belongsToMany(Candidature::class, 'candidature_documents');
    }
}
