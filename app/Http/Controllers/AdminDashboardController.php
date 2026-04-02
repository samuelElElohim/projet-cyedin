<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\User;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index_user() {
        
        $users = Utilisateur::orderBy('id', 'asc')->get();
        $count = Utilisateur::count();
        return Inertia::render( "admin.index.user", ["users"=> $users, "count" => $count ]);

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

    public function store_user(Request $request) {
        //Validate data :
        $validated = $request->validate([
            "nom"=> 'required|string|max:255',
            "prenom" => 'required|string|max:255',
            "email" => 'required|string|max:255',
            "role" => 'required|integer|min:1'
        ]);

        $validated['mot_de_passe'] = "null";
        $validated['date_creation'] = "0000_00_00_000000";

        Utilisateur::create($validated);
        return redirect()->route('admin.index.user')
                         ->with('success', 'Utilisateur ajouté !');
    }

}
