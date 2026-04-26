<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\EntrepriseDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OffreController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\RemarqueController;
use App\Http\Controllers\CandidatureController;
use App\Http\Controllers\EtudiantDashboardController;
use App\Http\Controllers\Auth\InscriptionEntrepriseController;
use App\Http\Controllers\Auth\PremierMotDePasseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Routes Publiques
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Home');
});

// Inscription entreprise (publique)
Route::middleware('guest')->group(function () {
    Route::get('/register/entreprise', [InscriptionEntrepriseController::class, 'create'])->name('register.entreprise');
    Route::post('/register/entreprise', [InscriptionEntrepriseController::class, 'store']);
});

// Offres d'emploi consultables par tous
Route::get('/offres', [OffreController::class, 'index'])->name('offres.index');

/*
|--------------------------------------------------------------------------
| Routes Authentifiées (Tous rôles)
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    
    // Premier changement de mot de passe obligatoire
    Route::get('/password/premier', [PremierMotDePasseController::class, 'create'])->name('password.premier');
    Route::post('/password/premier', [PremierMotDePasseController::class, 'store'])->name('password.premier.store');

    // Profil utilisateur
    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Gestion des documents (Upload / Download / Delete)
    Route::get('/documents',                       [DocumentController::class, 'index'])->name('documents.index');
    Route::post('/documents',                      [DocumentController::class, 'store'])->name('documents.store');
    Route::get('/documents/{document}/download',   [DocumentController::class, 'download'])->name('documents.download');
    Route::delete('/documents/{document}',         [DocumentController::class, 'destroy'])->name('documents.destroy');

    // Remarques générales
    Route::post('/remarques',              [RemarqueController::class, 'store'])->name('remarques.store');
    Route::delete('/remarques/{remarque}', [RemarqueController::class, 'destroy'])->name('remarques.destroy');

    // Dashboard générique de redirection (si nécessaire)
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware(['verified'])->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| Espace ADMIN (role:A)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:A'])->prefix('admin')->name('admin.')->group(function () {
    
    Route::get('/dashboard', [AdminDashboardController::class, 'dashboard'])->name('dashboard');

    // Gestion Utilisateurs
    Route::get('/dashboard/user/show',          [AdminDashboardController::class, 'index_user'])->name('index.user');
    Route::get('/dashboard/user/add',           [AdminDashboardController::class, 'create_user'])->name('create.user');
    Route::post('/dashboard/user/add',          [AdminDashboardController::class, 'store_user'])->name('store.user');
    Route::post('/dashboard/user/{id}',         [AdminDashboardController::class, 'edit_user'])->name('edit.user');
    Route::post('/dashboard/user/toggle/{id}',  [AdminDashboardController::class, 'toggle_user'])->name('toggle.user');
    Route::get('/dashboard/user', function () {
        return Inertia::render('Admin/admin.main.user');
    })->name('main.user');

    // Gestion Offres
    Route::get('/dashboard/offres/show',        [AdminDashboardController::class, 'index_offre'])->name('index.offre');
    Route::post('/dashboard/offre/toggle/{id}', [AdminDashboardController::class, 'toggle_offre'])->name('toggle.offre');

    // Gestion Entreprises
    Route::get('/dashboard/entreprise/show',    [AdminDashboardController::class, 'index_entreprise'])->name('index.entreprise');
    Route::post('/dashboard/entreprise/show',   [AdminDashboardController::class, 'store_entreprise'])->name('store.entreprise');
    Route::get('/dashboard/entreprise/add',     [AdminDashboardController::class, 'create_entreprise'])->name('create.entreprise');
    Route::post('/dashboard/entreprise/validate/{id}', [AdminDashboardController::class, 'validate_entreprise'])->name('validate.entreprise');
    Route::get('/dashboard/entreprise', function () {
        return Inertia::render('Admin/admin.main.entreprise');
    })->name('main.entreprise');

    // Dossiers, Stages et Candidatures
    Route::get('/dashboard/dossiers',            [AdminDashboardController::class, 'index_dossier'])->name('index.dossier');
    Route::post('/dashboard/dossiers/toggle/{id}', [AdminDashboardController::class, 'toggle_dossier'])->name('toggle.dossier');
    Route::get('/dashboard/stages',              [AdminDashboardController::class, 'index_stage'])->name('index.stage');
    Route::get('/dashboard/candidatures',        [CandidatureController::class, 'indexAdmin'])->name('index.candidature');

    // Formations
    Route::get('/dashboard/formations',              [AdminDashboardController::class, 'index_formation'])->name('index.formation');
    Route::post('/dashboard/formations/valider/{id}', [AdminDashboardController::class, 'valider_formation'])->name('valider.formation');
    Route::post('/dashboard/formations/refuser/{id}', [AdminDashboardController::class, 'refuser_formation'])->name('refuser.formation');

    // Traces et Archives
    Route::get('/dashboard/trace',               [AdminDashboardController::class, 'trace'])->name('trace');
    Route::get('/dashboard/trace/export',        [AdminDashboardController::class, 'export_trace'])->name('trace.export');
    Route::post('/dashboard/archiver',           [AdminDashboardController::class, 'archiver_annee'])->name('archiver.annee');
});

/*
|--------------------------------------------------------------------------
| Espace ENTREPRISE (role:E)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:E'])->prefix('entreprise')->name('entreprise.')->group(function () {
    
    Route::get('/dashboard', function () {
        return Inertia::render('Entreprise/entreprise.main');
    })->name('dashboard');

    // Offres
    Route::get('/dashboard/offre',        [EntrepriseDashboardController::class, 'index_offre'])->name('index.offre');
    Route::post('/dashboard/offres/add',  [EntrepriseDashboardController::class, 'store_offre'])->name('store.offre');

    // Candidatures reçues
    Route::get('/candidatures',                       [CandidatureController::class, 'indexEntreprise'])->name('candidatures.index');
    Route::post('/candidatures/{candidature}/accepter', [CandidatureController::class, 'accepter'])->name('candidatures.accepter');
    Route::post('/candidatures/{candidature}/refuser',  [CandidatureController::class, 'refuser'])->name('candidatures.refuser');
});

/*
|--------------------------------------------------------------------------
| Espace ÉTUDIANT (role:S)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:S'])->prefix('etudiant')->name('etudiant.')->group(function () {

    // Dashboard et Navigation principale
    Route::get('/dashboard',    [EtudiantDashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/offres',       [EtudiantDashboardController::class, 'offres'])->name('offres');
    Route::get('/dossier',      [EtudiantDashboardController::class, 'dossier'])->name('dossier');

    // Cahier de stage
    Route::get('/cahier',            [EtudiantDashboardController::class, 'cahier'])->name('cahier');
    Route::post('/cahier',           [EtudiantDashboardController::class, 'store_cahier'])->name('cahier.store');
    Route::delete('/cahier/{entree}', [EtudiantDashboardController::class, 'destroy_cahier'])->name('cahier.destroy');

    // Candidatures (Postuler, Voir, Retirer)
    Route::get('/candidatures',               [EtudiantDashboardController::class, 'candidatures'])->name('candidatures');
    Route::post('/candidatures',              [CandidatureController::class, 'store'])->name('candidatures.store');
    Route::delete('/candidatures/{candidature}', [CandidatureController::class, 'destroy'])->name('candidatures.destroy');

    // Remarques spécifiques (sur stage / dossier)
    Route::post('/remarques', [EtudiantDashboardController::class, 'store_remarque'])->name('remarques.store');

    // Demande de filière / formation
    Route::get('/formations',  [EtudiantDashboardController::class, 'index_demande_formation'])->name('demande.formation');
    Route::post('/formations', [EtudiantDashboardController::class, 'store_demande_formation'])->name('demande.formation.store');
});

/*
|--------------------------------------------------------------------------
| Autres Rôles (Tuteur / Jury)
|--------------------------------------------------------------------------
*/

Route::get('/tuteur/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'role:T'])->name('tuteur.dashboard');

Route::get('/jury/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'role:J'])->name('jury.dashboard');

require __DIR__.'/auth.php';