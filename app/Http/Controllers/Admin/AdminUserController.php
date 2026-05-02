<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Administrateur;
use App\Models\Entreprise;
use App\Models\Etudiant;
use App\Models\Filiere;
use App\Models\Secteur;
use App\Models\Tuteur;
use App\Models\Utilisateur;
use App\Services\TraceLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(): Response
    {
        $users       = Utilisateur::orderBy('id', 'asc')->get();
        $admins      = Administrateur::with('utilisateur')->orderBy('utilisateurs_id')->get();
        $students    = Etudiant::with(['utilisateur', 'filiere'])->get();
        $entreprises = Entreprise::with(['utilisateur', 'secteurs.filiere'])->orderBy('utilisateur_id')->get();
        $tutors      = Tuteur::with(['utilisateur', 'filiere', 'secteurs.filiere'])->orderBy('utilisateur_id')->get();

        return Inertia::render('Admin/admin.index.user', [
            'users'       => $users,
            'admins'      => $admins,
            'students'    => $students,
            'tutors'      => $tutors,
            'entreprises' => $entreprises,
            'count'       => Utilisateur::count(),
        ]);
    }

    public function create(): Response
    {
        $filieres = Filiere::with(['secteurs' => fn($q) => $q->orderBy('secteur')])->orderBy('filiere')->get();
        $secteurs = Secteur::with('filiere')->orderBy('secteur')->get();

        return Inertia::render('Admin/admin.create.user', [
            'filieres' => $filieres,
            'secteurs' => $secteurs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom'               => 'required|string|max:25',
            'prenom'            => 'nullable|string|max:15',
            'email'             => 'required|string|max:42|unique:utilisateurs',
            'role'              => 'required|string|in:A,T,E,S',
            'filiere_id'        => 'required_if:role,S|nullable|integer|exists:filieres,id',
            'niveau_etud'       => 'required_if:role,S|nullable|integer|min:1',
            'secteurs_ids'      => 'required_if:role,T|array',
            'secteurs_ids.*'    => 'integer|exists:secteurs,id',
            'filiere_id_tuteur' => 'nullable|integer|exists:filieres,id',
            'est_jury'          => 'nullable|boolean',
            'addresse'          => 'required_if:role,E|nullable|string',
        ]);

        $utilisateur = Utilisateur::create([
            'nom'                 => $validated['nom'],
            'prenom'              => $validated['prenom'] ?? null,
            'email'               => $validated['email'],
            'role'                => $validated['role'],
            'mot_de_passe'        => 'password',
            'est_active'          => true,
            'premier_mdp_changer' => false,
        ]);

        $secteursIds = $validated['secteurs_ids'] ?? [];

        match ($validated['role']) {
            'A' => Administrateur::create(['utilisateurs_id' => $utilisateur->id]),
            'S' => Etudiant::create([
                'utilisateur_id' => $utilisateur->id,
                'filiere_id'      => $validated['filiere_id'],
                'niveau_etud'     => $validated['niveau_etud'],
            ]),
            'E' => (function () use ($utilisateur, $validated, $secteursIds) {
                $entreprise = Entreprise::create([
                    'utilisateur_id' => $utilisateur->id,
                    'nom_entreprise'  => $validated['nom'],
                    'addresse'        => $validated['addresse'],
                ]);
                $entreprise->secteurs()->sync($secteursIds);
                $filiereIds = Secteur::whereIn('id', $secteursIds)->pluck('filiere_id')->unique()->toArray();
                $entreprise->filieres()->sync($filiereIds);
            })(),
            'T' => (function () use ($utilisateur, $validated, $secteursIds) {
                $tuteur = Tuteur::create([
                    'utilisateur_id' => $utilisateur->id,
                    'filiere_id'      => $validated['filiere_id_tuteur'] ?? null,
                ]);
                $tuteur->secteurs()->sync($secteursIds);
            })(),
        };

        TraceLogger::log('store_user', ['email' => $validated['email'], 'role' => $validated['role']]);

        return redirect()->route('admin.index.user')->with('success', 'Utilisateur ajouté !');
    }

    public function edit(Request $request, int $id)
    {
        $request->validate([
            'nom'            => 'required|string|max:25',
            'prenom'         => 'nullable|string|max:15',
            'email'          => 'required|string|max:42|unique:utilisateurs,email,' . $id,
            'role'           => 'required|string|in:A,T,E,S',
            'filiere_id'     => 'nullable|integer|exists:filieres,id',
            'niveau_etud'    => 'nullable|integer|min:1',
            'secteurs_ids'   => 'nullable|array',
            'secteurs_ids.*' => 'integer|exists:secteurs,id',
            'addresse'       => 'nullable|string',
            'est_jury'       => 'nullable|boolean',
        ]);

        Utilisateur::where('id', $id)->update($request->only(['nom', 'prenom', 'email', 'role']));

        $secteursIds = $request->secteurs_ids ?? [];

        match ($request->role) {
            'E' => (function () use ($request, $id, $secteursIds) {
                $entreprise = Entreprise::where('utilisateur_id', $id)->firstOrFail();
                $entreprise->update(['addresse' => $request->addresse]);
                $entreprise->secteurs()->sync($secteursIds);
                $filiereIds = Secteur::whereIn('id', $secteursIds)->pluck('filiere_id')->unique()->toArray();
                $entreprise->filieres()->sync($filiereIds);
            })(),
            'T' => (function () use ($request, $id, $secteursIds) {
                $tuteur = Tuteur::where('utilisateur_id', $id)->firstOrFail();
                $tuteur->update(['filiere_id' => $request->filiere_id]);
                $tuteur->secteurs()->sync($secteursIds);
            })(),
            'S' => Etudiant::where('utilisateur_id', $id)->update([
                'filiere_id'  => $request->filiere_id,
                'niveau_etud' => $request->niveau_etud,
            ]),
            default => null,
        };

        TraceLogger::log('edit_user', ['id' => $id]);

        return redirect()->route('admin.index.user');
    }

    public function toggle(Request $request, int $id)
    {
        $user = Utilisateur::findOrFail($id);
        $user->est_active = !$user->est_active;
        $user->save();

        TraceLogger::log('toggle_user', ['id' => $id, 'est_active' => $user->est_active]);

        return back();
    }

    public function destroy(int $id)
    {
        $user = Utilisateur::findOrFail($id);
        abort_if($user->role === 'A', 403, 'Impossible de supprimer un administrateur.');

        $user->delete();

        TraceLogger::log('delete_user', ['user_id' => $id]);

        return back()->with('success', 'Utilisateur supprimé.');
    }
}
