<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Filiere extends Model
{
    use HasFactory;

    protected $table = 'filieres';

    protected $fillable = [
        'filiere',
    ];

    /**
     * Une filière possède plusieurs secteurs.
     */
    public function secteurs()
    {
        return $this->hasMany(Secteur::class);
    }

    /**
     * Une filière peut être liée à plusieurs entreprises (table pivot).
     */
    public function entreprises()
    {
        return $this->belongsToMany(Entreprise::class, 'entreprises_filieres');
    }

    /**
     * Une filière peut être liée à plusieurs offres.
     */
    public function offres()
    {
        return $this->hasMany(Offre::class);
    }
}
