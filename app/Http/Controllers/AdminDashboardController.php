<?php

namespace App\Http\Controllers;

use App\Models\Administrateur;
use App\Models\Dossier_stage;
use App\Models\Entreprise;
use App\Models\Etudiant;
use App\Models\Notification;
use App\Models\Offre;
use App\Models\Stage;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function dashboard(): Response
    {
        return Inertia::render('Admin/admin.main', [
            'stats' => [
                'utilisateurs'        => Utilisateur::count(),
                'etudiants'           => Etudiant::count(),
                'entreprises'         => Entreprise::count(),
                'offres_actives'      => Offre::where('est_active', true)->count(),
                'offres_pending'      => Offre::where('est_active', false)->count(),
                'entreprises_pending' => Utilisateur::where('role', 'E')->where('est_active', false)->count(),
                'stages_en_cours'     => Stage::count(),
                'dossiers_pending'    => Dossier_stage::where('est_valide', false)->count(),
                'demandes_pending'    => \App\Models\DemandeHierarchie::where('statut', 'en_attente')->count(),
            ],
            'notifications' => Notification::where('proprietaire_id', auth()->id())
                ->where('est_lu', false)
                ->latest('date_envoi')
                ->take(10)
                ->get(),
            'entreprises_pending' => Utilisateur::where('role', 'E')
                ->where('est_active', false)
                ->with('entreprise')
                ->get(),
        ]);
    }
}
