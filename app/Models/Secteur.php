<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Secteur extends Model
{
    use HasFactory;

    protected $table = 'secteurs';

    protected $fillable = [
        'secteur',
        'filiere_id',
    ];

    /**
     * Un secteur appartient à une filière.
     */
    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    /**
     * Un secteur possède plusieurs tags.
     */
    public function tags()
    {
        return $this->hasMany(Tag::class);
    }

    /**
     * Un secteur peut être lié à plusieurs offres.
     */
    public function offres()
    {
        return $this->hasMany(Offre::class);
    }
}
