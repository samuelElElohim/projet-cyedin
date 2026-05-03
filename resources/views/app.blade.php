<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="CYedin — Plateforme officielle de gestion des stages de CY Tech Pau. Étudiants, tuteurs, entreprises et jurys.">
        <meta name="theme-color" content="#2563eb">

        {{-- Open Graph --}}
        <meta property="og:title" content="CYedin — Portail des stages CY Tech">
        <meta property="og:description" content="Gérez vos stages, dossiers et conventions en toute simplicité.">
        <meta property="og:type" content="website">

        <title inertia>{{ config('app.name', 'CYedin') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        {{-- Skip link pour accessibilité clavier --}}
        <a href="#main-content"
           class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-lg">
            Aller au contenu principal
        </a>

        @inertia
    </body>
</html>