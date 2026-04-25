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
        Schema::create('offres', function (Blueprint $table) {
            $table->id();

            $table->foreignId('entreprise_id')
                ->constrained('entreprises')
                ->cascadeOnDelete();

            $table->string('titre');
            $table->text('description');
            $table->integer('duree_semaines');
            $table->boolean('est_active')->default(false);
            $table->timestamps();

            // Localisation
            $table->string('ville')->nullable();
            $table->string('pays')->default('France');

            // Filtres utiles
            $table->string('filiere')->nullable();      // quelle filière est ciblée
            $table->string('type_stage')->nullable();   // ex: "Ingénierie", "Recherche", "Commercial"
            $table->integer('remuneration')->nullable(); // en €/mois, null = non précisé

            // Image optionnelle pour la carte grande
            $table->string('image_url')->nullable();    // null = carte compacte, rempli = carte grande

            // Dates
            $table->date('date_debut')->nullable();
            $table->date('date_limite_candidature')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offres');
    }


};
