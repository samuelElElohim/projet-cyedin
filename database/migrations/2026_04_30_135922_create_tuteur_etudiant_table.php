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
        Schema::create('tuteur_etudiant', function (Blueprint $table) {
            $table->foreignId('tuteur_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->foreignId('etudiant_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->primary(['tuteur_id', 'etudiant_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tuteur_etudiant');
    }
};
