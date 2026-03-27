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
        Schema::create('documents', function (Blueprint $table) {
    
            $table->id();
            $table->foreignId('utilisateurs_id')->constrained('utilisateurs')->onDelete('cascade');
            // chaque document est unique, mais un ensemble de docs appartient a un seul etudiant
            //  donc la cle primaire est l'id du doc+id de l'etudiant
            $table->string('nom');
            $table->string('type', 50)->nullable(); // pdf? jpeg?? ou bien une brieve desciption du document, par exemple de photo truc ...
            $table->timestamp('date_depot')->default(DB::raw('CURRENT_TIMESTAMP')); // date de l'ajout du document
            $table->text('chemin_fichier');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
