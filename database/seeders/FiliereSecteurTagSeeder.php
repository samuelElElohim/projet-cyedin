<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FiliereSecteurTagSeeder extends Seeder
{
    public function run(): void
    {
        // --- FILIERES ---
        $filieres = [
            ['filiere' => 'MATHS'],
            ['filiere' => 'INFO'],
        ];

        DB::table('filieres')->insert($filieres);

        // --- SECTEURS ---
        $secteurs = [
            ['secteur' => 'DevWeb',  'filiere_id' => 2], // INFO
            ['secteur' => 'IA',      'filiere_id' => 2], // INFO
            ['secteur' => 'Finance', 'filiere_id' => 1], // MATHS
            ['secteur' => 'Data',    'filiere_id' => 1], // MATHS
        ];

        DB::table('secteurs')->insert($secteurs);

        // --- TAGS ---
        $tags = [
            // DevWeb
            ['tag' => 'Frontend',  'secteur_id' => 1],
            ['tag' => 'Backend',   'secteur_id' => 1],

            // IA
            ['tag' => 'Deep Learning', 'secteur_id' => 2],
            ['tag' => 'ML',            'secteur_id' => 2],

            // Finance
            ['tag' => 'Trading',       'secteur_id' => 3],
            ['tag' => 'Risk Analysis', 'secteur_id' => 3],

            // Data
            ['tag' => 'SQL',           'secteur_id' => 4],
            ['tag' => 'DataViz',       'secteur_id' => 4],
        ];

        DB::table('tags')->insert($tags);
    }
}
