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
            $table->unsignedBigInteger('utilisateurs_id')->primary();
            $table->foreign('utilisateurs_id')->references('id')->on('utilisateurs')->onDelete('cascade');// permet de limiter l'existance d'un admin que si un utilisateur de meme id existe deja
            $table->string('departement'); // le departement du tuteur: maths, info, biochimie, boulangerie ...

            $table->timestamps();

            $table->boolean('est_jury')->default(false); // pour savoir si le tuteur est aussi jury ou pas.

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
