import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function AdminMainEntreprise() {
    return (
        <AdminLayout title="Gestion des entreprises">
            <Head title="Entreprises — Admin" />
            <div className="grid grid-cols-2 gap-4 max-w-sm">
                <Link
                    href={route('admin.index.entreprise')}
                    className="flex flex-col items-center justify-center gap-2 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition text-sm font-medium text-gray-700"
                >
                    <span className="text-2xl">📋</span>
                    Voir toutes les entreprises
                </Link>
                <Link
                    href={route('admin.create.entreprise')}
                    className="flex flex-col items-center justify-center gap-2 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition text-sm font-medium text-gray-700"
                >
                    <span className="text-2xl">➕</span>
                    Ajouter une entreprise
                </Link>
            </div>
        </AdminLayout>
    );
}