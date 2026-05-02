<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use App\Models\Filiere;
use App\Models\Secteur;
use App\Models\Utilisateur;
use App\Models\Administrateur;
use App\Models\Tuteur;
use App\Models\Etudiant;
use App\Models\Offre;
use App\Models\Notification;
use App\Models\Stage;
use App\Models\Dossier_stage;
use App\Services\TraceLogger;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminDashboardController extends Controller
{
    // ─── Dashboard principal ─────────────────────────────────────────────────

    public function dashboard()
    {
        return Inertia::render('Admin/admin.main', [
            'stats' => [
                'utilisateurs'        => Utilisateur::count(),
                'etudiants'           => Etudiant::count(),
                'entreprises'         => Entreprise::count(),
                'offres_actives'      => Offre::where('est_active', true)->count(),
                'offres_pending'      => Offre::where('est_active', false)->count(),
                'entreprises_pending' => Utilisateur::where('role', 'E')
                                            ->where('est_active', false)
                                            ->count(),
                'stages_en_cours'     => Stage::count(),
                'dossiers_pending'      => Dossier_stage::where('est_valide', false)->count(),
                'demandes_pending'      => \App\Models\DemandeHierarchie::where('statut', 'en_attente')->count(),
            ],
            'notifications' => Notification::where('proprietaire_id', auth()->id())
                                ->where('est_lu', false)
                                ->latest('date_envoi')
                                ->take(10)
                                ->get(),
            'entreprises_pending' => Utilisateur::where('role', 'E')
                                        ->where('est_active', false)
                                        ->with('entreprise')
                                        ->get(),
        ]);
    }

    // ─── Utilisateurs ────────────────────────────────────────────────────────

    public function index_user()
    {
        $users       = Utilisateur::orderBy('id', 'asc')->get();
        $admins      = Administrateur::with('utilisateur')->orderBy('utilisateurs_id')->get();
        $students    = Etudiant::with(['utilisateur', 'filiere'])->get();
        $entreprises = Entreprise::with(['utilisateur', 'secteurs.filiere'])->orderBy('utilisateurs_id')->get();
        $tutors      = Tuteur::with(['utilisateur', 'filiere', 'secteurs.filiere'])->orderBy('utilisateurs_id')->get();
        $count       = Utilisateur::count();

        return Inertia::render('Admin/admin.index.user', [
            'users'       => $users,
            'admins'      => $admins,
            'students'    => $students,
            'tutors'      => $tutors,
            'entreprises' => $entreprises,
            'count'       => $count,
        ]);
    }

    public function destroy(int $id)
    {
        $user = Utilisateur::findOrFail($id);
        abort_if($user->role === 'A', 403, 'Impossible de supprimer un administrateur.');
        
        $user->delete();

        TraceLogger::log('delete_user', ['user_id' => $id]);

        return back()->with('success', 'Utilisateur supprimé.');
    }
    public function toggle_user(Request $request, $id)
    {
        $user = Utilisateur::findOrFail($id);
        $user->est_active = !$user->est_active;
        $user->save();

        TraceLogger::log('toggle_user', ['id' => $id, 'est_active' => $user->est_active]);

        return back();
    }

    public function edit_user(Request $request, $id)
    {
        $request->validate([
            'nom'          => 'required|string|max:25',
            'prenom'       => 'nullable|string|max:15',
            'email'        => 'required|string|max:42|unique:utilisateurs,email,' . $id,
            'role'         => 'required|string|in:A,T,E,S',
            'filiere_id'   => 'nullable|integer|exists:filieres,id',
            'niveau_etud'  => 'nullable|integer|min:1',
            'secteurs_ids' => 'nullable|array',
            'secteurs_ids.*' => 'integer|exists:secteurs,id',
            'addresse'     => 'nullable|string',
            'est_jury'     => 'nullable|boolean',
        ]);

        Utilisateur::where('id', $id)->update(
            $request->only(['nom', 'prenom', 'email', 'role'])
        );

        $secteursIds = $request->secteurs_ids ?? [];

        match ($request->role) {
            'E' => (function () use ($request, $id, $secteursIds) {
                $entreprise = Entreprise::where('utilisateurs_id', $id)->firstOrFail();
                $entreprise->update(['addresse' => $request->addresse]);
                $entreprise->secteurs()->sync($secteursIds);
                $filiereIds = Secteur::whereIn('id', $secteursIds)->pluck('filiere_id')->unique()->toArray();
                $entreprise->filieres()->sync($filiereIds);
            })(),

            'T' => (function () use ($request, $id, $secteursIds) {
                $tuteur = Tuteur::where('utilisateurs_id', $id)->firstOrFail();
                $tuteur->update(['filiere_id' => $request->filiere_id]);
                $tuteur->secteurs()->sync($secteursIds);
            })(),

            'S' => Etudiant::where('utilisateurs_id', $id)->update([
                'filiere_id'  => $request->filiere_id,
                'niveau_etud' => $request->niveau_etud,
            ]),

            default => null,
        };

        TraceLogger::log('edit_user', ['id' => $id]);

        return redirect()->route('admin.index.user');
    }


    public function create_user()
    {
        // Hiérarchie complète pour les selects du formulaire
        $filieres = Filiere::with(['secteurs' => fn($q) => $q->orderBy('secteur')])->orderBy('filiere')->get();
        $secteurs = Secteur::with('filiere')->orderBy('secteur')->get();

        return Inertia::render('Admin/admin.create.user', [
            'filieres' => $filieres,
            'secteurs' => $secteurs,
        ]);
    }

    public function store_user(Request $request)
    {
    
        $validated = $request->validate([
            'nom'          => 'required|string|max:25',
            'prenom'       => 'nullable|string|max:15',
            'email'        => 'required|string|max:42|unique:utilisateurs',
            'role'         => 'required|string|in:A,T,E,S',
            // Étudiant : une seule filière
            'filiere_id'   => 'required_if:role,S|nullable|integer|exists:filieres,id',
            'niveau_etud'  => 'required_if:role,S|nullable|integer|min:1',
            // Tuteur : secteurs multiples
            'secteurs_ids' => 'required_if:role,T|array',
            'secteurs_ids.*' => 'integer|exists:secteurs,id',
            'filiere_id_tuteur' => 'nullable|integer|exists:filieres,id',
            'est_jury'     => 'nullable|boolean',
            // Entreprise : secteurs multiples
            'addresse'     => 'required_if:role,E|nullable|string',
            'secteurs_ids' => 'required_if:role,E|array',
        ]);
    
        $utilisateur = Utilisateur::create([
            'nom'                  => $validated['nom'],
            'prenom'               => $validated['prenom'] ?? null,
            'email'                => $validated['email'],
            'role'                 => $validated['role'],
            'mot_de_passe'         => Hash::make('password'),
            'est_active'           => true,
            'premier_mdp_changer'  => false,
        ]);

        // Secteurs communs aux roles T et E
        $secteursIds = $validated['secteurs_ids'] ?? [];

        switch ($validated['role']) {
            case 'A':
                Administrateur::create(['utilisateurs_id' => $utilisateur->id]);
                break;

            case 'S':
                Etudiant::create([
                    'utilisateurs_id' => $utilisateur->id,
                    'filiere_id'      => $validated['filiere_id'],
                    'niveau_etud'     => $validated['niveau_etud'],
                ]);
                break;

            case 'E':
                $entreprise = Entreprise::create([
                    'utilisateurs_id' => $utilisateur->id,
                    'nom_entreprise'  => $validated['nom'],
                    'addresse'        => $validated['addresse'],
                ]);
                // Sync secteurs + filieres déduites
                $entreprise->secteurs()->sync($secteursIds);
                $filiereIds = Secteur::whereIn('id', $secteursIds)->pluck('filiere_id')->unique()->toArray();
                $entreprise->filieres()->sync($filiereIds);
                break;

            case 'T':
                $tuteur = Tuteur::create([
                    'utilisateurs_id' => $utilisateur->id,
                    'filiere_id'      => $validated['filiere_id_tuteur'] ?? null,
                ]);
                $tuteur->secteurs()->sync($secteursIds);
                break;
        }

        TraceLogger::log('store_user', ['email' => $validated['email'], 'role' => $validated['role']]);

        return redirect()->route('admin.index.user')->with('success', 'Utilisateur ajouté !');
    }

    // ─── Offres ──────────────────────────────────────────────────────────────

    public function index_offre(Request $request)
    {
        $query = Entreprise::with(['offres' => function ($q) use ($request) {
            if ($request->filled('duree_max')) {
                $q->where('duree_semaines', '<=', $request->duree_max);
            }
            if ($request->filled('duree_min')) {
                $q->where('duree_semaines', '>=', $request->duree_min);
            }
            if ($request->filled('search')) {
                $q->where(function ($sq) use ($request) {
                    $sq->where('titre', 'ilike', '%' . $request->search . '%')
                       ->orWhere('description', 'ilike', '%' . $request->search . '%');
                });
            }
            if ($request->filled('statut') && $request->statut !== 'all') {
                $q->where('est_active', $request->statut === 'active');
            }
        }])->orderBy('id', 'asc');

        $entreprises = $query->get();

        return Inertia::render('Admin/admin.index.offre', [
            'entreprises' => $entreprises,
            'filters'     => $request->only(['search', 'duree_min', 'duree_max', 'statut']),
        ]);
    }

    public function toggle_offre($id)
    {
        $offre = Offre::findOrFail($id);
        $offre->est_active = !$offre->est_active;
        $offre->save();

        TraceLogger::log('toggle_offre', ['id' => $id, 'est_active' => $offre->est_active]);

        return back();
    }

    // ─── Entreprises ─────────────────────────────────────────────────────────

    public function index_entreprise()
    {
        $entreprises = Entreprise::with('utilisateur')->orderBy('utilisateurs_id')->get();

        return Inertia::render('Admin/admin.index.entreprise', [
            'entreprise' => $entreprises,
            'count'      => $entreprises->count(),
        ]);
    }

    public function create_entreprise()
    {
        return Inertia::render('Admin/admin.create.entreprise');
    }

    public function validate_entreprise(Request $request, $id)
    {
        $user = Utilisateur::findOrFail($id);
        $user->est_active = true;
        $user->save();

        Notification::create([
            'proprietaire_id' => $user->id,
            'message'         => 'Votre compte entreprise a été validé. Vous pouvez maintenant vous connecter.',
        ]);

        TraceLogger::log('validate_entreprise', ['id' => $id, 'email' => $user->email]);

        return back()->with('success', 'Entreprise validée avec succès.');
    }

    public function store_entreprise(Request $request)
    {
        $validated = $request->validate([
            'nom_entreprise'  => 'required|string|max:255',
            'addresse'        => 'required|string|max:255',
            'secteur'         => 'required|string|max:255',
            'utilisateurs_id' => 'required|integer',
        ]);

        Entreprise::create($validated);

        TraceLogger::log('store_entreprise', ['nom' => $validated['nom_entreprise']]);

        return redirect()->route('admin.index.entreprise')->with('success', 'Entreprise ajoutée !');
    }

    // ─── Dossiers de stage ───────────────────────────────────────────────────

    public function index_dossier(Request $request)
    {
        $query = Dossier_stage::with([
                'etudiant.utilisateur',
                'etudiant.filiere',
                'etudiant.stages' => fn($q) => $q->with('convention')->latest('id'),
                'documents',
            ])
            ->orderBy('created_at', 'desc');

        if ($request->filled('statut')) {
            $query->where('est_valide', $request->statut === 'valide');
        }

        if ($request->filled('search')) {
            $query->whereHas('etudiant.utilisateur', function ($q) use ($request) {
                $q->where('nom', 'ilike', '%' . $request->search . '%')
                  ->orWhere('email', 'ilike', '%' . $request->search . '%');
            });
        }

        $dossiers = $query->get();

        return Inertia::render('Admin/admin.index.dossier', [
            'dossiers' => $dossiers,
            'count'    => $dossiers->count(),
            'filters'  => $request->only(['search', 'statut']),
        ]);
    }

    public function toggle_dossier($id)
    {
        $dossier = Dossier_stage::findOrFail($id);
        $dossier->est_valide = !$dossier->est_valide;
        $dossier->save();

        TraceLogger::log('toggle_dossier', ['id' => $id, 'est_valide' => $dossier->est_valide]);

        return back();
    }

    // ─── Suivi des stages ─────────────────────────────────────────────────────

    public function index_stage(Request $request)
    {
        $query = Stage::with([
            'etudiant.utilisateur',
            'etudiant.filiere',
            'etudiant.dossier',
            'entreprise',
            'tuteur.utilisateur',
            'convention',
        ])->orderBy('id', 'desc');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('sujet', 'ilike', '%' . $request->search . '%')
                  ->orWhereHas('etudiant.utilisateur', fn($sq) =>
                      $sq->where('nom', 'ilike', '%' . $request->search . '%')
                  )
                  ->orWhereHas('entreprise', fn($sq) =>
                      $sq->where('nom_entreprise', 'ilike', '%' . $request->search . '%')
                  );
            });
        }

        if ($request->filled('statut') && $request->statut !== 'all') {
            match ($request->statut) {
                'complet'    => $query->where('etat', 'actif')
                                      ->whereHas('etudiant.dossier', fn($q) => $q->where('est_valide', true)),
                'actif'      => $query->where('etat', 'actif')
                                      ->where(fn($q) => $q->whereDoesntHave('etudiant.dossier')
                                          ->orWhereHas('etudiant.dossier', fn($dq) => $dq->where('est_valide', false))),
                'en_attente' => $query->where('etat', 'en_attente_convention'),
                default      => null,
            };
        }

        $stages = $query->get()->map(function ($stage) {
            $conv = $stage->convention;
            $conventionComplete = $conv
                && $conv->signer_par_entreprise
                && $conv->signer_par_tuteur
                && $conv->signer_par_etudiant;

            $dossierValide = $stage->etudiant?->dossier?->est_valide ?? false;

            $stage->convention_status = $conv ? [
                'entreprise' => $conv->signer_par_entreprise,
                'tuteur'     => $conv->signer_par_tuteur,
                'etudiant'   => $conv->signer_par_etudiant,
                'complete'   => $conventionComplete,
            ] : null;

            $stage->dossier_valide = $dossierValide;

            $stage->statut_global = match(true) {
                $conventionComplete && $dossierValide => 'complet',
                $conventionComplete                   => 'actif',
                default                               => 'en_attente',
            };

            return $stage;
        });

        return Inertia::render('Admin/admin.index.stage', [
            'stages'  => $stages,
            'count'   => $stages->count(),
            'filters' => $request->only(['search', 'statut']),
        ]);
    }

    // ─── Trace ───────────────────────────────────────────────────────────────

    public function trace()
    {
        $content = TraceLogger::tail(300);

        return Inertia::render('Admin/admin.trace', [
            'trace' => $content,
        ]);
    }

    public function export_trace(): StreamedResponse
    {
        $path = storage_path('logs/trace.log');

        return response()->streamDownload(function () use ($path) {
            if (file_exists($path)) {
                readfile($path);
            }
        }, 'trace-' . now()->format('Y-m-d') . '.log', [
            'Content-Type' => 'text/plain',
        ]);
    }

    // ─── Archivage annuel ─────────────────────────────────────────────────────

    public function archiver_annee(Request $request)
    {
        $annee = $request->input('annee', now()->year);

        // Marquer tous les dossiers validés comme archivés (on ajoute un champ annee_archive)
        // Pour l'instant : exporter un snapshot JSON et logger l'action
        $snapshot = [
            'annee'     => $annee,
            'date'      => now()->toIso8601String(),
            'stages'    => Stage::with(['etudiant.utilisateur', 'entreprise', 'tuteur.utilisateur'])->get()->toArray(),
            'dossiers'  => Dossier_stage::with('etudiant.utilisateur')->get()->toArray(),
        ];

        $filename = "archive-{$annee}-" . now()->format('Ymd-His') . '.json';
        Storage::disk('local')->put("archives/{$filename}", json_encode($snapshot, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        TraceLogger::log('archiver_annee', ['annee' => $annee, 'fichier' => $filename]);

        Notification::create([
            'proprietaire_id' => auth()->id(),
            'message'         => "Archivage de l'année {$annee} effectué → {$filename}",
        ]);

        return back()->with('success', "Archive {$annee} créée : {$filename}");
    }

        public function reset_annee(Request $request): \Illuminate\Http\RedirectResponse
    {
        $annee = $request->input('annee', now()->year);
 
        // 1. Archiver l'état courant avant de supprimer
        $snapshot = [
            'annee'    => (int) $annee,
            'date'     => now()->toIso8601String(),
            'type'     => 'reset_annuel',
            'stages'   => Stage::with(['etudiant.utilisateur', 'entreprise', 'tuteur.utilisateur', 'convention'])->get()->toArray(),
            'dossiers' => Dossier_stage::with(['etudiant.utilisateur', 'documents'])->get()->toArray(),
        ];
 
        $filename = "archive-reset-{$annee}-" . now()->format('Ymd-His') . '.json';
        Storage::disk('local')->put(
            "archives/{$filename}",
            json_encode($snapshot, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
 
        // 2. Supprimer les données opérationnelles dans l'ordre des FK
        \DB::table('dossier_documents')->delete();
        \DB::table('convention_stages')->delete();
        \DB::table('cahier_stages')->delete();
        \DB::table('candidatures')->delete();
        \DB::table('dossier_stages')->delete();
        \DB::table('stages')->delete();
 
        // Supprimer uniquement les notifications lues (garder les non-lues)
        \DB::table('notifications')->where('est_lu', true)->delete();
 
        // 3. Remettre les offres en attente de validation (nouveau cycle)
        \DB::table('offres')->update(['est_active' => false]);
 
        // 4. Notifier tous les admins
        $adminIds = Administrateur::pluck('utilisateurs_id');
        foreach ($adminIds as $adminId) {
            Notification::create([
                'proprietaire_id' => $adminId,
                'message'         => "✅ Réinitialisation annuelle {$annee} effectuée. Archive créée : {$filename}. Les stages, dossiers, conventions et candidatures ont été remis à zéro.",
            ]);
        }
 
        TraceLogger::log('reset_annee', [
            'annee'    => $annee,
            'fichier'  => $filename,
            'admin_id' => auth()->id(),
        ]);
 
        return back()->with('success', "Réinitialisation {$annee} effectuée. Archive : {$filename}");
    }

}
