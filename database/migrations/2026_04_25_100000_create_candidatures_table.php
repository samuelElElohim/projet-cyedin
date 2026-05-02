<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidatures', function (Blueprint $table) {
            $table->id();

            $table->foreignId('etudiant_id')
                ->constrained('utilisateurs')
                ->onDelete('cascade');

            $table->foreignId('offre_id')
                ->constrained('offres')
                ->onDelete('cascade');

            $table->enum('statut', ['en_attente', 'acceptee', 'refusee'])
                ->default('en_attente');

            $table->text('lettre_motivation')->nullable(); // Texte saisi dans un formulaire

            // Stockage des fichiers (Chemin hashé + Nom original pour l'utilisateur)
            $table->string('chemin_cv')->nullable();
            $table->string('nom_cv_original')->nullable();
            
            $table->string('chemin_lettre')->nullable();
            $table->string('nom_lettre_original')->nullable();

            $table->text('commentaire_entreprise')->nullable();

            $table->unique(['etudiant_id', 'offre_id']);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidatures');
    }
};