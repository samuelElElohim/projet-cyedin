<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = ['nom'];

    public function offres(): BelongsToMany
    {
        return $this->belongsToMany(Offre::class, 'offre_tag');
    }

    public function etudiants(): BelongsToMany
    {
        return $this->belongsToMany(Etudiant::class, 'etudiant_tag', 'tag_id', 'etudiant_id');
    }
}
