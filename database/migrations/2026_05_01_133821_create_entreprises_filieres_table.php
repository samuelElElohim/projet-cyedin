<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('entreprises_filieres', function (Blueprint $table) {
             // Pas d'id pour une table pivot
            $table->foreignId('entreprise_id')
                  ->constrained('entreprises')
                  ->cascadeOnDelete();

            $table->foreignId('filiere_id')
                  ->constrained('filieres')
                  ->cascadeOnDelete();

            // Empêche les doublons (ex: même tag ajouté deux fois à la même offre)
            $table->primary(['entreprise_id', 'filiere_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entreprises_filieres');
    }
};
