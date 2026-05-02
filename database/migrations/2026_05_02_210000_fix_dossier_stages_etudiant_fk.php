<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dossier_stages', function (Blueprint $table) {
            $table->dropForeign(['etudiant_id']);
            $table->foreign('etudiant_id')->references('id')->on('utilisateurs')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('dossier_stages', function (Blueprint $table) {
            $table->dropForeign(['etudiant_id']);
            $table->foreign('etudiant_id')->references('id')->on('etudiants')->onDelete('cascade');
        });
    }
};
