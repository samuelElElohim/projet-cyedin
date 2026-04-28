<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class TwoFactorController extends Controller
{
    private const OTP_TTL_SECONDS = 300; // 5 minutes

    /**
     * Affiche le formulaire de saisie du code OTP.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        // Si aucun OTP en attente, renvoyer au login
        if (! $request->session()->has('2fa_user_id')) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/TwoFactor', [
            'email' => $request->session()->get('2fa_email'),
        ]);
    }

    /**
     * Vérifie le code OTP soumis.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $userId    = $request->session()->get('2fa_user_id');
        $otpCode   = $request->session()->get('2fa_code');
        $otpSentAt = $request->session()->get('2fa_sent_at');

        // Pas de session 2FA active
        if (! $userId || ! $otpCode) {
            return redirect()->route('login')->withErrors(['code' => 'Session expirée, reconnectez-vous.']);
        }

        // Code expiré
        if (now()->timestamp - $otpSentAt > self::OTP_TTL_SECONDS) {
            $request->session()->forget(['2fa_user_id', '2fa_code', '2fa_sent_at', '2fa_email', '2fa_role']);
            return redirect()->route('login')->withErrors(['code' => 'Code expiré. Reconnectez-vous.']);
        }

        // Code incorrect
        if ($request->code !== $otpCode) {
            return back()->withErrors(['code' => 'Code incorrect.']);
        }

        // OTP valide — connecter l'utilisateur
        $user = \App\Models\Utilisateur::findOrFail($userId);
        \Illuminate\Support\Facades\Auth::login($user, $request->session()->get('2fa_remember', false));
        $request->session()->regenerate();
        $request->session()->forget(['2fa_user_id', '2fa_code', '2fa_sent_at', '2fa_email', '2fa_role', '2fa_remember']);

        return match($user->role) {
            'A' => redirect()->intended(route('admin.dashboard',      absolute: false)),
            'T' => redirect()->intended(route('tuteur.dashboard',     absolute: false)),
            'E' => redirect()->intended(route('entreprise.dashboard', absolute: false)),
            'J' => redirect()->intended(route('jury.dashboard',       absolute: false)),
            'S' => redirect()->intended(route('etudiant.dashboard',   absolute: false)),
            default => redirect()->intended(route('dashboard',        absolute: false)),
        };
    }

    /**
     * Renvoie un nouveau code OTP.
     */
    public function resend(Request $request): RedirectResponse
    {
        $userId = $request->session()->get('2fa_user_id');

        if (! $userId) {
            return redirect()->route('login');
        }

        $user = \App\Models\Utilisateur::findOrFail($userId);
        self::sendOtp($request, $user);

        return back()->with('status', 'Un nouveau code a été envoyé.');
    }

    /**
     * Génère un OTP, le stocke en session et l'envoie par email.
     */
    public static function sendOtp(Request $request, \App\Models\Utilisateur $user, bool $remember = false): void
    {
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $request->session()->put('2fa_user_id',  $user->id);
        $request->session()->put('2fa_code',     $code);
        $request->session()->put('2fa_sent_at',  now()->timestamp);
        $request->session()->put('2fa_email',    $user->email);
        $request->session()->put('2fa_role',     $user->role);
        $request->session()->put('2fa_remember', $remember);

        // Envoi du mail — fallback sur le log si SMTP non configuré
        try {
            Mail::raw(
                "Votre code de connexion CYedin : {$code}\n\nCe code expire dans 5 minutes.",
                function ($message) use ($user) {
                    $message->to($user->email)
                            ->subject('[CYedin] Votre code de connexion');
                }
            );
        } catch (\Throwable $e) {
            // En dev : le code est visible dans storage/logs/laravel.log
            \Illuminate\Support\Facades\Log::info("[2FA] Code pour {$user->email} : {$code}");
        }
    }
}