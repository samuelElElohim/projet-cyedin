<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demande_hierarchies', function (Blueprint $table) {
            $table->id();

            $table->foreignId('auteur_id')->constrained('utilisateurs')->cascadeOnDelete();

            // 'secteur' ou 'tag'
            $table->string('type', 20);
            $table->string('nom', 100);

            // Contexte selon le type
            $table->foreignId('filiere_id')->nullable()->constrained('filieres')->nullOnDelete();
            $table->foreignId('secteur_id')->nullable()->constrained('secteurs')->nullOnDelete();

            $table->text('justification')->nullable();

            $table->string('statut', 20)->default('en_attente'); // en_attente | approuve | refuse
            $table->foreignId('admin_id')->nullable()->constrained('utilisateurs')->nullOnDelete();
            $table->text('commentaire_admin')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demande_hierarchies');
    }
};
