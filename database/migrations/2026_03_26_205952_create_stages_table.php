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
        Schema::create('stages', function (Blueprint $table) {
            $table->id();
            $table->string('sujet');
            $table->timestamp('dateDebut'); // date du debut de stage
            $table->integer('duree_en_semaine'); // vu qu'on a la duree, on peut trouver facilement la date de la fin, pas besoin de la stocker...
            $table->integer('etudiant_id'); // l'id de l'etudiant qui (a) fait ce stage
            $table->integer('entreprise_id'); // l'id l'entreprise ou se passe le stage
            $table->integer('tuteur_id')->nullable(); //l'id du tuteur responsable de l'etudiant
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stages');
    }
};
