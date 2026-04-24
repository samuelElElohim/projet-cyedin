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
    Schema::create('etudiant_tag', function (Blueprint $table) {
        $table->unsignedBigInteger('etudiant_id');
        $table->foreignId('tag_id')->constrained('tags')->cascadeOnDelete();

        $table->foreign('etudiant_id')
              ->references('utilisateurs_id')
              ->on('etudiants')
              ->cascadeOnDelete();

        $table->primary(['etudiant_id', 'tag_id']);
    });
    }

    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('etudiant_tags');
    }
};
