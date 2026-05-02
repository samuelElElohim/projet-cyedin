<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
     * Ajoute la colonne email_verified_at à la table utilisateurs.
     * Nécessaire pour que MustVerifyEmail fonctionne.
     *
     * Si la colonne existe déjà dans votre migration initiale,
     * NE PAS exécuter cette migration.
     */
    public function up(): void
    {
        Schema::table('utilisateurs', function (Blueprint $table) {
            // Vérifier d'abord que la colonne n'existe pas
            if (!Schema::hasColumn('utilisateurs', 'email_verified_at')) {
                $table->timestamp('email_verified_at')->nullable()->after('email');
            }
        });
    }

    public function down(): void
    {
        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->dropColumn('email_verified_at');
        });
    }
};
