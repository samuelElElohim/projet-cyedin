<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Administrateur;
use App\Models\Dossier_stage;
use App\Models\Notification;
use App\Models\Stage;
use App\Services\TraceLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminTraceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/admin.trace', [
            'trace' => TraceLogger::tail(300),
        ]);
    }

    public function export(): StreamedResponse
    {
        $path = storage_path('logs/trace.log');

        return response()->streamDownload(function () use ($path) {
            if (file_exists($path)) {
                readfile($path);
            }
        }, 'trace-' . now()->format('Y-m-d') . '.log', ['Content-Type' => 'text/plain']);
    }

    public function archiver(Request $request)
    {
        $annee    = $request->input('annee', now()->year);
        $snapshot = [
            'annee'    => $annee,
            'date'     => now()->toIso8601String(),
            'stages'   => Stage::with(['etudiant.utilisateur', 'entreprise', 'tuteur.utilisateur'])->get()->toArray(),
            'dossiers' => Dossier_stage::with('etudiant.utilisateur')->get()->toArray(),
        ];

        $filename = "archive-{$annee}-" . now()->format('Ymd-His') . '.json';
        Storage::disk('local')->put("archives/{$filename}", json_encode($snapshot, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        TraceLogger::log('archiver_annee', ['annee' => $annee, 'fichier' => $filename]);

        Notification::create([
            'proprietaire_id' => auth()->id(),
            'message'         => "Archivage de l'année {$annee} effectué → {$filename}",
        ]);

        return back()->with('success', "Archive {$annee} créée : {$filename}");
    }

    public function listerArchives(): Response
    {
        $files = collect(Storage::disk('local')->files('archives'))
            ->map(fn($f) => [
                'nom'  => basename($f),
                'date' => Storage::disk('local')->lastModified($f),
                'size' => Storage::disk('local')->size($f),
            ])
            ->sortByDesc('date')
            ->values();

        return Inertia::render('Admin/admin.archives', [
            'archives' => $files,
        ]);
    }

    public function telechargerArchive(Request $request): StreamedResponse
    {
        $filename = $request->query('fichier');
        $path     = "archives/{$filename}";
        abort_unless(Storage::disk('local')->exists($path), 404);

        return Storage::disk('local')->download($path);
    }

    public function resetAnnee(Request $request)
    {
        $annee    = $request->input('annee', now()->year);
        $snapshot = [
            'annee'    => (int) $annee,
            'date'     => now()->toIso8601String(),
            'type'     => 'reset_annuel',
            'stages'   => Stage::with(['etudiant.utilisateur', 'entreprise', 'tuteur.utilisateur', 'convention'])->get()->toArray(),
            'dossiers' => Dossier_stage::with(['etudiant.utilisateur', 'documents'])->get()->toArray(),
        ];

        $filename = "archive-reset-{$annee}-" . now()->format('Ymd-His') . '.json';
        Storage::disk('local')->put("archives/{$filename}", json_encode($snapshot, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        DB::table('dossier_documents')->delete();
        DB::table('convention_stages')->delete();
        DB::table('cahier_stages')->delete();
        DB::table('candidatures')->delete();
        DB::table('dossier_stages')->delete();
        DB::table('stages')->delete();
        DB::table('notifications')->where('est_lu', true)->delete();
        DB::table('offres')->update(['est_active' => false]);

        $adminIds = Administrateur::pluck('utilisateurs_id');
        foreach ($adminIds as $adminId) {
            Notification::create([
                'proprietaire_id' => $adminId,
                'message'         => "✅ Réinitialisation annuelle {$annee} effectuée. Archive : {$filename}.",
            ]);
        }

        TraceLogger::log('reset_annee', ['annee' => $annee, 'fichier' => $filename, 'admin_id' => auth()->id()]);

        return back()->with('success', "Réinitialisation {$annee} effectuée. Archive : {$filename}");
    }
}
