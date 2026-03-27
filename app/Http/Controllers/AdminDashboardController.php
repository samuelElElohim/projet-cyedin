<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\User;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index_user() {
        
        $users = Utilisateur::all();

        return Inertia::render( "admin.index.user", ["users"=> $users ]);

    }

    public function create_user(){
        return Inertia::render("admin.create.user");
    }

    public function store_user(Request $request) {
        //Validate data :
        $validated = request()->validate([
            "nom"=> 'required|string|max:255',
            "prenom" => 'required|string|max:255',
            "email" => 'required|string|max:255',
            "role" => 'required|integer|min:1'
        ]);

        Utilisateur::create($validated);
        return redirect()->route('admin.index.user')
                         ->with('success', 'Utilisateur ajouté !');
    }

}
