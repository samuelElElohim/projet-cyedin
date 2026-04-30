<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demandes_formations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('etudiant_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->string('formation_demandee');
            $table->text('justification')->nullable();
            $table->enum('statut', ['en_attente', 'approuve', 'refuse'])->default('en_attente');
            $table->foreignId('admin_id')->nullable()->constrained('utilisateurs')->nullOnDelete();
            $table->text('commentaire_admin')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demandes_formations');
    }
};
