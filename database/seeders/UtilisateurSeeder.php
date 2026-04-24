<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Utilisateur;
use App\Models\Administrateur;
use App\Models\Etudiant;
use App\Models\Entreprise;
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
            ]
        );

        Administrateur::updateOrCreate(
            ['utilisateur_id' => $adminUser->id],
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
            ]
        );

        Etudiant::updateOrCreate(
            ['utilisateur_id' => $etuUser->id],
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
            ]
        );

        Entreprise::updateOrCreate(
            ['utilisateur_id' => $entUser->id],
            [
                'nom_entreprise' => 'Entreprise Test',
                'addresse' => '42 rue test',
                'secteur' => 'info',
            ]
        );
    }
}