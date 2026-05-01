<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tag extends Model
{
    use HasFactory;

    protected $table = 'tags';

    protected $fillable = [
        'tag',
        'secteur_id',
    ];

    /**
     * Un tag appartient à un secteur.
     */
    public function secteur()
    {
        return $this->belongsTo(Secteur::class);
    }

    /**
     * Un tag peut être lié à plusieurs offres (pivot offres_tags).
     */
    public function offres()
    {
        return $this->belongsToMany(Offre::class, 'offres_tags');
    }
}
