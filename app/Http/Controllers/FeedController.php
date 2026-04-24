<?php

namespace App\Http\Controllers;

use App\Models\Offre;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedController extends Controller
{
    public function index_feed(){
        $offres = Offre::with('entreprise')->orderBy('created_at', 'desc')->where('est_active', true)->get();
        return Inertia::render('etu.main.feed', ['offres' => $offres]);
    }
}
