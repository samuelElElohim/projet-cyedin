<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Utilisateur extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $table = 'utilisateurs'; // C'est mieux de le déclarer explicitement.

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [ 
        'nom',
        'prenom',
        'email',
        'mot_de_passe',
        'role', // role doit avoir un seul char
        // imposer que si le role =/= d'entreprise, alors le nom et prenom doivent etre =/= null
        'est_active',
        'premier_mdp_changer'
    ];

    protected $guarded =
    [
        'id', // doit etre imposer numeriquement par le system lorsqu'un utilisateur est cree

        'date_creation' // la date de creation d'un compte ne doit pas etre modifiable
    ];


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'mot_de_passe',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'mot_de_passe' => 'hashed',
            'est_active' => 'boolean',
            'premier_mdp_changer' => 'boolean'
        ];
    }

    // par default, laravel utilise "password", donc j'ai indique le changement.
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }
    
    // Retourne le profil lié selon le rôle
    public function profil(): mixed
    {
        return match($this->role) {
            'A' => $this->administrateur,
            'S' => $this->etudiant,
            'T' => $this->tuteur,
            'E' => $this->entreprise,
            'J' => $this->jury,
            default => null,
        };
    }
}