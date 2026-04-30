// admin.main.user.jsx
// Ce fichier n'est plus nécessaire — la route 'admin.main.user' peut directement
// pointer vers admin.index.user (qui charge les données).
// Si tu veux garder la route, remplace le contenu par une redirection dans web.php :
//
//   Route::get('admin/dashboard/user', function () {
//       return redirect()->route('admin.index.user');
//   })->name('admin.main.user');
//
// OU garder la page hub comme ci-dessous :

import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function AdminMainUser() {
    return (
        <AdminLayout title="Gestion des utilisateurs">
            <Head title="Utilisateurs — Admin" />
            <div className="grid grid-cols-2 gap-4 max-w-sm">
                <HubCard href={route('admin.index.user')} icon="📋" label="Voir tous les utilisateurs" />
                <HubCard href={route('admin.create.user')} icon="➕" label="Ajouter un utilisateur" />
            </div>
        </AdminLayout>
    );
}

function HubCard({ href, icon, label }) {
    return (
        <Link
            href={href}
            className="flex flex-col items-center justify-center gap-2 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition text-sm font-medium text-gray-700"
        >
            <span className="text-2xl">{icon}</span>
            {label}
        </Link>
    );
}