<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     * Étape 1 sur 2 : vérifie email+mot de passe, puis envoie l'OTP.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // Valide les credentials SANS connecter l'utilisateur
        $utilisateur = \App\Models\Utilisateur::where('email', $request->email)->first();

        if (
            ! $utilisateur ||
            ! \Illuminate\Support\Facades\Hash::check($request->mot_de_passe, $utilisateur->mot_de_passe)
        ) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        if (! $utilisateur->est_active) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => 'Votre compte n\'est pas encore activé.',
            ]);
        }

        // Envoie l'OTP et redirige vers l'étape 2
        TwoFactorController::sendOtp($request, $utilisateur, $request->boolean('remember'));

        return redirect()->route('2fa.create');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
