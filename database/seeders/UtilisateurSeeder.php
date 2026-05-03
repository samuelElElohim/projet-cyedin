<?php

namespace Database\Seeders;

use App\Models\Administrateur;
use App\Models\Entreprise;
use App\Models\Etudiant;
use App\Models\Tuteur;
use App\Models\Utilisateur;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UtilisateurSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Admin ───────────────────────────────────────────────────────────
        $adminUser = Utilisateur::updateOrCreate(
            ['email' => 'admin@test.fr'],
            [
                'nom'                 => 'Admin',
                'prenom'              => 'Test',
                'mot_de_passe'        => Hash::make('password'),
                'role'                => 'A',
                'est_active'          => true,
                'premier_mdp_changer' => true,
                'email_verified_at'   => now(),
            ]
        );
        Administrateur::updateOrCreate(['utilisateurs_id' => $adminUser->id]);

        // ─── Étudiant ────────────────────────────────────────────────────────
        $etuUser = Utilisateur::updateOrCreate(
            ['email' => 'etu@test.fr'],
            [
                'nom'                 => 'Etudiant',
                'prenom'              => 'Test',
                'mot_de_passe'        => Hash::make('password'),
                'role'                => 'S',
                'est_active'          => true,
                'premier_mdp_changer' => true,
                'email_verified_at'   => now(),
            ]
        );
        $etudiant = Etudiant::updateOrCreate(
            ['utilisateur_id' => $etuUser->id],
            ['filiere_id' => 2, 'niveau_etud' => 1] // INFO
        );

        // ─── Entreprise ──────────────────────────────────────────────────────
        $entUser = Utilisateur::updateOrCreate(
            ['email' => 'entreprise@test.fr'],
            [
                'nom'                 => 'Entreprise Test',
                'prenom'              => null,
                'mot_de_passe'        => Hash::make('password'),
                'role'                => 'E',
                'est_active'          => true,
                'premier_mdp_changer' => true,
                'email_verified_at'   => now(),
            ]
        );
        $entr = Entreprise::updateOrCreate(
            ['utilisateur_id' => $entUser->id],
            ['nom_entreprise' => 'Entreprise Test', 'addresse' => '42 rue test']
        );
        $entr->secteurs()->syncWithoutDetaching([1, 2]); // DevWeb + IA
        $entr->filieres()->syncWithoutDetaching([2]);     // INFO

        // ─── Tuteur ──────────────────────────────────────────────────────────
        $tuteurUser = Utilisateur::updateOrCreate(
            ['email' => 'tuteur@test.fr'],
            [
                'nom'                 => 'Tuteur',
                'prenom'              => 'Test',
                'mot_de_passe'        => Hash::make('password'),
                'role'                => 'T',
                'est_active'          => true,
                'premier_mdp_changer' => true,
                'email_verified_at'   => now(),
            ]
        );
        $tuteur = Tuteur::updateOrCreate(
            ['utilisateur_id' => $tuteurUser->id],
            ['filiere_id' => 2] // INFO
        );
        $tuteur->secteurs()->syncWithoutDetaching([1, 2]); // DevWeb + IA

        // ─── Lien tuteur → étudiant ───────────────────────────────────────────
        $etudiant->tuteur()->syncWithoutDetaching([$tuteurUser->id]);
    }
}
