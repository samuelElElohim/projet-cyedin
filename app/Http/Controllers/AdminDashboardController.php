<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use App\Models\Utilisateur;
use App\Models\Administrateur;
use App\Models\Jury;
use App\Models\Tuteur;
use App\Models\Etudiant;


use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;


use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index_user() {
        
        //J'ai crée un Trait (une fonction qui peut s'appliquer à plusieurs Models) et je l'applique
        // à chaque table pertinente pour récupérer toutes les infos à chaque fois (redondant mais pour l'instant le mieux que je
        // puisse faire...)

        // Piste d'amélioration : vérifier ICI ce qu'on demande et utiliser les boutons pour re-appeler index_user() et donc
        // ne donner qu'à chaque fois qu'une table


        $users = Utilisateur::orderBy('id', 'asc')->get();
        //$admins = Administrateur::orderBy('utilisateurs_id')->get();
        $admins = Administrateur::with("utilisateur")->orderBy('utilisateurs_id')->get();
        //$students = Etudiant::orderBy('id')->get();
        $students = Etudiant::with("utilisateur")->orderBy('id')->get();
        $tutors =  Tuteur::with("utilisateur")->orderBy('utilisateurs_id')->get();
        //$tutors =  Tuteur::orderBy('utilisateurs_id')->get();
        //$entreprises = Entreprise::orderBy('utilisateurs_id')->get();
        $entreprises = Entreprise::with('utilisateur')->orderBy('utilisateurs_id')->get();

        $count = Utilisateur::count();


        return Inertia::render( "admin.index.user", ["users"=> $users, "admins"=> $admins, "students" => $students, "tutors"=> $tutors, "entreprises"=>$entreprises, "count" => $count ]);

    }

    public function index_entreprise(){
        $entreprise = Entreprise::orderBy('utilisateurs_id', 'asc')->get();
        $count = Utilisateur::count();
        return Inertia::render("admin.index.entreprise", ["entreprise"=> $entreprise, "count"=> $count]);
    }
    
    public function edit_user(Request $request, $id) {
    // Toujours mettre à jour utilisateurs
    Utilisateur::where('id', $id)->update(
        $request->only(['nom', 'prenom', 'email', 'role'])
    );

    // Mettre à jour la table spécifique selon le role
    match($request->role) {
        'entreprise' => Entreprise::where('utilisateurs_id', $id)->update(
            $request->only(['addresse', 'secteur'])
        ),
        'tuteur' => Tuteur::where('utilisateurs_id', $id)->update(
            $request->only(['secteur'])
        ),
        'etudiant' => Etudiant::where('utilisateurs_id', $id)->update(
            $request->only(['filiere', 'niveau_etud'])
        ),
        default => null,
    };
}

    public function create_user(){
        return Inertia::render("admin.create.user");
    }

    public function create_entreprise(){
        return Inertia::render("admin.create.entreprise");
    }

   public function store_entreprise(Request $request){
    try {
        $validated = $request->validate([
            "nom_entreprise" => 'required|string|max:255',
            "addresse"       => 'required|string|max:255',
            "secteur"        => 'required|string|max:255',
            "utilisateurs_id"=> 'required|integer',
        ]);

        Entreprise::create($validated);
        return redirect()->route('admin.index.entreprise')
                         ->with('success', 'Entreprise ajoutée !');
    } catch (\Exception $e) {
        dd($e->getMessage()); // ← affiche l'erreur exacte
    }
}

    public function store_user(Request $request) {
        //dd($request->all());
        $validated = $request->validate([
            "nom"          => 'required|string|max:25',
            "prenom"       => 'nullable|string|max:15',
            "email"        => 'required|string|max:42|unique:utilisateurs',
            "role"         => 'required|string|in:A,T,E,S',
            "psw"          => 'nullable|string',  // ← ajoute ça
            // Etudiant
            "filiere"      => 'required_if:role,S|nullable|string|max:10',
            "niveau_etud"  => 'required_if:role,S|nullable|integer|min:1',
            // Entreprise
            "addresse"     => 'required_if:role,E|nullable|string',
            "secteur"      => 'required_if:role,E|nullable|string',
            // Tuteur
            "departement"  => 'required_if:role,T|nullable|string',
            "est_jury"     => 'nullable|boolean',
        ]);

        // Création utilisateur de base
        $temporaryPassword = Str::password(7);
        $utilisateur = Utilisateur::create([
            'nom'                 => $validated['nom'],
            'prenom'              => $validated['prenom'] ?? null,
            'email'               => $validated['email'],
            'role'                => $validated['role'],
            'mot_de_passe'        => Hash::make($temporaryPassword),
            'est_active'          => false,
            'premier_mdp_changer' => false,
        ]);

        // Création table dérivée selon le rôle
        match($validated['role']) {
            'A' => Administrateur::create([
                        'utilisateurs_id'     => $utilisateur->id,
                        //'derniere_action_log' => now(),
                ]),
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
            'T' => (function() use ($utilisateur, $validated){
                Tuteur::create([
                    'utilisateurs_id'  => $utilisateur->id,
                    'departement'      => $validated['departement'],
                    //  'date_affectation' => now(),
                ]);
                /*
                if (!empty($validated['est_jury'])) {
                    Jury::create([
                        'utilisateur_id' => $utilisateur->id,
                        'departement'    => $validated['departement'],
                    ]);
                }*/
                // AJOUTER LES JURYS SI EST_JURY
            })(),
            
            default => null
        };

        return redirect()->route('admin.index.user')
                       ->with('success', 'Utilisateur ajouté !');
}

}
