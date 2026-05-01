<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('etudiants', function (Blueprint $table) {
            $table->string('chemin_cv')->nullable()->after('niveau_etud');
            $table->string('nom_cv')->nullable()->after('chemin_cv');
        });
    }

    public function down(): void
    {
        Schema::table('etudiants', function (Blueprint $table) {
            $table->dropColumn(['chemin_cv', 'nom_cv']);
        });
    }
};
