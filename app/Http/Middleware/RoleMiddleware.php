<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Events\Login;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if(!(auth()->check())){
            return redirect()->route('login');
        }

        $userRole = auth()->user()->role;

        // Compte doit être activé
        if (!auth()->user()->est_active) {
            return redirect()->route('AttenteActivation');
        }

        // Compte doit être le bon rôle
        if(!in_array($userRole, $roles)){
            abort(403, "Vous n'avez pas la permission d'accéder à cette page");
        }

        return $next($request);
    }
}
