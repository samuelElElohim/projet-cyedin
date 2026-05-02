import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

export default function AdminMain({ stats = {}, notifications = [], entreprises_pending = [] }) {
    return (
        <AdminLayout title="Vue d'ensemble">
            <Head title="Dashboard Admin" />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {[
                    { label: 'Utilisateurs', value: stats.utilisateurs ?? 0, color: 'blue' },
                    { label: 'Étudiants',    value: stats.etudiants ?? 0,    color: 'teal' },
                    { label: 'Entreprises',  value: stats.entreprises ?? 0,  color: 'purple' },
                    { label: 'Offres actives', value: stats.offres_actives ?? 0, color: 'green' },
                    { label: 'Offres pending', value: stats.offres_pending ?? 0, color: 'amber' },
                    { label: 'Comptes à valider', value: stats.entreprises_pending ?? 0, color: 'red' },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <div className="text-2xl font-black text-slate-900">{s.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* Entreprises en attente de validation */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h2 className="text-sm font-semibold text-gray-800 mb-4">
                        Entreprises en attente de validation
                        {entreprises_pending.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                                {entreprises_pending.length}
                            </span>
                        )}
                    </h2>

                    {entreprises_pending.length === 0 ? (
                        <p className="text-sm text-gray-400">Aucune demande en attente.</p>
                    ) : (
                        <div className="space-y-3">
                            {entreprises_pending.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.entreprise?.nom_entreprise ?? user.nom}
                                        </div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                        <div className="text-xs text-gray-400">
                                            {user.entreprise?.secteur} — {user.entreprise?.addresse}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            router.post(route('admin.validate.entreprise', user.id))
                                        }
                                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition"
                                    >
                                        Valider
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notifications récentes */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h2 className="text-sm font-semibold text-gray-800 mb-4">
                        Notifications récentes
                        {notifications.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {notifications.length}
                            </span>
                        )}
                    </h2>

                    {notifications.length === 0 ? (
                        <p className="text-sm text-gray-400">Aucune notification non lue.</p>
                    ) : (
                        <div className="space-y-2">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="text-sm p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <p className="text-gray-700">{notif.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{notif.date_envoi}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Accès rapides */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Gérer les utilisateurs', href: 'admin.main.user',       icon: '👤' },
                    { label: 'Gérer les entreprises',  href: 'admin.main.entreprise', icon: '🏢' },
                    { label: 'Gérer les offres',       href: 'admin.index.offre',     icon: '📋' },
                    { label: 'Ajouter utilisateur',    href: 'admin.create.user',     icon: '➕' },
                ].map((item) => (
                    <Link
                        key={item.href}
                        href={route(item.href)}
                        className="flex flex-col items-center justify-center p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition text-sm font-medium text-gray-700"
                    >
                        <span className="text-2xl mb-2">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </div>
        </AdminLayout>
    );
}