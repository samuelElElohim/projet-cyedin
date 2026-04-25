<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use App\Models\Utilisateur;
use App\Models\Administrateur;
use App\Models\Jury;
use App\Models\Tuteur;
use App\Models\Etudiant;
use App\Models\Offre;
use App\Models\Notification;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

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

        return redirect()->route('admin.index.user');
    }

    /**
     * BUG FIX : rôles corrigés 'E', 'T', 'S' au lieu de 'entreprise', 'tuteur', 'etudiant'
     */
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
            'premier_mdp_changer'  => false, // forcera le changement à la 1ère connexion
        ]);

        match ($validated['role']) {
            'A' => Administrateur::create(['utilisateurs_id' => $utilisateur->id]),
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

        return redirect()->route('admin.index.user')->with('success', 'Utilisateur ajouté !');
    }

    // ─── Offres ──────────────────────────────────────────────────────────────

    public function index_offre()
    {
        $entreprises = Entreprise::with('offres')->orderBy('id', 'asc')->get();

        return Inertia::render('Admin/admin.index.offre', [
            'entreprises' => $entreprises,
        ]);
    }

    public function toggle_offre($id)
    {
        $offre = Offre::findOrFail($id);
        $offre->est_active = !$offre->est_active;
        $offre->save();

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

    /**
     * Valider une entreprise en attente (est_active = false → true).
     */
    public function validate_entreprise(Request $request, $id)
    {
        $user = Utilisateur::findOrFail($id);
        $user->est_active = true;
        $user->save();

        // Notifier l'entreprise
        Notification::create([
            'proprietaire_id' => $user->id,
            'message'         => 'Votre compte entreprise a été validé. Vous pouvez maintenant vous connecter.',
        ]);

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

        return redirect()->route('admin.index.entreprise')->with('success', 'Entreprise ajoutée !');
    }
}