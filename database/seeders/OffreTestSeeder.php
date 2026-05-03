<?php

namespace Database\Seeders;

use App\Models\Entreprise;
use App\Models\Offre;
use App\Models\Secteur;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class OffreTestSeeder extends Seeder
{
    public function run(): void
    {
        $entreprise = Entreprise::whereHas('utilisateur', fn($q) => $q->where('email', 'entreprise@test.fr'))->firstOrFail();

        $devweb = Secteur::where('secteur', 'DevWeb')->firstOrFail();
        $ia     = Secteur::where('secteur', 'IA')->firstOrFail();

        $tagFrontend     = Tag::where('tag', 'Frontend')->first();
        $tagBackend      = Tag::where('tag', 'Backend')->first();
        $tagDeepLearning = Tag::where('tag', 'Deep Learning')->first();
        $tagML           = Tag::where('tag', 'ML')->first();

        // ─── Offre 1 : Développeur Web ───────────────────────────────────────
        $offre1 = Offre::updateOrCreate(
            ['entreprise_id' => $entreprise->id, 'titre' => 'Stage Développeur Web'],
            [
                'description'    => 'Travailler sur un projet web moderne avec React et Laravel.',
                'duree_semaines' => 12,
                'est_active'     => true,
                'filiere_id'     => $devweb->filiere_id,
                'secteur_id'     => $devweb->id,
                'dateDebut'      => now()->addWeeks(2)->toDateString(),
            ]
        );
        $offre1->tags()->syncWithoutDetaching(
            array_filter([$tagFrontend?->id, $tagBackend?->id])
        );

        // ─── Offre 2 : Data Scientist / IA ───────────────────────────────────
        $offre2 = Offre::updateOrCreate(
            ['entreprise_id' => $entreprise->id, 'titre' => 'Stage Data Scientist'],
            [
                'description'    => 'Conception et entraînement de modèles de machine learning sur données réelles.',
                'duree_semaines' => 16,
                'est_active'     => true,
                'filiere_id'     => $ia->filiere_id,
                'secteur_id'     => $ia->id,
                'dateDebut'      => now()->addWeeks(4)->toDateString(),
            ]
        );
        $offre2->tags()->syncWithoutDetaching(
            array_filter([$tagDeepLearning?->id, $tagML?->id])
        );
    }
}
