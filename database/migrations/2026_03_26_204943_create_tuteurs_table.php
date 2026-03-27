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
        Schema::create('tuteurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('utilisateurs_id')->constraint('utilisateurs')->onDelete('cascade');// permet de limiter l'existance d'un admin que si un utilisateur de meme id existe deja
            $table->string('departement'); // le departement du tuteur: maths, info, biochimie, boulangerie ...

            $table->timestamp('date_affectation'); // peut etre la date du debut de son role comme tuteur? sinon il y a deja la date de creation de son compte? a voir
        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tuteurs');
    }
};
