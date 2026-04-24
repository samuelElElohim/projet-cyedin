import { Link } from "@inertiajs/react";

export default function AdminMainEntreprise() {
    return (
        <div>
            <h1>Dashboard Admin - Entreprises</h1>
            <Link
                href={route("admin.index.entreprise")}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Afficher DB
            </Link>
            <Link
                href={route("admin.create.entreprise")}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Ajouter DB
            </Link>
        </div>
    );
}