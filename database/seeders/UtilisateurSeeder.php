<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Utilisateur;
use App\Models\Administrateur;
use App\Models\Etudiant;
use App\Models\Entreprise;
use App\Models\Tuteur;
use App\Models\Jury;
use Illuminate\Support\Facades\Hash;

class UtilisateurSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | ADMIN
        |--------------------------------------------------------------------------
        */
        $adminUser = Utilisateur::updateOrCreate(
            ['email' => 'admin@test.fr'],
            [
                'nom' => 'Admin',
                'prenom' => 'Test',
                'mot_de_passe' => Hash::make('password'),
                'role' => 'A',
                'est_active' => true,
                'premier_mdp_changer' => true,
                'email_verified_at' => now(),
            ]
        );

        Administrateur::updateOrCreate(
            ['utilisateurs_id' => $adminUser->id],
            []
        );

        /*
        |--------------------------------------------------------------------------
        | ETUDIANT
        |--------------------------------------------------------------------------
        */
        $etuUser = Utilisateur::updateOrCreate(
            ['email' => 'etu@test.fr'],
            [
                'nom' => 'Etudiant',
                'prenom' => 'Test',
                'mot_de_passe' => Hash::make('password'),
                'role' => 'S',
                'est_active' => true,
                'premier_mdp_changer' => true,
                'email_verified_at' => now(),
            ]
        );

        Etudiant::updateOrCreate(
            ['utilisateurs_id' => $etuUser->id],
            [
                'filiere' => 'dev',
                'niveau_etud' => '1',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | ENTREPRISE
        |--------------------------------------------------------------------------
        */
        $entUser = Utilisateur::updateOrCreate(
            ['email' => 'entreprise@test.fr'],
            [
                'nom' => 'Entreprise',
                'prenom' => null,
                'mot_de_passe' => Hash::make('password'),
                'role' => 'E',
                'est_active' => true,
                'premier_mdp_changer' => true,
                'email_verified_at' => now(),
            ]
        );

        Entreprise::updateOrCreate(
            ['utilisateurs_id' => $entUser->id],
            [
                'nom_entreprise' => 'Entreprise Test',
                'addresse' => '42 rue test',
                'secteur' => 'info',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | TUTEUR
        |--------------------------------------------------------------------------
        */
        $tuteurUser = Utilisateur::updateOrCreate(
            ['email' => 'tuteur@test.fr'],
            [
                'nom' => 'Tuteur',
                'prenom' => 'Test',
                'mot_de_passe' => Hash::make('password'),
                'role' => 'T',
                'est_active' => true,
                'premier_mdp_changer' => true,
                'email_verified_at' => now(),
            ]
        );

        Tuteur::updateOrCreate(
            ['utilisateurs_id' => $tuteurUser->id],
            [
                'departement' => 'Informatique',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | JURY
        |--------------------------------------------------------------------------
        */
        $juryUser = Utilisateur::updateOrCreate(
            ['email' => 'jury@test.fr'],
            [
                'nom'                  => 'Jury',
                'prenom'               => 'Test',
                'mot_de_passe'         => Hash::make('password'),
                'role'                 => 'J',
                'est_active'           => true,
                'premier_mdp_changer'  => true,
                'email_verified_at' => now(),
            ]
        );

        Jury::updateOrCreate(
            ['utilisateur_id' => $juryUser->id],
            [
                'departement' => 'Informatique',
            ]
        );
    }
}