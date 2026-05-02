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
        Schema::create('etudiants', function (Blueprint $table) {

            $table->id();
            $table->foreignId('utilisateur_id')->constrained('utilisateurs')->onDelete('cascade');
            // c a d, si on supprime l'utilisateur avec une id d'un etudiant, sa classe etudiant est supp directement
            $table->unsignedTinyInteger('filiere_id');
            $table->foreign('filiere_id')->references('id')->on('filieres'); // filiere de l'étudiant, référence l'id de la filière.
            $table->unsignedTinyInteger('niveau_etud'); // il y'en a au plus 5 niveau d'etude, sauf s'il existe une formation qui necessite +9 ans?
            // ajouter chemin_cv pour cv principal...
            $table->timestamps(); 

        });
    }

    /**
     * Reverse the migratio ns.
     */
    public function down(): void
    {
        Schema::dropIfExists('etudiants');
    }
};
