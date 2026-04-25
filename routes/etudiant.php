// ─── Dashboard Étudiant ───────────────────────────────────────────────────────
// À ajouter dans web.php, dans le groupe middleware(['auth', 'role:S'])

Route::middleware(['auth', 'role:S'])->group(function () {
    Route::get('/etudiant/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('etudiant.dashboard');

    // Demande d'ajout de filière
    Route::get('/etudiant/formations',
        [EtudiantDashboardController::class, 'index_demande_formation']
    )->name('etudiant.demande.formation');

    Route::post('/etudiant/formations',
        [EtudiantDashboardController::class, 'store_demande_formation']
    )->name('etudiant.demande.formation.store');
});
