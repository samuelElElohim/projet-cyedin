<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;

class TraceLogger
{
    protected static string $path;

    public static function log(string $action, array $context = []): void
    {
        $path = storage_path('logs/trace.log');

        $user   = Auth::user();
        $userId = $user?->id ?? 'system';
        $role   = $user?->role ?? '-';
        $ip     = request()->ip();
        $date   = now()->format('Y-m-d H:i:s');

        $ctx = empty($context) ? '' : ' | ' . json_encode($context, JSON_UNESCAPED_UNICODE);

        $line = "[{$date}] user:{$userId} role:{$role} ip:{$ip} | {$action}{$ctx}" . PHP_EOL;

        file_put_contents($path, $line, FILE_APPEND | LOCK_EX);
    }

    public static function tail(int $lines = 200): string
    {
        $path = storage_path('logs/trace.log');

        if (! file_exists($path)) {
            return '';
        }

        $all = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        return implode(PHP_EOL, array_slice($all, -$lines));
    }
}
