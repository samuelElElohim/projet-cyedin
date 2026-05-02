<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            FiliereSecteurTagSeeder::class, // hiérarchie d'abord (FKs)
            UtilisateurSeeder::class,
            OffreTestSeeder::class,
        ]);
    }
}
