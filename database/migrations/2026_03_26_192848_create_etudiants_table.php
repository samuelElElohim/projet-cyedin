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
            $table->foreignId('utilisateurs_id')->constrained('utilisateurs')->onDelete('cascade'); // l'id d'un etudiant et celle de sa classe utilisateur, elle n'existe que si l'utilisateur existe
            // c a d, si on supprime l'utilisateur avec une id d'un etudiant, sa classe etudiant est supp directement

            $table->string('filiere',10); // filiere de l'etudiant, abrv ou complete?
            $table->unsignedTinyInteger('niveau_etud'); // il y'en a au plus 5 niveau d'etude, sauf s'il existe une formation qui necessite +9 ans?

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('etudiants');
    }
};
