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
    protected $authPasswordName = 'mot_de_passe';
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
            //'mot_de_passe' => 'hashed',
            'est_active' => 'boolean',
            'premier_mdp_changer' => 'boolean'
        ];
    }

    // par default, laravel utilise "password", donc j'ai indique le changement.
    public function getAuthPassword() :string
    {
        return $this->mot_de_passe;
    }
    
    
    // Pour dire à laravel que le psw c mot_de_passe.
    public function getAuthPasswordName(): string
    {
        return 'mot_de_passe';
    }

        public function entreprise()
    {
        return $this->hasOne(Entreprise::class, 'utilisateurs_id');
    }

    public function etudiant()
    {
        return $this->hasOne(Etudiant::class, 'utilisateurs_id');
    }


    public function administrateur()
    {
        return $this->hasOne(Administrateur::class, 'utilisateurs_id');
    }

    // ajouter les autres profils (tuteur, jury) 
    public function tuteur()
    {
        return $this->hasOne(Tuteur::class, 'utilisateurs_id');
    }
   
    public function jury()
    {
        return $this->hasOne(Jury::class, 'utilisateurs_id');
    }

    // ajouter les items qui appartiennent a un utilisateur (notficiations, documents)
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'utilisateurs_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'utilisateurs_id');
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




    // scopes

    // scope pour filtrer les utilisateurs actifs
    public function scopeActif($query)
    {
        return $query->where('est_active', true);
    }

    // scope pour filtrer les utilisateurs qui n'ont pas encore changé leur mot de passe
    public function scopePremierConnexion($query)
    {
        return $query->where('premier_mdp_changer', false);
    }

    // scope pour filtrer les utilisateurs par role
    // jsp si c'est utile vu le deploie deja effectue dans le mvp
    public function scopeRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    public function candidatures()
    {
        return $this->hasMany(\App\Models\Candidature::class, 'etudiant_id');
    }
 
    public function remarques()
    {
        return $this->hasMany(\App\Models\Remarque::class, 'auteur_id');
    }

}