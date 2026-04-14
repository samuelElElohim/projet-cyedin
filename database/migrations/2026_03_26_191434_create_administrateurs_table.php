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

            // check si l'heritage marche de cette facon?
            $table->foreignId('utilisateurs_id')->constrained('utilisateurs')->onDelete('cascade'); // permet de limiter l'existance d'un admin que si un utilisateur de meme id existe deja

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
