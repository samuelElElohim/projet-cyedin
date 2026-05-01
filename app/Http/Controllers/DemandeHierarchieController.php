<?php

namespace App\Http\Controllers;

use App\Models\Administrateur;
use App\Models\DemandeHierarchie;
use App\Models\Filiere;
use App\Models\Notification;
use App\Models\Secteur;
use App\Models\Tag;
use App\Services\TraceLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DemandeHierarchieController extends Controller
{
    // ─── Page formulaire (partagée tous rôles) ────────────────────────────────

    public function index()
    {
        $filieres = Filiere::with(['secteurs' => fn($q) => $q->with('tags')->orderBy('secteur')])->orderBy('filiere')->get();
        $mes_demandes = DemandeHierarchie::where('auteur_id', auth()->id())
            ->with(['filiere', 'secteur', 'admin'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Shared/demande.hierarchie', [
            'filieres'     => $filieres,
            'mes_demandes' => $mes_demandes,
        ]);
    }

    // ─── Soumettre une demande (tous rôles S/T/E) ─────────────────────────────

    public function store(Request $request)
    {
        $request->validate([
            'type'          => 'required|in:secteur,tag',
            'nom'           => 'required|string|max:100',
            'filiere_id'    => 'required_if:type,secteur|nullable|integer|exists:filieres,id',
            'secteur_id'    => 'required_if:type,tag|nullable|integer|exists:secteurs,id',
            'justification' => 'nullable|string|max:1000',
        ]);

        $demande = DemandeHierarchie::create([
            'auteur_id'     => auth()->id(),
            'type'          => $request->type,
            'nom'           => trim($request->nom),
            'filiere_id'    => $request->filiere_id,
            'secteur_id'    => $request->secteur_id,
            'justification' => $request->justification,
            'statut'        => 'en_attente',
        ]);

        // Notifier tous les admins
        $typeLabel = $request->type === 'secteur' ? 'secteur' : 'tag';
        $auteurNom = auth()->user()->nom . ' ' . auth()->user()->prenom;
        $adminIds = Administrateur::pluck('utilisateurs_id');
        foreach ($adminIds as $adminId) {
            Notification::create([
                'proprietaire_id' => $adminId,
                'message'         => "Nouvelle demande de {$typeLabel} « {$demande->nom} » soumise par {$auteurNom}.",
            ]);
        }

        TraceLogger::log('demande_hierarchie.store', [
            'auteur_id' => auth()->id(),
            'type'      => $request->type,
            'nom'       => $demande->nom,
        ]);

        return back()->with('success', 'Demande envoyée. Un administrateur la traitera prochainement.');
    }

    // ─── Admin : liste des demandes ───────────────────────────────────────────

    public function admin_index(Request $request)
    {
        $query = DemandeHierarchie::with(['auteur', 'filiere', 'secteur', 'admin'])
            ->orderByRaw("CASE statut WHEN 'en_attente' THEN 0 ELSE 1 END")
            ->orderByDesc('created_at');

        if ($request->filled('statut') && $request->statut !== 'all') {
            $query->where('statut', $request->statut);
        }
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $demandes = $query->get();
        $filieres = Filiere::with(['secteurs' => fn($q) => $q->orderBy('secteur')])->orderBy('filiere')->get();

        return Inertia::render('Admin/admin.demandes', [
            'demandes' => $demandes,
            'filieres' => $filieres,
            'filters'  => $request->only(['statut', 'type']),
            'counts'   => [
                'en_attente' => DemandeHierarchie::where('statut', 'en_attente')->count(),
                'approuve'   => DemandeHierarchie::where('statut', 'approuve')->count(),
                'refuse'     => DemandeHierarchie::where('statut', 'refuse')->count(),
            ],
        ]);
    }

    // ─── Admin : approuver → crée l'élément en DB ────────────────────────────

    public function approuver(Request $request, int $id)
    {
        $request->validate([
            'commentaire_admin' => 'nullable|string|max:500',
            // Pour secteur : filiere_id confirmée (peut être changée par l'admin)
            'filiere_id'        => 'nullable|integer|exists:filieres,id',
            // Pour tag : secteur_id confirmé
            'secteur_id'        => 'nullable|integer|exists:secteurs,id',
        ]);

        $demande = DemandeHierarchie::findOrFail($id);
        abort_if($demande->statut !== 'en_attente', 422, 'Demande déjà traitée.');

        // Créer l'élément selon le type
        if ($demande->type === 'secteur') {
            $filiereId = $request->filiere_id ?? $demande->filiere_id;
            Secteur::create(['secteur' => $demande->nom, 'filiere_id' => $filiereId]);
        } else {
            $secteurId = $request->secteur_id ?? $demande->secteur_id;
            Tag::create(['tag' => $demande->nom, 'secteur_id' => $secteurId]);
        }

        $demande->update([
            'statut'            => 'approuve',
            'admin_id'          => auth()->id(),
            'commentaire_admin' => $request->commentaire_admin,
        ]);

        $typeLabel = $demande->type === 'secteur' ? 'secteur' : 'tag';
        Notification::create([
            'proprietaire_id' => $demande->auteur_id,
            'message'         => "Votre demande de {$typeLabel} « {$demande->nom} » a été approuvée et ajoutée à la hiérarchie.",
        ]);

        TraceLogger::log('demande_hierarchie.approuver', ['demande_id' => $id, 'nom' => $demande->nom]);

        return back()->with('success', "{$demande->nom} ajouté à la hiérarchie.");
    }

    // ─── Admin : refuser ──────────────────────────────────────────────────────

    public function refuser(Request $request, int $id)
    {
        $request->validate(['commentaire_admin' => 'nullable|string|max:500']);

        $demande = DemandeHierarchie::findOrFail($id);
        abort_if($demande->statut !== 'en_attente', 422, 'Demande déjà traitée.');

        $demande->update([
            'statut'            => 'refuse',
            'admin_id'          => auth()->id(),
            'commentaire_admin' => $request->commentaire_admin,
        ]);

        $typeLabel = $demande->type === 'secteur' ? 'secteur' : 'tag';
        Notification::create([
            'proprietaire_id' => $demande->auteur_id,
            'message'         => "Votre demande de {$typeLabel} « {$demande->nom} » a été refusée."
                . ($request->commentaire_admin ? " Raison : {$request->commentaire_admin}" : ''),
        ]);

        TraceLogger::log('demande_hierarchie.refuser', ['demande_id' => $id]);

        return back()->with('success', 'Demande refusée.');
    }
}
