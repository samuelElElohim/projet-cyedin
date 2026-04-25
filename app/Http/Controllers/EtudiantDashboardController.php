<?php

namespace App\Http\Controllers;

use App\Models\DemandeFormation;
use App\Models\Etudiant;
use App\Models\Notification;
use App\Models\Administrateur;
use App\Services\TraceLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EtudiantDashboardController extends Controller
{
    public function index_demande_formation()
    {
        $etudiantId = auth()->id();

        $demandes = DemandeFormation::where('etudiant_id', $etudiantId)
            ->orderBy('created_at', 'desc')
            ->get();

        $filieres = Etudiant::select('filiere')
            ->distinct()
            ->pluck('filiere')
            ->sort()
            ->values();

        return Inertia::render('Etudiant/etudiant.demande.formation', [
            'demandes' => $demandes,
            'filieres' => $filieres,
        ]);
    }

    public function store_demande_formation(Request $request)
    {
        $request->validate([
            'formation_demandee' => 'required|string|max:100',
            'justification'      => 'nullable|string|max:1000',
        ]);

        $demande = DemandeFormation::create([
            'etudiant_id'        => auth()->id(),
            'formation_demandee' => $request->formation_demandee,
            'justification'      => $request->justification,
        ]);

        // Notifier tous les admins
        $adminIds = Administrateur::pluck('utilisateurs_id');
        foreach ($adminIds as $adminId) {
            Notification::create([
                'proprietaire_id' => $adminId,
                'message'         => "Nouvelle demande de filière « {$request->formation_demandee} » de la part de " . auth()->user()->nom . '.',
            ]);
        }

        TraceLogger::log('store_demande_formation', [
            'etudiant_id' => auth()->id(),
            'formation'   => $request->formation_demandee,
        ]);

        return back()->with('success', 'Demande envoyée.');
    }
}
