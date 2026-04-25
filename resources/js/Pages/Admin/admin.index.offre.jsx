import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminIndexOffre({ entreprises = [], filters = {} }) {
    const [search, setSearch]     = useState(filters.search ?? '');
    const [dureeMin, setDureeMin] = useState(filters.duree_min ?? '');
    const [dureeMax, setDureeMax] = useState(filters.duree_max ?? '');
    const [statut, setStatut]     = useState(filters.statut ?? 'all');

    function applyFilters(overrides = {}) {
        router.get(route('admin.index.offre'), {
            search:    overrides.search   ?? search,
            duree_min: overrides.duree_min ?? dureeMin,
            duree_max: overrides.duree_max ?? dureeMax,
            statut:    overrides.statut   ?? statut,
        }, { preserveState: true, replace: true });
    }

    function toggleOffre(id) {
        router.post(route('admin.toggle.offre', id));
    }

    const totalOffres  = entreprises.reduce((acc, e) => acc + (e.offres?.length ?? 0), 0);
    const totalActives = entreprises.reduce((acc, e) => acc + (e.offres?.filter(o => o.est_active).length ?? 0), 0);

    return (
        <AdminLayout title="Gestion des offres de stage">
            <Head title="Offres — Admin" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="Offres totales"  value={totalOffres}                color="blue" />
                <StatCard label="Offres actives"  value={totalActives}               color="green" />
                <StatCard label="En attente"       value={totalOffres - totalActives} color="amber" />
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Titre, mission, description…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />

                <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500 font-medium">Durée (sem.)</label>
                    <input
                        type="number"
                        min="1"
                        placeholder="min"
                        value={dureeMin}
                        onChange={e => setDureeMin(e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-2 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <span className="text-gray-400">–</span>
                    <input
                        type="number"
                        min="1"
                        placeholder="max"
                        value={dureeMax}
                        onChange={e => setDureeMax(e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-2 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                    {[
                        { value: 'all',      label: 'Toutes' },
                        { value: 'active',   label: 'Actives' },
                        { value: 'inactive', label: 'En attente' },
                    ].map(f => (
                        <button
                            key={f.value}
                            onClick={() => { setStatut(f.value); applyFilters({ statut: f.value }); }}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                                statut === f.value
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => applyFilters()}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                >
                    Filtrer
                </button>

                <button
                    onClick={() => {
                        setSearch(''); setDureeMin(''); setDureeMax(''); setStatut('all');
                        router.get(route('admin.index.offre'), {}, { replace: true });
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition"
                >
                    Réinitialiser
                </button>
            </div>

            {/* Liste par entreprise */}
            <div className="space-y-4">
                {entreprises.map(entreprise => (
                    <div key={entreprise.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-base">🏢</span>
                                <span className="font-semibold text-gray-800">{entreprise.nom_entreprise}</span>
                            </div>
                            <div className="flex gap-2 text-xs text-gray-500">
                                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                    {entreprise.offres.filter(o => o.est_active).length} active(s)
                                </span>
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                                    {entreprise.offres.filter(o => !o.est_active).length} en attente
                                </span>
                            </div>
                        </div>

                        {entreprise.offres.length === 0 ? (
                            <p className="px-5 py-4 text-sm text-gray-400">Aucune offre pour ce filtre.</p>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-50">
                                    <tr>
                                        {['Titre', 'Missions / Description', 'Durée (sem.)', 'Statut', ''].map(h => (
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
                                            <td className="px-4 py-3 text-sm text-gray-500 max-w-xs">
                                                <p className="truncate">{offre.description}</p>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 text-center">{offre.duree_semaines}</td>
                                            <td className="px-4 py-3">
                                                <StatusBadge active={offre.est_active} />
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

                {entreprises.filter(e => e.offres.length > 0).length === 0 && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center text-sm text-gray-400">
                        Aucune offre ne correspond à votre recherche.
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function StatCard({ label, value, color }) {
    const colors = { blue: 'bg-blue-50 text-blue-700', green: 'bg-green-50 text-green-700', amber: 'bg-amber-50 text-amber-700' };
    return (
        <div className={`rounded-xl p-4 ${colors[color]}`}>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-sm font-medium opacity-80 mt-1">{label}</div>
        </div>
    );
}

function StatusBadge({ active }) {
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            active ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
        }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-amber-500'}`} />
            {active ? 'Active' : 'En attente'}
        </span>
    );
}
