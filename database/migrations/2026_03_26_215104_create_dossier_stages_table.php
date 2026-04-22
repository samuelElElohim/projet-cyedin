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
        Schema::create('dossier_stages', function (Blueprint $table) {

            $table->id();
            $table->unsignedBigInteger('etudiants_id')->unique();
            $table->foreign('etudiants_id')->references('utilisateurs_id')->on('etudiants')->onDelete('cascade');

            $table->boolean('est_valide')->default(false); // doit etre modifiable par le jury uniquement
            $table->timestamp('date_soumission')->nullable(); // la date ou le dossier de stage est soumis
            // par defaut doit etre date_fin_stage + une duree pour ecrire le rapport de stage?
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dossier_stages');
    }
};
