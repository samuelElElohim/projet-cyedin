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

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    public function tags()
    {
        return $this->hasMany(Tag::class);
    }

    public function offres()
    {
        return $this->hasMany(Offre::class);
    }

    public function tuteurs()
    {
        return $this->belongsToMany(
            Tuteur::class,
            'tuteur_secteurs',
            'secteur_id',
            'tuteur_id',
            'id',
            'utilisateur_id'
        )->withTimestamps();
    }

    public function entreprises()
    {
        return $this->belongsToMany(Entreprise::class, 'entreprise_secteurs');
    }
}
