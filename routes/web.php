<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\EntrepriseDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OffreController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/offres/create', [OffreController::class, 'create'])->name('offres.create');
Route::post('/offres', [OffreController::class, 'store'])->name('offres.store');
Route::get('/offres', [OffreController::class, 'index'])->name('offres.index');

// Dashboard Admin
Route::middleware(['auth', 'role:A'])->group(function () {
    Route::get('admin/dashboard', function () {
        return Inertia::render('Admin/admin.main');
    })->name('admin.dashboard');

    // Users
    Route::get('admin/dashboard/user/show', [AdminDashboardController::class, 'index_user'])->name('admin.index.user');
    Route::post('admin/dashboard/user/add', [AdminDashboardController::class, 'store_user'])->name('admin.store.user');
    Route::get('admin/dashboard/user/add', [AdminDashboardController::class, 'create_user'])->name('admin.create.user');
    Route::post('admin/dashboard/user/{id}', [AdminDashboardController::class, 'edit_user'])->name('admin.edit.user');
    Route::post('admin/dashboard/user/toggle/{id}', [AdminDashboardController::class, 'toggle_user'])->name('admin.toggle.user');
    Route::get('admin/dashboard/user', function () {
        return Inertia::render('Admin/admin.main.user');
    })->name('admin.main.user');

    // Offres
    Route::get('admin/dashboard/offres/show', [AdminDashboardController::class, 'index_offre'])->name('admin.index.offre');
    Route::post('/admin/dashboard/offre/toggle/{id}', [AdminDashboardController::class, 'toggle_offre'])->name('admin.toggle.offre');

    // Entreprises
    Route::get('admin/dashboard/entreprise/show', [AdminDashboardController::class, 'index_entreprise'])->name('admin.index.entreprise');
    Route::post('admin/dashboard/entreprise/show', [AdminDashboardController::class, 'store_entreprise'])->name('admin.store.entreprise');
    Route::get('admin/dashboard/entreprise/add', [AdminDashboardController::class, 'create_entreprise'])->name('admin.create.entreprise');
    Route::get('admin/dashboard/entreprise', function () {
        return Inertia::render('Admin/admin.main.entreprise');
    })->name('admin.main.entreprise');
});

// Dashboard Entreprise
Route::middleware(['auth', 'role:E'])->group(function () {
    Route::get('/entreprise/dashboard', function () {
        return Inertia::render('Entreprise/entreprise.main');
    })->name('entreprise.dashboard');

    Route::get('entreprise/dashboard/offre', [EntrepriseDashboardController::class, 'index_offre'])->name('entreprise.index.offre');
    Route::post('entreprise/dashboard/offres/add', [EntrepriseDashboardController::class, 'store_offre'])->name('entreprise.store.offre');
});

// Autres dashboards
Route::get('/jury/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware('auth')->name('jury.dashboard');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';