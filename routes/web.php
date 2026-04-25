<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\EntrepriseDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OffreController;
use App\Http\Controllers\Auth\InscriptionEntrepriseController;
use App\Http\Controllers\Auth\PremierMotDePasseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Page d'accueil ──────────────────────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('Home');
});

// ─── Inscription entreprise (publique) ───────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/register/entreprise', [InscriptionEntrepriseController::class, 'create'])
        ->name('register.entreprise');
    Route::post('/register/entreprise', [InscriptionEntrepriseController::class, 'store']);
});

// ─── Premier changement de mot de passe ──────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/password/premier', [PremierMotDePasseController::class, 'create'])
        ->name('password.premier');
    Route::post('/password/premier', [PremierMotDePasseController::class, 'store'])
        ->name('password.premier.store');
});

// ─── Offres publiques ────────────────────────────────────────────────────────
Route::get('/offres', [OffreController::class, 'index'])->name('offres.index');
Route::middleware('auth')->group(function () {
    Route::get('/offres/create', [OffreController::class, 'create'])->name('offres.create');
    Route::post('/offres', [OffreController::class, 'store'])->name('offres.store');
});

// ─── Dashboard Admin ─────────────────────────────────────────────────────────
Route::middleware(['auth', 'role:A'])->group(function () {

    Route::get('admin/dashboard', [AdminDashboardController::class, 'dashboard'])
        ->name('admin.dashboard');

    // Users
    Route::get('admin/dashboard/user/show',         [AdminDashboardController::class, 'index_user'])->name('admin.index.user');
    Route::post('admin/dashboard/user/add',          [AdminDashboardController::class, 'store_user'])->name('admin.store.user');
    Route::get('admin/dashboard/user/add',           [AdminDashboardController::class, 'create_user'])->name('admin.create.user');
    Route::post('admin/dashboard/user/{id}',         [AdminDashboardController::class, 'edit_user'])->name('admin.edit.user');
    Route::post('admin/dashboard/user/toggle/{id}',  [AdminDashboardController::class, 'toggle_user'])->name('admin.toggle.user');
    Route::get('admin/dashboard/user', function () {
        return Inertia::render('Admin/admin.main.user');
    })->name('admin.main.user');

    // Offres
    Route::get('admin/dashboard/offres/show',               [AdminDashboardController::class, 'index_offre'])->name('admin.index.offre');
    Route::post('/admin/dashboard/offre/toggle/{id}',       [AdminDashboardController::class, 'toggle_offre'])->name('admin.toggle.offre');

    // Entreprises
    Route::get('admin/dashboard/entreprise/show',   [AdminDashboardController::class, 'index_entreprise'])->name('admin.index.entreprise');
    Route::post('admin/dashboard/entreprise/show',  [AdminDashboardController::class, 'store_entreprise'])->name('admin.store.entreprise');
    Route::get('admin/dashboard/entreprise/add',    [AdminDashboardController::class, 'create_entreprise'])->name('admin.create.entreprise');
    Route::post('admin/dashboard/entreprise/validate/{id}', [AdminDashboardController::class, 'validate_entreprise'])->name('admin.validate.entreprise');
    Route::get('admin/dashboard/entreprise', function () {
        return Inertia::render('Admin/admin.main.entreprise');
    })->name('admin.main.entreprise');

    // Dossiers de stage
    Route::get('admin/dashboard/dossiers',           [AdminDashboardController::class, 'index_dossier'])->name('admin.index.dossier');
    Route::post('admin/dashboard/dossiers/toggle/{id}', [AdminDashboardController::class, 'toggle_dossier'])->name('admin.toggle.dossier');

    // Suivi des stages
    Route::get('admin/dashboard/stages',             [AdminDashboardController::class, 'index_stage'])->name('admin.index.stage');

    // Formations
    Route::get('admin/dashboard/formations',             [AdminDashboardController::class, 'index_formation'])->name('admin.index.formation');
    Route::post('admin/dashboard/formations/valider/{id}', [AdminDashboardController::class, 'valider_formation'])->name('admin.valider.formation');
    Route::post('admin/dashboard/formations/refuser/{id}', [AdminDashboardController::class, 'refuser_formation'])->name('admin.refuser.formation');

    // Trace
    Route::get('admin/dashboard/trace',              [AdminDashboardController::class, 'trace'])->name('admin.trace');
    Route::get('admin/dashboard/trace/export',       [AdminDashboardController::class, 'export_trace'])->name('admin.trace.export');

    // Archivage annuel
    Route::post('admin/dashboard/archiver',          [AdminDashboardController::class, 'archiver_annee'])->name('admin.archiver.annee');
});

// ─── Dashboard Entreprise ─────────────────────────────────────────────────────
Route::middleware(['auth', 'role:E'])->group(function () {
    Route::get('/entreprise/dashboard', function () {
        return Inertia::render('Entreprise/entreprise.main');
    })->name('entreprise.dashboard');

    Route::get('entreprise/dashboard/offre',         [EntrepriseDashboardController::class, 'index_offre'])->name('entreprise.index.offre');
    Route::post('entreprise/dashboard/offres/add',   [EntrepriseDashboardController::class, 'store_offre'])->name('entreprise.store.offre');
});

// ─── Autres dashboards ────────────────────────────────────────────────────────
Route::get('/tuteur/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'role:T'])->name('tuteur.dashboard');

Route::get('/jury/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'role:J'])->name('jury.dashboard');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// ─── Profil ──────────────────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
