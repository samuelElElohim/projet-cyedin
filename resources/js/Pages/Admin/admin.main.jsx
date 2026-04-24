import { Link } from "@inertiajs/react";

export default function AdminMain() {
    return (
        <div>
            <h1>Tableau de Bord - Administration</h1>
            <Link
                href={route("admin.main.user")}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Gérer Utilisateur
            </Link>
            {/*
            En fait on a pas besoin de ça comme on les ajoutes dans les users... 
            Il faut juste qu'on fasse un truc clean pour l'affichage de la DB user (filtre?Bouton?)
            <Link
                href={route("admin.main.entreprise")}
                className="px-4 py-2 bg-blue-600 text-white rounded">
                Gérer Entreprises
            </Link>*/}

            <Link
                href={route("admin.index.offre")}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Gérer Offres
            </Link>

        </div>
    );
}