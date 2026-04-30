<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Force HTTPS en production pour que les liens de vérification
        // email soient corrects (Railway, Heroku, etc.)
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }
    }
}