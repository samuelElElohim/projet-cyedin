<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
    *
    ATTENTION : LES IDs des parties presantes doivent etre des utilisateurs, et pas de leurs tables, sinon on aurra des confusions.

    */   
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stages', function (Blueprint $table) {
            $table->id();
            $table->string('sujet');
            $table->timestamps(); // date du debut de stage
            $table->integer('duree_en_semaine'); // vu qu'on a la duree, on peut trouver facilement la date de la fin, pas besoin de la stocker...
            
            $table->foreignId('etudiant_id')
                ->constrained('etudiants')
                ->cascadeOnDelete();

            $table->foreignId('entreprise_id')
                ->constrained('entreprises')
                ->cascadeOnDelete();

            $table->foreignId('tuteur_id')
                ->constrained('tuteurs')
                ->cascadeOnDelete();
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
