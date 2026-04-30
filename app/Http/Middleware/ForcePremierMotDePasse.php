<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Redirige les utilisateurs dont premier_mdp_changer = false
 * vers la page de changement de mot de passe.
 *
 * PATCH : exclusion des routes de vérification email pour éviter
 * une boucle de redirection avec le middleware 'verified'.
 */
class ForcePremierMotDePasse
{
    public function handle(Request $request, Closure $next): \Symfony\Component\HttpFoundation\Response
{
    if (
        Auth::check() &&
        !Auth::user()->premier_mdp_changer &&
        !$request->routeIs('password.premier*') &&
        //!$request->routeIs('verification.*') &&
        !$request->routeIs('logout')
    ) {
        return redirect()->route('password.premier');
    }

    return $next($request);
}
}