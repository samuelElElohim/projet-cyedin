<?php

namespace App\Http\Controllers;

use App\Models\CahierStage;
use App\Models\Convention_stage;
use App\Models\Document;
use App\Models\Etudiant;
use App\Models\Notification;
use App\Models\Remarque;
use App\Models\Stage;
use App\Models\Utilisateur;
use App\Services\TraceLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TuteurDashboardController extends Controller
{
    // ─── Dashboard ───────────────────────────────────────────────────────────

    public function dashboard(): Response
    {
        $tuteur = auth()->user()->tuteur;
        abort_unless($tuteur, 403, 'Profil tuteur introuvable.');

        $stages = Stage::with([
            'etudiant.utilisateur',
            'entreprise',
            'convention',
        ])
            ->where('tuteurs_id', $tuteur->utilisateurs_id)
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($stage) {
                $conv = $stage->convention;
                $stage->convention_status = $conv ? [
                    'entreprise' => $conv->signer_par_entreprise,
                    'tuteur'     => $conv->signer_par_tuteur,
                    'etudiant'   => $conv->signer_par_etudiant,
                    'complete'   => $conv->signer_par_entreprise && $conv->signer_par_tuteur && $conv->signer_par_etudiant,
                ] : null;
                return $stage;
            });

        
        $etudiantsSuivis = $tuteur->etudiants()
        ->with('utilisateur')
        ->get()
        ->map(function ($e) {
            return [
                'id' => $e->utilisateurs_id,
                'nom' => $e->utilisateur->nom,
                'prenom' => $e->utilisateur->prenom,
                'email' => $e->utilisateur->email,
            ];
        });


        $notifications = Notification::where('proprietaire_id', auth()->id())
            ->where('est_lu', false)
            ->orderBy('date_envoi', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Tuteur/tuteur.dashboard', [
            'tuteur'        => $tuteur,
            'stages'        => $stages,
            'notifications' => $notifications,
            'etudiantsSuivis' => $etudiantsSuivis,
            'stats' => [
                'total_etudiants'       => $stages->count(),
                'conventions_completes' => $stages->filter(fn($s) => ($s->convention_status['complete'] ?? false))->count(),
                'conventions_pending'   => $stages->filter(fn($s) => $s->convention_status && !$s->convention_status['complete'])->count(),
            ],
        ]);
    }

    // ─── Signer la convention ────────────────────────────────────────────────

    public function signer_convention(int $stageId): RedirectResponse
    {
        $tuteur = auth()->user()->tuteur;
        abort_unless($tuteur, 403);

        $stage = Stage::where('id', $stageId)
            ->where('tuteurs_id', $tuteur->utilisateurs_id)
            ->firstOrFail();

        $convention = Convention_stage::firstOrCreate(
            ['stages_id' => $stage->id],
            [
                'signer_par_entreprise' => false,
                'signer_par_tuteur'     => false,
                'signer_par_etudiant'   => false,
            ]
        );

        $convention->signer_par_tuteur = true;
        $convention->save();

        // Notifier l'étudiant
        Notification::create([
            'proprietaire_id' => $stage->etudiants_id,
            'message'         => 'Votre tuteur a signé la convention de stage.',
        ]);

        TraceLogger::log('signer_convention_tuteur', [
            'tuteur_id' => $tuteur->utilisateurs_id,
            'stage_id'  => $stageId,
        ]);

        return back()->with('success', 'Convention signée.');
    }

    // ─── Cahier de stage d'un étudiant ───────────────────────────────────────

    public function cahier(int $etudiantId): Response
    {
        $tuteur = auth()->user()->tuteur;
        abort_unless($tuteur, 403);

        // Vérifier que cet étudiant est bien assigné à ce tuteur
        $stage = Stage::where('tuteurs_id', $tuteur->utilisateurs_id)
            ->where('etudiants_id', $etudiantId)
            ->with('etudiant.utilisateur', 'entreprise')
            ->firstOrFail();

        $entrees = CahierStage::where('etudiant_id', $etudiantId)
            ->where('visible_tuteur', true)
            ->orderBy('date_entree', 'desc')
            ->get();

        return Inertia::render('Tuteur/tuteur.cahier', [
            'stage'   => $stage,
            'entrees' => $entrees,
        ]);
    }

    // ─── Documents d'un étudiant ─────────────────────────────────────────────

    public function documents(int $etudiantId): Response
    {
        $tuteur = auth()->user()->tuteur;
        abort_unless($tuteur, 403);

        $stage = Stage::where('tuteurs_id', $tuteur->utilisateurs_id)
            ->where('etudiants_id', $etudiantId)
            ->with('etudiant.utilisateur', 'entreprise')
            ->firstOrFail();

        $documents = Document::where('utilisateurs_id', $etudiantId)
            ->orderBy('date_depot', 'desc')
            ->get();

        $remarques = Remarque::where('cible_type', 'stage')
            ->where('cible_id', $stage->id)
            ->with('auteur')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Tuteur/tuteur.etudiant', [
            'stage'     => $stage,
            'documents' => $documents,
            'remarques' => $remarques,
        ]);
    }

    // ─── Créer un stage ──────────────────────────────────────────────────────

    public function create_stage(): Response
    {
        $tuteur = auth()->user()->tuteur;
        abort_unless($tuteur, 403);

        // Étudiants sans stage
        $etudiants = Etudiant::with('utilisateur')
            ->whereDoesntHave('stages')
            ->get();

        $entreprises = \App\Models\Entreprise::where(
            'utilisateurs_id',
            \App\Models\Utilisateur::where('role', 'E')->where('est_active', true)->pluck('id')
        )->get();

        return Inertia::render('Tuteur/tuteur.create.stage', [
            'etudiants'   => $etudiants,
            'entreprises' => $entreprises,
        ]);
    }

    public function store_stage(Request $request): RedirectResponse
    {
        $tuteur = auth()->user()->tuteur;
        abort_unless($tuteur, 403);

        $validated = $request->validate([
            'sujet'          => 'required|string|max:255',
            'etudiants_id'   => 'required|integer|exists:etudiants,utilisateurs_id',
            'entreprises_id' => 'required|integer|exists:entreprises,id',
            'duree_en_semaine' => 'required|integer|min:1|max:52',
            'dateDebut'      => 'required|date',
        ]);

        $stage = Stage::create([
            ...$validated,
            'tuteurs_id' => $tuteur->utilisateurs_id,
        ]);

        // Créer la convention associée
        Convention_stage::create([
            'stages_id'             => $stage->id,
            'signer_par_entreprise' => false,
            'signer_par_tuteur'     => false,
            'signer_par_etudiant'   => false,
        ]);

        // Notifier l'étudiant
        Notification::create([
            'proprietaire_id' => $validated['etudiants_id'],
            'message'         => "Un stage a été créé pour vous : « {$validated['sujet']} ». La convention est en attente de signature.",
        ]);

        TraceLogger::log('store_stage', [
            'tuteur_id'  => $tuteur->utilisateurs_id,
            'stage_id'   => $stage->id,
            'etudiant'   => $validated['etudiants_id'],
        ]);

        return redirect()->route('tuteur.dashboard')->with('success', 'Stage créé avec succès.');
    }

    // ─── Remarques ───────────────────────────────────────────────────────────

    public function store_remarque(Request $request): RedirectResponse
    {
        $tuteur = auth()->user()->tuteur;
        abort_unless($tuteur, 403);

        $request->validate([
            'cible_type'           => 'required|in:stage,dossier_stage',
            'cible_id'             => 'required|integer',
            'contenu'              => 'required|string|max:2000',
            'visible_etudiant'     => 'boolean',
        ]);

        Remarque::create([
            'auteur_id'              => auth()->id(),
            'cible_type'             => $request->cible_type,
            'cible_id'               => $request->cible_id,
            'contenu'                => $request->contenu,
            'est_visible_etudiant'   => $request->boolean('visible_etudiant', true),
            'est_visible_entreprise' => false,
        ]);

        return back()->with('success', 'Remarque ajoutée.');
    }

    public function etudiants(): Response
{
    $tuteur = auth()->user()->tuteur;

    // Tous les étudiants — filtrables par filière si besoin
    $etudiants = Etudiant::with(['utilisateur', 'filiere'])
        ->get()
        ->map(fn ($e) => [
            'id'      => $e->utilisateurs_id,
            'nom'     => $e->utilisateur->nom,
            'prenom'  => $e->utilisateur->prenom,
            'email'   => $e->utilisateur->email,
            'filiere' => $e->filiere?->filiere,
            'niveau'  => $e->niveau_etud,
            'suivi'   => $tuteur->etudiants->contains('utilisateurs_id', $e->utilisateurs_id),
        ]);

    return Inertia::render('Tuteur/tuteur.etudiant.follow', [
        'etudiants' => $etudiants,
    ]);
}

    public function suivre(Etudiant $etudiant): RedirectResponse
    {
        $tuteur = auth()->user()->tuteur;
        $tuteur->etudiants()->syncWithoutDetaching([$etudiant->utilisateurs_id]);

        return back()->with('success', 'Étudiant ajouté à votre suivi.');
    }

    public function retirer(Etudiant $etudiant): RedirectResponse
    {
        $tuteur = auth()->user()->tuteur;
        $tuteur->etudiants()->detach($etudiant->utilisateurs_id);

        return back()->with('success', 'Étudiant retiré de votre suivi.');
    }

    public function offres(Request $request): Response
    {
        $query = \App\Models\Offre::with(['entreprise', 'secteur.filiere', 'tags'])
            ->withCount('candidatures')
            ->where('est_active', true);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('titre', 'ilike', '%' . $request->search . '%')
                  ->orWhere('description', 'ilike', '%' . $request->search . '%');
            });
        }
        if ($request->filled('duree_min')) {
            $query->where('duree_semaines', '>=', $request->duree_min);
        }
        if ($request->filled('duree_max')) {
            $query->where('duree_semaines', '<=', $request->duree_max);
        }
        if ($request->filled('secteur_id')) {
            $query->where('secteur_id', $request->secteur_id);
        }
        if ($request->filled('filiere_id')) {
            $query->where('filiere_id', $request->filiere_id);
        }

        $offres = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Tuteur/tuteur.offres', [
            'offres'   => $offres,
            'secteurs' => \App\Models\Secteur::with('filiere')->orderBy('secteur')->get(),
            'filieres' => \App\Models\Filiere::orderBy('filiere')->get(),
            'filters'  => $request->only(['search', 'duree_min', 'duree_max', 'secteur_id', 'filiere_id']),
        ]);
    }
}