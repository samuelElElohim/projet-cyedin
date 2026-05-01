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
        Schema::create('entreprises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('utilisateurs_id')->constrained('utilisateurs')->onDelete('cascade');// permet de limiter l'existance d'un admin que si un utilisateur de meme id existe deja
            $table->string('nom_entreprise'); // taille max par default 255 char, pas besoin de specifie? PS: Je crois qu'on l'utilise mm pas
            $table->string('addresse');
            /*$table->unsignedTinyInteger('filiere_id');
            $table->foreign('filiere_id')->references('id')->on('filieres');
            //sinon pas besoin de meme specifie le secteur*/
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entreprises');
    }
};
