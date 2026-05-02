<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tuteur_secteurs', function (Blueprint $table) {
            $table->unsignedBigInteger('tuteur_id');
            $table->unsignedTinyInteger('secteur_id');

            $table->foreign('tuteur_id')->references('id')->on('utilisateurs')->cascadeOnDelete();
            $table->foreign('secteur_id')->references('id')->on('secteurs')->cascadeOnDelete();

            $table->primary(['tuteur_id', 'secteur_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tuteur_secteurs');
    }
};
