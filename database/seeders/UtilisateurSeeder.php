<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Utilisateur;
use App\Models\Administrateur;
use App\Models\Etudiant;
use App\Models\Entreprise;
use App\Models\Tuteur;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

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

        // ─── Étudiant INFO / DevWeb ───────────────────────────────────────────
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
        Etudiant::updateOrCreate(
            ['utilisateur_id' => $etuUser->id],
            ['filiere_id' => 2, 'niveau_etud' => 1] // INFO
        );

        // ─── Entreprise — secteurs DevWeb + IA ───────────────────────────────
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

        // Secteurs DevWeb(1) + IA(2) → filières déduites INFO(2)
        $entr->secteurs()->syncWithoutDetaching([1, 2]);
        $entr->filieres()->syncWithoutDetaching([2]);

        // ─── Tuteur — supervise DevWeb + IA ──────────────────────────────────
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
            ['filiere_id' => 2] // filière principale INFO
        );
        $tuteur->secteurs()->syncWithoutDetaching([1, 2]); // DevWeb + IA
    }
}
