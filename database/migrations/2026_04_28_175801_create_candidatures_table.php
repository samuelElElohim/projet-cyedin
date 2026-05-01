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
 
            $table->enum('statut', ['en_attente', 'acceptee', 'refusee'])
                ->default('en_attente');

 
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
