<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OffreController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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


Route::get('admin/dashboard', function () {
    return Inertia::render('admin.main');
});

Route::get('admin/dashboard/user/show', [AdminDashboardController::class, 'index_user'])->name('admin.index.user');
Route::post('admin/dashboard/user/show', [AdminDashboardController::class,'store_user'])->name('admin.store.user');
Route::get('admin/dashboard/user/add', [AdminDashboardController::class,'create_user'])->name('admin.create.user');
Route::get('admin/dashboard/user', function () {
    return Inertia::render('admin.main.user');
})->name("admin.main.user");


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
