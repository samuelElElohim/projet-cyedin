import { Link } from "@inertiajs/react";

export default function AdminMainUser() {
    return (
        <div>
            <h1>Dashboard Admin - User</h1>
            <Link
                href={route("admin.index.user")}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Afficher DB
            </Link>
            <Link
                href={route("admin.create.user")}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Ajouter DB
            </Link>
        </div>
    );
}