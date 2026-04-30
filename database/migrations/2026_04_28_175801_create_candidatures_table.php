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
        Schema::create('candidatures', function (Blueprint $table) {
             $table->id();
 
            $table->foreignId('offre_id')
                  ->constrained('offres')
                  ->onDelete('cascade');
 
            $table->foreignId('etudiant_id')
                  ->constrained('etudiants')
                  ->onDelete('cascade');
 
            $table->boolean('est_accepte')
                  ->default(false);

 
            $table->timestamps();
 
            // Un étudiant ne peut postuler qu'une seule fois par offre
            $table->unique(['offre_id', 'etudiant_id']);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidatures');
    }
};
