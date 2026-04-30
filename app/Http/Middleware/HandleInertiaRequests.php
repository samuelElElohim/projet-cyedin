<?php

namespace App\Http\Middleware;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            // Notifications partagées globalement — disponibles dans tous les layouts
            'notifications' => fn () => $request->user()
                ? Notification::where('proprietaire_id', $request->user()->id)
                    ->orderBy('date_envoi', 'desc')
                    ->take(20)
                    ->get()
                : [],
        ];
    }
}