<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminOffreController;
use App\Http\Controllers\Admin\AdminEntrepriseController;
use App\Http\Controllers\Admin\AdminDossierController;
use App\Http\Controllers\Admin\AdminStageController;
use App\Http\Controllers\Admin\AdminTraceController;
use App\Http\Controllers\AdminHierarchieController;
use App\Http\Controllers\DemandeHierarchieController;
use App\Http\Controllers\EntrepriseDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OffreController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\RemarqueController;
use App\Http\Controllers\CandidatureController;
use App\Http\Controllers\EtudiantDashboardController;
use App\Http\Controllers\TuteurDashboardController;
use App\Http\Controllers\JuryDashboardController;
use App\Http\Controllers\AdminImportController;
use App\Http\Controllers\Auth\InscriptionEntrepriseController;
use App\Http\Controllers\Auth\PremierMotDePasseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;


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

    // Documents
    Route::get('/documents',                          [DocumentController::class, 'index'])->name('documents.index');
    Route::post('/documents',                         [DocumentController::class, 'store'])->name('documents.store');
    Route::get('/documents/{document}/download',      [DocumentController::class, 'download'])->name('documents.download');
    Route::delete('/documents/{document}',            [DocumentController::class, 'destroy'])->name('documents.destroy');
    Route::post('/documents/{document}/set-main-cv',  [DocumentController::class, 'set_main_cv'])->name('documents.set-main-cv');
    Route::post('/documents/main-cv',                 [DocumentController::class, 'store_main_cv'])->name('documents.store-main-cv');

    // Porte-document étudiant
    Route::get('/porte-document', [DocumentController::class, 'porte_document'])->name('etudiant.porte.document');

    // Remarques générales
    Route::post('/remarques',              [RemarqueController::class, 'store'])->name('remarques.store');
    Route::delete('/remarques/{remarque}', [RemarqueController::class, 'destroy'])->name('remarques.destroy');

    // Dashboard générique de redirection
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::post('/notifications/mark-read', function () {
        \App\Models\Notification::where('proprietaire_id', auth()->id())
            ->where('est_lu', false)
            ->update(['est_lu' => true]);
        return back();
    })->name('notifications.mark-read');

    // Demandes de hiérarchie (partagée tous rôles connectés)
    Route::get('/suggerer',  [DemandeHierarchieController::class, 'index'])->name('demande.hierarchie');
    Route::post('/suggerer', [DemandeHierarchieController::class, 'store'])->name('demande.hierarchie.store');
});

