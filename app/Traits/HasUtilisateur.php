<?php
// app/Traits/HasUtilisateur.php

namespace App\Traits;

use App\Models\Utilisateur;

trait HasUtilisateur {
    public function utilisateur() {
        return $this->belongsTo(Utilisateur::class, 'utilisateurs_id');
    }
}