<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entreprise_secteurs', function (Blueprint $table) {
            $table->unsignedBigInteger('entreprise_id');
            $table->unsignedTinyInteger('secteur_id');

            $table->foreign('entreprise_id')->references('id')->on('entreprises')->cascadeOnDelete();
            $table->foreign('secteur_id')->references('id')->on('secteurs')->cascadeOnDelete();

            $table->primary(['entreprise_id', 'secteur_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entreprise_secteurs');
    }
};