/*
|--------------------------------------------------------------------------
| Espace ADMIN (role:A)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:A'])->prefix('admin')->name('admin.')->group(function () {
    
    Route::get('/dashboard', [AdminDashboardController::class, 'dashboard'])->name('dashboard');

    // Gestion Utilisateurs
    Route::get('/dashboard/user/show',          [AdminUserController::class, 'index'])->name('index.user');
    Route::get('/dashboard/user/add',           [AdminUserController::class, 'create'])->name('create.user');
    Route::post('/dashboard/user/add',          [AdminUserController::class, 'store'])->name('store.user');
    Route::post('/dashboard/user/{id}',         [AdminUserController::class, 'edit'])->name('edit.user');
    Route::post('/dashboard/user/toggle/{id}',  [AdminUserController::class, 'toggle'])->name('toggle.user');
    Route::delete('/admin/users/{id}',          [AdminUserController::class, 'destroy'])->name('delete.user');
    Route::get('/dashboard/user',               fn() => redirect()->route('admin.index.user'))->name('main.user');

    // Gestion Offres
    Route::get('/dashboard/offres/show',        [AdminOffreController::class, 'index'])->name('index.offre');
    Route::post('/dashboard/offre/toggle/{id}', [AdminOffreController::class, 'toggle'])->name('toggle.offre');

    // Gestion Entreprises
    Route::get('/dashboard/entreprise/show',           [AdminEntrepriseController::class, 'index'])->name('index.entreprise');
    Route::post('/dashboard/entreprise/show',          [AdminEntrepriseController::class, 'store'])->name('store.entreprise');
    Route::get('/dashboard/entreprise/add',            [AdminEntrepriseController::class, 'create'])->name('create.entreprise');
    Route::post('/dashboard/entreprise/validate/{id}', [AdminEntrepriseController::class, 'validate'])->name('validate.entreprise');
    Route::get('/dashboard/entreprise',                fn() => redirect()->route('admin.index.entreprise'))->name('main.entreprise');

    // Dossiers, Stages et Candidatures
    Route::get('/dashboard/dossiers',              [AdminDossierController::class, 'index'])->name('index.dossier');
    Route::post('/dashboard/dossiers/toggle/{id}', [AdminDossierController::class, 'toggle'])->name('toggle.dossier');
    Route::get('/dashboard/stages',                [AdminStageController::class, 'index'])->name('index.stage');
    Route::get('/dashboard/candidatures',          [CandidatureController::class, 'indexAdmin'])->name('index.candidature');

    // Traces et Archives
    Route::get('/dashboard/trace',              [AdminTraceController::class, 'index'])->name('trace');
    Route::get('/dashboard/trace/export',       [AdminTraceController::class, 'export'])->name('trace.export');
    Route::post('/dashboard/archiver',          [AdminTraceController::class, 'archiver'])->name('archiver.annee');
    Route::get('/dashboard/archives',           [AdminTraceController::class, 'listerArchives'])->name('lister.archives');
    Route::get('/dashboard/archives/download',  [AdminTraceController::class, 'telechargerArchive'])->name('telecharger.archive');
    Route::post('/dashboard/reset-annee',       [AdminTraceController::class, 'resetAnnee'])->name('reset.annee');

    Route::get('/dashboard/import',         [AdminImportController::class, 'create'])->name('import.user');
    Route::post('/dashboard/import/preview',[AdminImportController::class, 'preview'])->name('import.user.preview');
    Route::post('/dashboard/import/store',  [AdminImportController::class, 'store'])->name('import.user.store');

    // Demandes de hiérarchie (admin)
    Route::get('/dashboard/demandes',                    [DemandeHierarchieController::class, 'admin_index'])->name('demandes');
    Route::post('/dashboard/demandes/{id}/approuver',    [DemandeHierarchieController::class, 'approuver'])->name('demandes.approuver');
    Route::post('/dashboard/demandes/{id}/refuser',      [DemandeHierarchieController::class, 'refuser'])->name('demandes.refuser');

    // Gestion hiérarchie Filière → Secteur → Tag
    Route::get('/dashboard/hierarchie',                    [AdminHierarchieController::class, 'index'])->name('hierarchie');
    Route::post('/dashboard/hierarchie/filieres',          [AdminHierarchieController::class, 'store_filiere'])->name('hierarchie.filiere.store');
    Route::put('/dashboard/hierarchie/filieres/{id}',      [AdminHierarchieController::class, 'update_filiere'])->name('hierarchie.filiere.update');
    Route::delete('/dashboard/hierarchie/filieres/{id}',   [AdminHierarchieController::class, 'destroy_filiere'])->name('hierarchie.filiere.destroy');
    Route::post('/dashboard/hierarchie/secteurs',          [AdminHierarchieController::class, 'store_secteur'])->name('hierarchie.secteur.store');
    Route::put('/dashboard/hierarchie/secteurs/{id}',      [AdminHierarchieController::class, 'update_secteur'])->name('hierarchie.secteur.update');
    Route::delete('/dashboard/hierarchie/secteurs/{id}',   [AdminHierarchieController::class, 'destroy_secteur'])->name('hierarchie.secteur.destroy');
    Route::post('/dashboard/hierarchie/tags',              [AdminHierarchieController::class, 'store_tag'])->name('hierarchie.tag.store');
    Route::put('/dashboard/hierarchie/tags/{id}',          [AdminHierarchieController::class, 'update_tag'])->name('hierarchie.tag.update');
    Route::delete('/dashboard/hierarchie/tags/{id}',       [AdminHierarchieController::class, 'destroy_tag'])->name('hierarchie.tag.destroy');

});

/*
|--------------------------------------------------------------------------
| Espace ENTREPRISE (role:E)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:E'])->prefix('entreprise')->name('entreprise.')->group(function () {

    // Dashboard
    Route::get('/dashboard', [EntrepriseDashboardController::class, 'dashboard'])->name('dashboard');

    // Offres
    Route::get('/offres',        [EntrepriseDashboardController::class, 'index_offre'])->name('index.offre');
    Route::post('/offres',       [EntrepriseDashboardController::class, 'store_offre'])->name('store.offre');

    // Candidatures reçues
    Route::get('/candidatures',                          [EntrepriseDashboardController::class, 'index_candidatures'])->name('candidatures');
    Route::post('/candidatures/{candidature}/accepter',  [CandidatureController::class, 'accepter'])->name('candidatures.accepter');
    Route::post('/candidatures/{candidature}/refuser',   [CandidatureController::class, 'refuser'])->name('candidatures.refuser');

    Route::get('/candidatures/{candidature}/download/{type}',
        [CandidatureController::class, 'download'])
        ->name('candidatures.download');


    // Stages
    Route::get('/stages',                    [EntrepriseDashboardController::class, 'index_stages'])->name('index.stage');
    Route::get('/stages/{stageId}',          [EntrepriseDashboardController::class, 'index_stage_detail'])->name('stage.detail');

    // Convention
    Route::post('/stages/{stageId}/signer',  [EntrepriseDashboardController::class, 'signer_convention'])->name('convention.signer');

    // Missions (rattachées à un stage)
    Route::post('/stages/{stageId}/mission', [EntrepriseDashboardController::class, 'store_mission'])->name('stage.mission');
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

    // AJOUT SIGNATURE CONVENTION
    Route::post('/convention/{stageId}/signer', [EtudiantDashboardController::class, 'signer_convention'])->name('convention.signer');

    // Cahier de stage
    Route::get('/cahier',            [EtudiantDashboardController::class, 'cahier'])->name('cahier');
    Route::post('/cahier',           [EtudiantDashboardController::class, 'store_cahier'])->name('cahier.store');
    Route::delete('/cahier/{entree}', [EtudiantDashboardController::class, 'destroy_cahier'])->name('cahier.destroy');

    // Candidatures (Postuler, Voir, Retirer)
    Route::get('/candidatures',               [EtudiantDashboardController::class, 'candidatures'])->name('candidatures');
    Route::post('/candidatures',              [CandidatureController::class, 'store'])->name('candidatures.store');
    Route::delete('/candidatures/{candidature}', [CandidatureController::class, 'destroy'])->name('candidatures.destroy');

    // Remarques spécifiques
    Route::post('/remarques', [EtudiantDashboardController::class, 'store_remarque'])->name('remarques.store');

    Route::get('/entreprises', [EtudiantDashboardController::class, 'entreprises'])->name('entreprises');
    Route::post('/notify-tuteur', [EtudiantDashboardController::class, 'notify_tuteur'])->name('notify.tuteur');

    Route::get('/candidatures',                          [EtudiantDashboardController::class, 'candidatures'])->name('candidatures');
    Route::post('/candidatures',                         [CandidatureController::class, 'store'])->name('candidatures.store');
    Route::delete('/candidatures/{candidature}',         [CandidatureController::class, 'destroy'])->name('candidatures.destroy');
    Route::post('/candidatures/{candidature}/confirmer', [CandidatureController::class, 'confirmer'])->name('candidatures.confirmer');
    Route::post('/candidatures/{candidature}/decliner',  [CandidatureController::class, 'refuserParEtudiant'])->name('candidatures.decliner');
});

/*
|--------------------------------------------------------------------------
| Espace TUTEUR (role:T)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:T'])->prefix('tuteur')->name('tuteur.')->group(function () {

    Route::get('/dashboard', [TuteurDashboardController::class, 'dashboard'])->name('dashboard');

    // Stage
    Route::get('/stage/create',  [TuteurDashboardController::class, 'create_stage'])->name('create.stage');
    Route::post('/stage/create', [TuteurDashboardController::class, 'store_stage'])->name('store.stage');

    // Convention
    Route::post('/convention/{stageId}/signer', [TuteurDashboardController::class, 'signer_convention'])->name('signer.convention');

    // Étudiant : cahier + documents/remarques
    Route::get('/etudiant/{etudiantId}/cahier',    [TuteurDashboardController::class, 'cahier'])->name('cahier');
    Route::get('/etudiant/{etudiantId}',            [TuteurDashboardController::class, 'documents'])->name('etudiant');

    Route::get('/etudiants',                          [TuteurDashboardController::class, 'etudiants'])->name('etudiant.follow');
    Route::post('/etudiants/{etudiant}/suivre',       [TuteurDashboardController::class, 'suivre'])->name('etudiants.suivre');
    Route::delete('/etudiants/{etudiant}/retirer',    [TuteurDashboardController::class, 'retirer'])->name('etudiants.retirer');

    // Remarques
    Route::post('/remarques', [TuteurDashboardController::class, 'store_remarque'])->name('remarques.store');

    Route::get('/offres', [TuteurDashboardController::class, 'offres'])->name('offres');
});

/* 
|--------------------------------------------------------------------------
| Espace JURY (role:J) - Bloc Mis à jour
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:J'])->prefix('jury')->name('jury.')->group(function () {

    // Dashboard
    Route::get('/dashboard', [JuryDashboardController::class, 'dashboard'])->name('dashboard');

    // Dossiers
    Route::get('/dossiers',                          [JuryDashboardController::class, 'index_dossiers'])->name('index.dossiers');
    Route::get('/dossiers/{dossierId}',              [JuryDashboardController::class, 'show_dossier'])->name('dossier.detail');
    Route::post('/dossiers/{dossierId}/valider',     [JuryDashboardController::class, 'valider_dossier'])->name('dossier.valider');
    Route::post('/dossiers/{dossierId}/invalider',   [JuryDashboardController::class, 'invalider_dossier'])->name('dossier.invalider');

    // Remarques
    Route::post('/remarques',                        [JuryDashboardController::class, 'store_remarque'])->name('remarque.store');

    // Stages (consultation uniquement)
    Route::get('/stages',                            [JuryDashboardController::class, 'index_stages'])->name('index.stages');
});

require __DIR__.'/auth.php';