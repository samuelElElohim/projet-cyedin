<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dossier_stage;
use App\Services\TraceLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDossierController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Dossier_stage::with([
            'etudiant.utilisateur',
            'etudiant.filiere',
            'etudiant.stages' => fn($q) => $q->with('convention')->latest('id'),
            'documents',
        ])->orderBy('created_at', 'desc');

        if ($request->filled('statut')) {
            $query->where('est_valide', $request->statut === 'valide');
        }

        if ($request->filled('search')) {
            $query->whereHas('etudiant.utilisateur', fn($q) =>
                $q->where('nom', 'ilike', '%' . $request->search . '%')
                  ->orWhere('email', 'ilike', '%' . $request->search . '%')
            );
        }

        $dossiers = $query->get();

        return Inertia::render('Admin/admin.index.dossier', [
            'dossiers' => $dossiers,
            'count'    => $dossiers->count(),
            'filters'  => $request->only(['search', 'statut']),
        ]);
    }

    public function toggle(int $id)
    {
        $dossier = Dossier_stage::findOrFail($id);
        $dossier->est_valide = !$dossier->est_valide;
        $dossier->save();

        TraceLogger::log('toggle_dossier', ['id' => $id, 'est_valide' => $dossier->est_valide]);

        return back();
    }
}
