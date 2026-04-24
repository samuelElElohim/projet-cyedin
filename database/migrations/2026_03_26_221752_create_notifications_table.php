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
        Schema::create('notifications', function (Blueprint $table) {

            $table->id();
            $table->foreignId('offre_id')
              ->nullable()
              ->after('proprietaire_id')
              ->constrained('offres')
              ->nullOnDelete();
            //chaque notif est envoye a un utilisateur
            //donc pas d'utilisateur, pas de notif
            $table->string('message');
            $table->timestamp('date_envoi')->default(DB::raw('CURRENT_TIMESTAMP')); //date emission de la notif
            $table->boolean('est_lu')->default(false); 

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
