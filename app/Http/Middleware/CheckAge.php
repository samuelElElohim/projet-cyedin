<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAge
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Regarde si le "count" (qu'on a setup dans Home.jsx et passé dans l'url ...?count=...) est supérieur à 18
        if($request->count < 18) {
            return redirect("/");
        }

        // Si Oui : on continue la requête ie. passer à la page /oeoeoe?count=...
        return $next($request);
    }
}
