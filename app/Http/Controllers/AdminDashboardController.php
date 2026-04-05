<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use App\Models\Utilisateur;

use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index_user() {
        
        $users = Utilisateur::orderBy('id', 'asc')->get();
        $count = Utilisateur::count();
        return Inertia::render( "admin.index.user", ["users"=> $users, "count" => $count ]);

    }

    public function index_entreprise(){
        $entreprise = Entreprise::orderBy('utilisateurs_id', 'asc')->get();
        $count = Utilisateur::count();
        return Inertia::render("admin.index.entreprise", ["entreprise"=> $entreprise, "count"=> $count]);
    }
    
    public function edit_user(Request $request){
        //Validate data :
        $validated = $request->validate([
            "nom"=> 'required|string|max:255',
            "prenom" => 'required|string|max:255',
            "email" => 'required|string|max:255',
            "role" => 'required|integer|min:1'
        ]);

        $user = Utilisateur::find($request->id);
        $user->update($validated);
        return redirect()->route('admin.index.user'); // renvoie vers la page
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
        //Validate data :
        $validated = $request->validate([
            "nom"=> 'required|string|max:255',
            "prenom" => 'required|string|max:255',
            "email" => 'required|string|max:255',
            "role" => 'required|integer|min:1'
        ]);


        $temporaryPassword = Str::password(7); 
        $validated['mot_de_passe'] = Hash::make($temporaryPassword); // Cree un mdp temporaire, jsp s'il faut demander de le changer a la premiere connexion ou pas.
        // j'ai mis premier_mdp_changer pour savoir si ce dernier a ete change ou non.


        $validated['date_creation'] = now();
        $validated['premier_mdp_changer'] = false; // par default false.

        $validated['est_active'] = false; // par default false, peut etre qu'il faut activer le compte par un prompte en premier? sinon changer le default a true
        //devient true des la premiere connexion? ou bien des sa creation? a voir


        // il faut aussi notifer l'utilisateur de son compte et de son mdp temporaire, peut etre par email en utilisant une notif?
        Utilisateur::create($validated);
        return redirect()->route('admin.index.user')
                         ->with('success', 'Utilisateur ajouté !');
    }

}
