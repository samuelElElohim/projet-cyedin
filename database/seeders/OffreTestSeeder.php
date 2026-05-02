<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OffreTestSeeder extends Seeder
{
    public function run(): void
    {
        // 1) Création de l'offre
        $offreId = DB::table('offres')->insertGetId([
            'entreprise_id' => 1, // Assure-toi qu'une entreprise existe avec cet ID
            'titre' => 'Stage Développeur Web',
            'description' => 'Un stage pour travailler sur un projet web moderne.',
            'duree_semaines' => 12,
            'est_active' => true,
            'filiere_id' => 2, // INFO
            'secteur_id' => 1, // DevWeb
            'dateDebut' => now()->addWeeks(2),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2) Ajout des tags (Frontend + Backend)
        DB::table('offres_tags')->insert([
            [
                'offre_id' => $offreId,
                'tag_id' => 1, // Frontend
            ],
            [
                'offre_id' => $offreId,
                'tag_id' => 2, // Backend
            ],
        ]);
    }
}
