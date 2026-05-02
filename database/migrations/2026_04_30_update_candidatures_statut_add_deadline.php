<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('candidatures', function (Blueprint $table) {
            $table->timestamp('deadline_choix')->nullable()->after('statut');
        });

        // Mise à jour de la contrainte enum PostgreSQL
        DB::statement("ALTER TABLE candidatures DROP CONSTRAINT IF EXISTS candidatures_statut_check");
        DB::statement("ALTER TABLE candidatures ALTER COLUMN statut TYPE VARCHAR(30)");
        DB::statement("ALTER TABLE candidatures ADD CONSTRAINT candidatures_statut_check
            CHECK (statut IN (
                'en_attente',
                'accepted_pending_choice',
                'acceptee',
                'refusee',
                'expiree',
                'annulee'
            ))");
    }

    public function down(): void
    {
        Schema::table('candidatures', function (Blueprint $table) {
            $table->dropColumn('deadline_choix');
        });

        DB::statement("ALTER TABLE candidatures DROP CONSTRAINT IF EXISTS candidatures_statut_check");
        DB::statement("ALTER TABLE candidatures ADD CONSTRAINT candidatures_statut_check
            CHECK (statut IN ('en_attente', 'acceptee', 'refusee'))");
    }
};
