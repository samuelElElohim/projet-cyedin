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
        Schema::create('offres_tags', function (Blueprint $table) {

            // Pas d'id pour une table pivot
            $table->foreignId('offre_id')
                  ->constrained('offres')
                  ->cascadeOnDelete();

            $table->foreignId('tag_id')
                  ->constrained('tags')
                  ->cascadeOnDelete();

            // Empêche les doublons (ex: même tag ajouté deux fois à la même offre)
            $table->primary(['offre_id', 'tag_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offres_tags');
    }
};
