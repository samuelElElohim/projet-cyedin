<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Candidature extends Model
{
    use HasFactory;

    protected $fillable = [
        'offre_id',
        'etudiant_id',
        'est_accepte',
    ];

    protected $casts = [
        'est_accepte' => 'boolean',
    ];

    public function offre(): BelongsTo
    {
        return $this->belongsTo(Offre::class);
    }

    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(Etudiant::class);
    }

    public function accepter(): void
    {
        $this->update(['est_accepte' => true]);
    }

    public function refuser(): void
    {
        $this->update(['est_accepte' => false]);
    }
}