<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cahier_stages', function (Blueprint $table) {
            $table->id();

            $table->foreignId('etudiant_id')
                ->constrained('utilisateurs')
                ->onDelete('cascade');

            $table->date('date_entree'); // date de la journée décrite
            $table->string('titre', 255)->nullable();
            $table->text('contenu');

            // Visibilité : le tuteur peut lire, le jury aussi
            $table->boolean('visible_tuteur')->default(true);
            $table->boolean('visible_jury')->default(false);

            $table->timestamps();

            $table->index(['etudiant_id', 'date_entree']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cahier_stages');
    }
};
