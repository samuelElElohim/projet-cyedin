<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Entreprise;
use App\Models\Notification;
use App\Models\Utilisateur;
use App\Services\TraceLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminEntrepriseController extends Controller
{
    public function index(): Response
    {
        $entreprises = Entreprise::with('utilisateur')->orderBy('utilisateurs_id')->get();

        return Inertia::render('Admin/admin.index.entreprise', [
            'entreprise' => $entreprises,
            'count'      => $entreprises->count(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/admin.create.entreprise');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_entreprise'  => 'required|string|max:255',
            'addresse'        => 'required|string|max:255',
            'secteur'         => 'required|string|max:255',
            'utilisateurs_id' => 'required|integer',
        ]);

        Entreprise::create($validated);

        TraceLogger::log('store_entreprise', ['nom' => $validated['nom_entreprise']]);

        return redirect()->route('admin.index.entreprise')->with('success', 'Entreprise ajoutée !');
    }

    public function validate(Request $request, int $id)
    {
        $user = Utilisateur::findOrFail($id);
        $user->est_active = true;
        $user->save();

        Notification::create([
            'proprietaire_id' => $user->id,
            'message'         => 'Votre compte entreprise a été validé. Vous pouvez maintenant vous connecter.',
        ]);

        TraceLogger::log('validate_entreprise', ['id' => $id, 'email' => $user->email]);

        return back()->with('success', 'Entreprise validée avec succès.');
    }
}
