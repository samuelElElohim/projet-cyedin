<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('offres', function (Blueprint $table) {
            // Filière(s) ciblée(s) par l'offre — ex: "INFO", "MECA,GC", libre
            $table->string('filiere_cible', 100)->nullable()->after('duree_semaines');
        });
    }

    public function down(): void
    {
        Schema::table('offres', function (Blueprint $table) {
            $table->dropColumn('filiere_cible');
        });
    }
};
