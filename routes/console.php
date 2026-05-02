<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ─── Notifications périodiques aux admins ────────────────────────────────────
Schedule::command('admin:notifications-periodiques')->dailyAt('08:00');

// ─── Expiration automatique des candidatures (délai 7j dépassé) ──────────────
Schedule::command('candidatures:expirer')->hourly();