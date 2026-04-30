<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class PremierMotDePasseController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/PremierMotDePasse');
    }

    public function store(Request $request): RedirectResponse
{
    $request->validate([
        'mot_de_passe'              => ['required', 'confirmed', Password::min(8)],
        'mot_de_passe_confirmation' => ['required'],
    ]);

    $user = Auth::user();
    $user->mot_de_passe        = Hash::make($request->mot_de_passe);
    $user->premier_mdp_changer = true;
    $user->save();

    return match($user->role) {
        'A' => redirect()->route('admin.dashboard'),
        'T' => redirect()->route('tuteur.dashboard'),
        'E' => redirect()->route('entreprise.dashboard'),
        'J' => redirect()->route('jury.dashboard'),
        'S' => redirect()->route('etudiant.dashboard'),
        default => redirect()->route('dashboard'),
    };
}
}