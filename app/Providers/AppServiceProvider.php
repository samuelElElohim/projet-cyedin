<?php

namespace App\Providers;

use App\Models\Candidature;
use App\Models\Document;
use App\Policies\CandidaturePolicy;
use App\Policies\DocumentPolicy;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // Morph map so polymorphic cible_type stores short strings (matching existing DB data)
        Relation::morphMap([
            'stage'         => \App\Models\Stage::class,
            'dossier_stage' => \App\Models\Dossier_stage::class,
        ]);

        Gate::policy(Candidature::class, CandidaturePolicy::class);
        Gate::policy(Document::class, DocumentPolicy::class);

        Vite::prefetch(concurrency: 3);

        // Force HTTPS en production pour que les liens de vérification
        // email soient corrects (Railway, Heroku, etc.)
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }
    }
}