import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminIndexOffre({ entreprises = [] }) {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'inactive'

    function toggleOffre(id) {
        router.post(route('admin.toggle.offre', id));
    }

    const totalOffres   = entreprises.reduce((acc, e) => acc + (e.offres?.length ?? 0), 0);
    const totalActives  = entreprises.reduce((acc, e) => acc + (e.offres?.filter(o => o.est_active).length ?? 0), 0);

    const filteredEntreprises = entreprises
        .map(e => {
            let offres = e.offres ?? [];

            if (search) {
                offres = offres.filter(o =>
                    `${o.titre} ${o.description}`.toLowerCase().includes(search.toLowerCase())
                );
            }
            if (filter === 'active')   offres = offres.filter(o => o.est_active);
            if (filter === 'inactive') offres = offres.filter(o => !o.est_active);

            return { ...e, offres };
        })
        .filter(e => {
            if (search) {
                return e.offres.length > 0 ||
                    e.nom_entreprise.toLowerCase().includes(search.toLowerCase());
            }
            return true;
        });

    return (
        <AdminLayout title="Gestion des offres de stage">
            <Head title="Offres — Admin" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="Offres totales"   value={totalOffres}              color="blue" />
                <StatCard label="Offres actives"   value={totalActives}             color="green" />
                <StatCard label="En attente"        value={totalOffres - totalActives} color="amber" />
            </div>

            {/* Filtres */}
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Rechercher une offre ou entreprise…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                    {[
                        { value: 'all',      label: 'Toutes' },
                        { value: 'active',   label: 'Actives' },
                        { value: 'inactive', label: 'En attente' },
                    ].map(f => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                                filter === f.value
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Liste par entreprise */}
            <div className="space-y-4">
                {filteredEntreprises.map(entreprise => (
                    <div key={entreprise.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* En-tête entreprise */}
                        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-base">🏢</span>
                                <span className="font-semibold text-gray-800">{entreprise.nom_entreprise}</span>
                            </div>
                            <div className="flex gap-2 text-xs text-gray-500">
                                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                    {entreprise.offres.filter(o => o.est_active).length} active{entreprise.offres.filter(o => o.est_active).length > 1 ? 's' : ''}
                                </span>
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                                    {entreprise.offres.filter(o => !o.est_active).length} en attente
                                </span>
                            </div>
                        </div>

                        {/* Offres */}
                        {entreprise.offres.length === 0 ? (
                            <p className="px-5 py-4 text-sm text-gray-400">Aucune offre pour ce filtre.</p>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-50">
                                    <tr>
                                        {['Titre', 'Description', 'Durée', 'Statut', ''].map(h => (
                                            <th key={h} className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {entreprise.offres.map(offre => (
                                        <tr key={offre.id} className="border-t border-gray-50 hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{offre.titre}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{offre.description}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{offre.duree_semaines} sem.</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                    offre.est_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${offre.est_active ? 'bg-green-500' : 'bg-amber-500'}`} />
                                                    {offre.est_active ? 'Active' : 'En attente'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => toggleOffre(offre.id)}
                                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                                                        offre.est_active
                                                            ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                                                    }`}
                                                >
                                                    {offre.est_active ? 'Désactiver' : 'Valider'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                ))}

                {filteredEntreprises.length === 0 && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center text-sm text-gray-400">
                        Aucune entreprise ou offre ne correspond à votre recherche.
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function StatCard({ label, value, color }) {
    const colors = {
        blue:  'bg-blue-50 text-blue-700',
        green: 'bg-green-50 text-green-700',
        amber: 'bg-amber-50 text-amber-700',
    };
    return (
        <div className={`rounded-xl p-4 ${colors[color]}`}>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-sm font-medium opacity-80 mt-1">{label}</div>
        </div>
    );
}