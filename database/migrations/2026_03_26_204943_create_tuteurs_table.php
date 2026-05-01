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
            //$table->id();
            $table->foreignId('utilisateurs_id')->constrained('utilisateurs')->onDelete('cascade');// permet de limiter l'existance d'un admin que si un utilisateur de meme id existe deja
            
            // Filière (MATHS, INFO)
            $table->unsignedTinyInteger('filiere_id')->nullable();
            $table->foreign('filiere_id')->references('id')->on('filieres'); 
            
            $table->timestamps(); // peut etre la date du debut de son role comme tuteur? sinon il y a deja la date de creation de son compte? a voir
        
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
