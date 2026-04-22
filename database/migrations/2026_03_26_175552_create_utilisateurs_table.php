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
        Schema::create('utilisateurs', function (Blueprint $table) {
            $table->id(); // par defaut compris comme cle prim, pas besoin de faire ->unique() ?

            $table->string('nom',25); //pas necessaire donner un grand N de char jps. peut etre null en cas d'entreprise
            // le nom de l'entreprise est aussi mis dans nom, pour eviter de faire une jointure pour recuperer le nom de l'entreprise, et aussi pour eviter de faire une colonne nom_entreprise dans la table entreprise, qui ne serait pas utilise pour les autres types d'utilisateur

            $table->string('prenom',15)->nullable(); //pas necessaire donner un grand N de char jps. peut etre null en cas d'entreprise

            $table->string('email',42)->unique(); // chaque email doit etre unique, donc il faut soit gerer le cas ou deux etudiants on le meme nom et prenom, donc ajouter un chiffre avant le @
            // Samuel : Je pense que pour le mvp on a même pas besoin de faire des envois d'emails etc. concentrons-nous sur la base qui est poster annonce et postuler et tuteur qui valide des trucs...  

            $table->string('mot_de_passe'); 
            $table->timestamps();
            // À la place de string('role', 1)
            $table->enum('role', ['A', 'J', 'S', 'E', 'T'])->default('S');
            // peut etre assigner en un seul char? en angalis: A: admin, J: jury, S:student, E:entreprise, T: tutor
            // dans la creation faudra juste donner une liste, le choix dans la liste donne la lettre?

            //$table->timestamp('date_creation');
            $table->boolean('est_active')->default(false); // peut etre qu'il faut activer le compte par un prompte en premier? sinon changer le default a true 
            $table->boolean('premier_mdp_changer')->default(false); // pour savoir si le mot de passe a ete change ou pas, par defaut false, et a la premiere connexion on demande de le changer?


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilisateurs');
    }
};
