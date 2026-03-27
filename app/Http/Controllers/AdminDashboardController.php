<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Foundation\Auth\User;
use Inertia\Inertia;

abstract class AdminDashboardController extends Controller
{
    public function index_user() {
        
        $users = Utilisateur::all();

        return Inertia::render( "admin.index.user", ["users"=> $users ]);

    }
}
