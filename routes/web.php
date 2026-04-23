<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\EntrepriseDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OffreController;
use GuzzleHttp\Middleware;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

/*
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});*/


Route::get('/', function () {
    return Inertia::render('Home');
});


Route::get('/oeoeoe', function () {
    return Inertia::render('Oeoe');
})->middleware('checkAge');

Route::get('/offres/create',[OffreController::class, 'create'])->name('offres.create');
Route::post('/offres',[OffreController::class, 'store'])->name('offres.store');
Route::get('/offres', [OffreController::class,'index'])->name('offres.index');



// Dashboard Admin

Route::middleware(['auth', 'role:A'])->group(function () {
    Route::get('admin/dashboard', function () {
    return Inertia::render('admin.main');
})->name('admin.dashboard');

// Dashboard Admin - Users
Route::get('admin/dashboard/user/show', [AdminDashboardController::class, 'index_user'])->name('admin.index.user');
Route::post('admin/dashboard/user/add', [AdminDashboardController::class,'store_user'])->name('admin.store.user');
Route::get('admin/dashboard/user/add', [AdminDashboardController::class,'create_user'])->name('admin.create.user');
Route::post('admin/dashboard/user/{id}', [AdminDashboardController::class, 'edit_user'])->name('admin.edit.user');
Route::post('admin/dashboard/user/toggle/{id}', [AdminDashboardController::class, 'toggle_user'])
    ->name('admin.toggle.user');
Route::get('admin/dashboard/user', function () {
    return Inertia::render('admin.main.user');
})->name("admin.main.user");

// Dashboard Admin - Offres
Route::get('admin/dashboard/offres/show', [AdminDashboardController::class, 'index_offre'])->name('admin.index.offre');
Route::post('/admin/dashboard/offre/toggle/{id}', [AdminDashboardController::class, 'toggle_offre'])
    ->name('admin.toggle.offre');

});





Route::middleware(['auth', 'role:E'])->group(function() {
    Route::get('/entreprise/dashboard', function () {
    return Inertia::render('entreprise.main');
    })->name('entreprise.dashboard');

    Route::get('entreprise/dashboard/offre', [EntrepriseDashboardController::class, 'index_offre'])->name('entreprise.index.offre');
    Route::post('enteprise.dashboard/offres/add', [EntrepriseDashboardController::class, 'store_offre'])
        ->name('entreprise.store.offre');
});

//DASHBOARDS PLACEHOLDER
/*
Route::get('/tuteur/dashboard', function () {
    return Inertia::render('Dashboard'); // page placeholder pour l'instant
})->middleware('auth')->name('tuteur.dashboard');
*/
Route::get('/jury/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware('auth')->name('jury.dashboard');

//Enterprises (OBSOLETE)
Route::get('admin/dashboard/entreprise/show', [AdminDashboardController::class, "index_entreprise"])->name('admin.index.entreprise');
Route::post('admin/dashboard/entreprise/show', [AdminDashboardController::class,'store_entreprise'])->name('admin.store.entreprise'); 
Route::get('admin/dashboard/entreprise/add', [AdminDashboardController::class,'create_entreprise'])->name('admin.create.entreprise');
Route::get('admin/dashboard/entreprise/', function () {
    return Inertia::render('admin.main.entreprise');
})->name("admin.main.entreprise");



Route::middleware(['auth', 'role:S'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
