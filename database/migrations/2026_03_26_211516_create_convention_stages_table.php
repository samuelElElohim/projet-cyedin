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
        Schema::create('convention_stages', function (Blueprint $table) {
            $table->foreignId('stages_id')->constrained('stages')->onDelete('cascade'); // une convention de stage n'existe que si un stage est mit en place
            $table->timestamp('date_creation')->default(DB::raw('CURRENT_DATE')); //si une convention n'a pas une date specifique, la date de sa creation est la date de creation de la convention
            // une convention est false par default, mais il faut la signature des 3 parties pour la changer donc pas besoin de stocker son status

            $table->boolean('signer_par_entreprise')->default(false); // si l'entreprise a signe la convention ou non
            $table->boolean('signer_par_tuteur')->default(false); // si le tuteur a signe la convention ou non
            $table->boolean('signer_par_etudiant')->default(false); // si l'etudiant signe la convention ou non

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('convention_stages');
    }
};
