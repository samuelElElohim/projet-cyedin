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
       // Migration candidatures — sans FK vers dossier_stages
        Schema::create('candidatures', function (Blueprint $table) {
            $table->id();

            $table->foreignId('offre_id')
                ->constrained('offres')
                ->cascadeOnDelete();

            $table->foreignId('etudiant_id')
                ->constrained('utilisateurs')
                ->cascadeOnDelete();

            $table->string('statut')->default('en_attente');
            $table->text('message')->nullable();
            $table->timestamps();

            // Un étudiant ne peut candidater qu'une fois par offre
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
