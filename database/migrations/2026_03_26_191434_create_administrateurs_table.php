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
        Schema::create('administrateurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('utilisateur_id')->unique()->constrained('utilisateurs')->onDelete('cascade');
            // $table->integer('niveau')->default(1); 3 niveau d'admin? a gerer apres

            $table->timestamps(); // ???
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('administrateurs');
    }
};
