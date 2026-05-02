<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Entreprise;
use App\Models\Notification;
use App\Models\Utilisateur;
use App\Models\Administrateur;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class InscriptionEntrepriseController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/RegisterEntreprise');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nom_entreprise' => 'required|string|max:25',
            'email'          => 'required|string|lowercase|email|max:42|unique:utilisateurs,email',
            'mot_de_passe'   => ['required', 'confirmed', Password::min(8)],
            'addresse'       => 'required|string|max:255',
            'secteur'        => 'required|string|max:100',
        ]);

        // Compte créé INACTIF — l'admin doit valider
        $utilisateur = Utilisateur::create([
            'nom'                  => $request->nom_entreprise,
            'prenom'               => null,
            'email'                => $request->email,
            'mot_de_passe'         => $request->mot_de_passe,
            'role'                 => 'E',
            'est_active'           => false,  // ← en attente validation
            'premier_mdp_changer'  => true,   // l'entreprise choisit son propre mdp
        ]);

        Entreprise::create([
            'utilisateur_id' => $utilisateur->id,
            'nom_entreprise'  => $request->nom_entreprise,
            'addresse'        => $request->addresse,
            'secteur'         => $request->secteur,
        ]);

        // Notifier tous les admins
        $adminIds = Administrateur::pluck('utilisateurs_id');
        foreach ($adminIds as $adminId) {
            Notification::create([
                'proprietaire_id' => $adminId,
                'message'         => "Nouvelle demande d'inscription entreprise : {$request->nom_entreprise} ({$request->email}). En attente de validation.",
            ]);
        }

        return redirect()->route('login')
            ->with('status', 'Votre demande d\'inscription a été soumise. Un administrateur validera votre compte sous peu.');
    }
}