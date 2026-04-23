<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        //dd($request);
        $request->validate([
            'nom'          => 'required|string|max:25',
            'prenom'       => 'required|string|max:15',
            'email'        => 'required|string|lowercase|email|max:42|unique:App\Models\Utilisateur,email',
            'mot_de_passe' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = Utilisateur::create([
            'nom'          => $request->nom,
            'prenom'       => $request->prenom,
            'email'        => $request->email,
            'mot_de_passe' => Hash::make($request->mot_de_passe),
            'role'         => 'S', // étudiant par défaut
            'est_active'   => false,
            'premier_mdp_changer' => false,
        ]);

        //event(new NouveauUtilisateurEnvoyerNotifTaCapteMonGate($user));

        return redirect()->route('AttenteActivation');
    }
}
