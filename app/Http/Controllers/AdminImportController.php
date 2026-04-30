<?php

namespace App\Http\Controllers;

use App\Models\Administrateur;
use App\Models\Entreprise;
use App\Models\Etudiant;
use App\Models\Tuteur;
use App\Models\Utilisateur;
use App\Services\TraceLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminImportController extends Controller
{
    // Colonnes attendues dans le fichier
    private const COLONNES = ['nom', 'prenom', 'email', 'role', 'filiere', 'niveau_etud', 'addresse', 'secteur', 'departement'];

    public function create(): Response
    {
        return Inertia::render('Admin/admin.import.user');
    }

    /**
     * Parse le fichier CSV ou XLSX uploadé et retourne une preview.
     * Ne crée rien en base — juste validation + aperçu.
     */
    public function preview(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'fichier' => 'required|file|mimes:csv,txt,xlsx,xls|max:5120',
        ]);

        $rows = $this->parseFile($request->file('fichier'));

        $resultats = [];
        foreach ($rows as $i => $row) {
            $ligne = $i + 2; // ligne 1 = header
            $erreurs = $this->validerLigne($row, $ligne);
            $resultats[] = [
                'ligne'   => $ligne,
                'data'    => $row,
                'erreurs' => $erreurs,
                'valide'  => empty($erreurs),
            ];
        }

        $valides  = count(array_filter($resultats, fn($r) => $r['valide']));
        $invalides = count($resultats) - $valides;

        return response()->json([
            'resultats' => $resultats,
            'total'     => count($resultats),
            'valides'   => $valides,
            'invalides' => $invalides,
        ]);
    }

    /**
     * Importe les utilisateurs valides du fichier.
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'fichier' => 'required|file|mimes:csv,txt,xlsx,xls|max:5120',
        ]);

        $rows = $this->parseFile($request->file('fichier'));

        $crees   = [];
        $erreurs = [];

        foreach ($rows as $i => $row) {
            $ligne = $i + 2;
            $errs  = $this->validerLigne($row, $ligne);

            if (!empty($errs)) {
                $erreurs[] = ['ligne' => $ligne, 'email' => $row['email'] ?? '?', 'messages' => $errs];
                continue;
            }

            try {
                $user = Utilisateur::create([
                    'nom'                 => trim($row['nom']),
                    'prenom'              => trim($row['prenom'] ?? '') ?: null,
                    'email'               => strtolower(trim($row['email'])),
                    'mot_de_passe'        => Hash::make('password'),
                    'role'                => strtoupper(trim($row['role'])),
                    'est_active'          => true,
                    'premier_mdp_changer' => false,
                ]);

                $this->creerProfil($user, $row);

                $crees[] = ['ligne' => $ligne, 'email' => $user->email, 'role' => $user->role];
            } catch (\Throwable $e) {
                $erreurs[] = ['ligne' => $ligne, 'email' => $row['email'] ?? '?', 'messages' => [$e->getMessage()]];
            }
        }

        TraceLogger::log('import_utilisateurs', [
            'crees'   => count($crees),
            'erreurs' => count($erreurs),
            'admin'   => auth()->id(),
        ]);

        return response()->json([
            'crees'   => $crees,
            'erreurs' => $erreurs,
            'message' => count($crees) . ' utilisateur(s) créé(s), ' . count($erreurs) . ' erreur(s).',
        ]);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function parseFile(\Illuminate\Http\UploadedFile $file): array
    {
        $ext = strtolower($file->getClientOriginalExtension());

        if (in_array($ext, ['xlsx', 'xls'])) {
            return $this->parseXlsx($file->getRealPath());
        }

        return $this->parseCsv($file->getRealPath());
    }

    private function parseCsv(string $path): array
    {
        $rows    = [];
        $headers = null;

        if (($handle = fopen($path, 'r')) !== false) {
            // Détection du séparateur (virgule ou point-virgule)
            $firstLine = fgets($handle);
            rewind($handle);
            $sep = substr_count($firstLine, ';') > substr_count($firstLine, ',') ? ';' : ',';

            while (($data = fgetcsv($handle, 0, $sep)) !== false) {
                if ($headers === null) {
                    $headers = array_map('strtolower', array_map('trim', $data));
                    continue;
                }
                if (count($data) < 2) continue;
                $rows[] = array_combine(
                    array_slice($headers, 0, count($data)),
                    array_map('trim', $data)
                );
            }
            fclose($handle);
        }

        return $rows;
    }

    private function parseXlsx(string $path): array
    {
        // Nécessite : composer require phpoffice/phpspreadsheet
        if (!class_exists(\PhpOffice\PhpSpreadsheet\IOFactory::class)) {
            throw new \RuntimeException('phpoffice/phpspreadsheet requis. Exécutez : composer require phpoffice/phpspreadsheet');
        }

        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($path);
        $sheet       = $spreadsheet->getActiveSheet();
        $rows        = $sheet->toArray(null, true, true, false);

        if (empty($rows)) return [];

        $headers = array_map('strtolower', array_map('trim', array_shift($rows)));

        return array_filter(
            array_map(function ($row) use ($headers) {
                if (empty(array_filter($row))) return null;
                return array_combine(
                    array_slice($headers, 0, count($row)),
                    array_map(fn($v) => trim((string)($v ?? '')), $row)
                );
            }, $rows)
        );
    }

    private function validerLigne(array $row, int $ligne): array
    {
        $erreurs = [];
        $role    = strtoupper(trim($row['role'] ?? ''));

        if (empty($row['nom'])) {
            $erreurs[] = "Nom manquant";
        }
        if (empty($row['email'])) {
            $erreurs[] = "Email manquant";
        } elseif (!filter_var($row['email'], FILTER_VALIDATE_EMAIL)) {
            $erreurs[] = "Email invalide : {$row['email']}";
        } elseif (Utilisateur::where('email', strtolower($row['email']))->exists()) {
            $erreurs[] = "Email déjà utilisé : {$row['email']}";
        }
        if (!in_array($role, ['A', 'S', 'E', 'T', 'J'])) {
            $erreurs[] = "Rôle invalide : '{$row['role']}' (attendu A, S, E, T ou J)";
        }
        if ($role === 'S') {
            if (empty($row['filiere']))     $erreurs[] = "Filière requise pour les étudiants";
            if (empty($row['niveau_etud'])) $erreurs[] = "Niveau d'étude requis pour les étudiants";
        }
        if ($role === 'E') {
            if (empty($row['addresse'])) $erreurs[] = "Adresse requise pour les entreprises";
            if (empty($row['secteur']))  $erreurs[] = "Secteur requis pour les entreprises";
        }
        if ($role === 'T') {
            if (empty($row['departement'])) $erreurs[] = "Département requis pour les tuteurs";
        }

        return $erreurs;
    }

    private function creerProfil(Utilisateur $user, array $row): void
    {
        match ($user->role) {
            'A' => Administrateur::create(['utilisateurs_id' => $user->id]),
            'S' => Etudiant::create([
                        'utilisateurs_id' => $user->id,
                        'filiere'         => $row['filiere'],
                        'niveau_etud'     => (int) $row['niveau_etud'],
                    ]),
            'E' => Entreprise::create([
                        'utilisateurs_id' => $user->id,
                        'nom_entreprise'  => $row['nom'],
                        'addresse'        => $row['addresse'],
                        'secteur'         => $row['secteur'],
                    ]),
            'T' => Tuteur::create([
                        'utilisateurs_id' => $user->id,
                        'departement'     => $row['departement'],
                    ]),
            default => null,
        };
    }
}