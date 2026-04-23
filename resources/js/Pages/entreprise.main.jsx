import { Link } from "@inertiajs/react";

export default function EntrepriseMain() {
    return (
        <div>
            <h1>Tableau de Bord - Entreprise (mettre le nom de l'entreprise)</h1>
            <Link
                href={route("entreprise.index.offre")}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Gérer Offre
            </Link>

            <button
                onClick={() => router.post(route('logout'))}
                className="px-4 py-2 bg-red-600 text-white rounded"
            >
                Retour
            </button>

        </div>
    );
}