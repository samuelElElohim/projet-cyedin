<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Entreprise;
use App\Models\Offre;
use App\Services\TraceLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminOffreController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Entreprise::with(['offres' => function ($q) use ($request) {
            if ($request->filled('duree_max')) {
                $q->where('duree_semaines', '<=', $request->duree_max);
            }
            if ($request->filled('duree_min')) {
                $q->where('duree_semaines', '>=', $request->duree_min);
            }
            if ($request->filled('search')) {
                $q->where(fn($sq) =>
                    $sq->where('titre', 'ilike', '%' . $request->search . '%')
                       ->orWhere('description', 'ilike', '%' . $request->search . '%')
                );
            }
            if ($request->filled('statut') && $request->statut !== 'all') {
                $q->where('est_active', $request->statut === 'active');
            }
        }])->orderBy('id', 'asc');

        return Inertia::render('Admin/admin.index.offre', [
            'entreprises' => $query->get(),
            'filters'     => $request->only(['search', 'duree_min', 'duree_max', 'statut']),
        ]);
    }

    public function toggle(int $id)
    {
        $offre = Offre::findOrFail($id);
        $offre->est_active = !$offre->est_active;
        $offre->save();

        TraceLogger::log('toggle_offre', ['id' => $id, 'est_active' => $offre->est_active]);

        return back();
    }
}
