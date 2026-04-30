<?php

namespace App\Http\Controllers;

use App\Models\DemandeFormation;
use App\Models\Entreprise;
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
                'dossiers_pending'    => Dossier_stage::where('est_valide', false)->count(),
                'formations_pending'  => DemandeFormation::enAttente()->count(),
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
        $students    = Etudiant::with('utilisateur')->orderBy('utilisateurs_id')->get();
        $entreprises = Entreprise::with('utilisateur')->orderBy('utilisateurs_id')->get();
        $tutors      = Tuteur::with('utilisateur')->orderBy('utilisateurs_id')->get();
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
        Utilisateur::where('id', $id)->update(
            $request->only(['nom', 'prenom', 'email', 'role'])
        );

        match ($request->role) {
            'E' => Entreprise::where('utilisateurs_id', $id)->update(
                        $request->only(['addresse', 'secteur'])
                    ),
            'T' => Tuteur::where('utilisateurs_id', $id)->update(
                        $request->only(['departement'])
                    ),
            'S' => Etudiant::where('utilisateurs_id', $id)->update(
                        $request->only(['filiere', 'niveau_etud'])
                    ),
            default => null,
        };

        TraceLogger::log('edit_user', ['id' => $id]);

        return redirect()->route('admin.index.user');
    }

    public function create_user()
    {
        return Inertia::render('Admin/admin.create.user');
    }

    public function store_user(Request $request)
    {
        $validated = $request->validate([
            'nom'         => 'required|string|max:25',
            'prenom'      => 'nullable|string|max:15',
            'email'       => 'required|string|max:42|unique:utilisateurs',
            'role'        => 'required|string|in:A,T,E,S',
            'filiere'     => 'required_if:role,S|nullable|string|max:10',
            'niveau_etud' => 'required_if:role,S|nullable|integer|min:1',
            'addresse'    => 'required_if:role,E|nullable|string',
            'secteur'     => 'required_if:role,E|nullable|string',
            'departement' => 'required_if:role,T|nullable|string',
            'est_jury'    => 'nullable|boolean',
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

        match ($validated['role']) {
            'A' => \App\Models\Administrateur::create(['utilisateurs_id' => $utilisateur->id]),
            'S' => Etudiant::create([
                        'utilisateurs_id' => $utilisateur->id,
                        'filiere'         => $validated['filiere'],
                        'niveau_etud'     => $validated['niveau_etud'],
                    ]),
            'E' => Entreprise::create([
                        'utilisateurs_id' => $utilisateur->id,
                        'nom_entreprise'  => $validated['nom'],
                        'addresse'        => $validated['addresse'],
                        'secteur'         => $validated['secteur'],
                    ]),
            'T' => Tuteur::create([
                        'utilisateurs_id' => $utilisateur->id,
                        'departement'     => $validated['departement'],
                    ]),
            default => null,
        };

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
        $query = Dossier_stage::with(['etudiant.utilisateur', 'documents'])
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

        if ($request->filled('convention')) {
            $complet = $request->convention === 'complete';
            $query->whereHas('convention', function ($q) use ($complet) {
                $q->where('signer_par_entreprise', $complet)
                  ->where('signer_par_tuteur', $complet)
                  ->where('signer_par_etudiant', $complet);
            });
        }

        $stages = $query->get()->map(function ($stage) {
            $conv = $stage->convention;
            $stage->convention_status = $conv ? [
                'entreprise' => $conv->signer_par_entreprise,
                'tuteur'     => $conv->signer_par_tuteur,
                'etudiant'   => $conv->signer_par_etudiant,
                'complete'   => $conv->signer_par_entreprise && $conv->signer_par_tuteur && $conv->signer_par_etudiant,
            ] : null;
            return $stage;
        });

        return Inertia::render('Admin/admin.index.stage', [
            'stages'  => $stages,
            'count'   => $stages->count(),
            'filters' => $request->only(['search', 'convention']),
        ]);
    }

    // ─── Formations ──────────────────────────────────────────────────────────

    public function index_formation(Request $request)
    {
        $query = DemandeFormation::with('etudiant', 'admin')
            ->orderBy('created_at', 'desc');

        if ($request->filled('statut') && $request->statut !== 'all') {
            $query->where('statut', $request->statut);
        }

        $demandes = $query->get();

        // Filières actuellement en base
        $filieres = Etudiant::select('filiere')->distinct()->pluck('filiere')->sort()->values();

        return Inertia::render('Admin/admin.index.formation', [
            'demandes' => $demandes,
            'filieres' => $filieres,
            'count'    => $demandes->count(),
            'filters'  => $request->only(['statut']),
        ]);
    }

    public function valider_formation(Request $request, $id)
    {
        $request->validate([
            'commentaire_admin' => 'nullable|string|max:500',
            'filiere_finale'    => 'required|string|max:10',
        ]);

        $demande = DemandeFormation::findOrFail($id);
        $demande->update([
            'statut'            => 'approuve',
            'admin_id'          => auth()->id(),
            'commentaire_admin' => $request->commentaire_admin,
        ]);

        // Notifier l'étudiant
        Notification::create([
            'proprietaire_id' => $demande->etudiant_id,
            'message'         => "Votre demande d'ajout de filière « {$demande->formation_demandee} » a été approuvée.",
        ]);

        // Ajouter la filière à la liste (on peut mettre à jour l'étudiant directement)
        Etudiant::where('utilisateurs_id', $demande->etudiant_id)
            ->update(['filiere' => $request->filiere_finale]);

        TraceLogger::log('valider_formation', ['demande_id' => $id, 'formation' => $demande->formation_demandee]);

        return back()->with('success', 'Formation validée.');
    }

    public function refuser_formation(Request $request, $id)
    {
        $request->validate(['commentaire_admin' => 'nullable|string|max:500']);

        $demande = DemandeFormation::findOrFail($id);
        $demande->update([
            'statut'            => 'refuse',
            'admin_id'          => auth()->id(),
            'commentaire_admin' => $request->commentaire_admin,
        ]);

        Notification::create([
            'proprietaire_id' => $demande->etudiant_id,
            'message'         => "Votre demande d'ajout de filière « {$demande->formation_demandee} » a été refusée.",
        ]);

        TraceLogger::log('refuser_formation', ['demande_id' => $id]);

        return back()->with('success', 'Formation refusée.');
    }

    // ─── Trace ───────────────────────────────────────────────────────────────

    public function trace()
    {
        $content = \App\Services\TraceLogger::tail(300);

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
