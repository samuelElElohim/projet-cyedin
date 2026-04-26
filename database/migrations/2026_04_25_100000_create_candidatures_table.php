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

            $table->text('lettre_motivation')->nullable();

            // chemin vers le CV déposé (optionnel, peut pointer vers documents)
            $table->text('chemin_cv')->nullable();

            $table->text('commentaire_entreprise')->nullable(); // réponse de l'entreprise

            $table->unique(['etudiant_id', 'offre_id']); // une seule candidature par offre

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidatures');
    }
};
