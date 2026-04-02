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

            $table->string('nom',15)->nullable(); //pas necessaire donner un grand N de char jps. peut etre null en cas d'entreprise
            $table->string('prenom',15)->nullable(); //pas necessaire donner un grand N de char jps. peut etre null en cas d'entreprise

            $table->string('email',42)->unique(); // chaque email doit etre unique, donc il faut soit gerer le cas ou deux etudiants on le meme nom et prenom, donc ajouter un chiffre avant le @
            // exemple: jack.rousseau0@etu.cyu.fr et jack.rousseau1@etu.cyu.fr, deux email different pour deux etudiants diff.
            // peut etre ca serait pratique de mettre en place lors de la generation de l'email, par deffaut apres le nom un entier positif, et remets dans cet entier la valeur de retour de count(nom='jack',prenom='rousseau')
            // a voir

            $table->string('mot_de_passe'); 
            $table->timestamps();
            $table->string('role',1); // peut etre assigner en un seul char? en angalis: A: admin, J: jury, S:student, E:entreprise, T: tutor
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
