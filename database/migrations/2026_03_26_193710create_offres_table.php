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
        Schema::create('offres', function (Blueprint $table) {
            $table->id();

            $table->foreignId('entreprise_id')
                ->constrained('entreprises')
                ->cascadeOnDelete();

            $table->string('titre');
            $table->text('description');
            $table->integer('duree_semaines');
            $table->boolean('est_active')->default(false);
            
            // Filière (MATHS, INFO)
            $table->unsignedTinyInteger('filiere_id')->nullable();
            $table->foreign('filiere_id')->references('id')->on('filieres'); // à voir si on autorise une entreprise à poster sur
            // plusieurs secteurs...

            $table->unsignedTinyInteger('secteur_id')->nullable();
            $table->foreign('secteur_id')->references('id')->on('secteurs');

            $table->date('dateDebut')->nullable()->after('duree_semaines');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offres');
    }


};
