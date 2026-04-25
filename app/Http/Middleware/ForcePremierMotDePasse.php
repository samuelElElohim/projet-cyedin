<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Redirige les utilisateurs dont premier_mdp_changer = false
 * vers la page de changement de mot de passe.
 * S'applique après le middleware 'auth'.
 */
class ForcePremierMotDePasse
{
    public function handle(Request $request, Closure $next): Response
    {
        if (
            Auth::check() &&
            !Auth::user()->premier_mdp_changer &&
            !$request->routeIs('password.premier') &&
            !$request->routeIs('logout')
        ) {
            return redirect()->route('password.premier');
        }

        return $next($request);
    }
}