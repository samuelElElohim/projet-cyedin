<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ─── Notifications périodiques aux admins ─────────────────────────────────────
// Envoie chaque jour un résumé des requêtes en attente (offres, entreprises, formations).
Schedule::command('admin:notifications-periodiques')->dailyAt('08:00');
