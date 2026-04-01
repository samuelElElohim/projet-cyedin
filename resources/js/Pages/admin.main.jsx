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
        </div>
    );
}