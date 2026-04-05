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
            $table->unsignedBigInteger('utilisateurs_id')->primary();
            $table->foreign('utilisateurs_id')->references('id')->on('utilisateurs')->onDelete('cascade');// permet de limiter l'existance d'un admin que si un utilisateur de meme id existe deja
            $table->string('addresse');
            $table->string('secteur'); // a gerer plutard, soit on prevoit des cst de secteur i.e au formation proposer??
            //sinon pas besoin de meme specifie le secteur
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
