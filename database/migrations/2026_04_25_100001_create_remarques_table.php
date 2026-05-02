<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
     * Table partagée pour toutes les remarques du système.
     * Un auteur (n'importe quel rôle) laisse une remarque sur une entité cible.
     *
     * cible_type / cible_id  = polymorphisme :
     *   - 'stage'         → stages.id
     *   - 'dossier_stage' → dossier_stages.id
     *   - 'document'      → documents.id
     *   - 'offre'         → offres.id
     */
    public function up(): void
    {
        Schema::create('remarques', function (Blueprint $table) {
            $table->id();

            // Auteur de la remarque (tout rôle confondu)
            $table->foreignId('auteur_id')
                ->constrained('utilisateurs')
                ->onDelete('cascade');

            // Cible polymorphe
            $table->string('cible_type', 50); // 'stage' | 'dossier_stage' | 'document' | 'offre'
            $table->unsignedBigInteger('cible_id');
            $table->index(['cible_type', 'cible_id']);

            $table->text('contenu');

            $table->boolean('est_visible_etudiant')->default(true);  // certaines remarques jury/admin peuvent être privées
            $table->boolean('est_visible_entreprise')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('remarques');
    }
};
