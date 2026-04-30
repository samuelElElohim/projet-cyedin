import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminIndexDossier({ dossiers = [], count = 0, filters = {} }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [statut, setStatut] = useState(filters.statut ?? 'all');

    function applyFilters(overrides = {}) {
        router.get(route('admin.index.dossier'), {
            search: overrides.search ?? search,
            statut: overrides.statut ?? statut,
        }, { preserveState: true, replace: true });
    }

    function toggleDossier(id) {
        router.post(route('admin.toggle.dossier', id));
    }

    const valides   = dossiers.filter(d => d.est_valide).length;
    const enAttente = dossiers.filter(d => !d.est_valide).length;

    return (
        <AdminLayout title="Dossiers de stage">
            <Head title="Dossiers — Admin" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="Total dossiers"  value={count}    color="blue" />
                <StatCard label="Validés"          value={valides}   color="green" />
                <StatCard label="En attente"       value={enAttente} color="amber" />
            </div>

            {/* Filtres */}
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Rechercher un étudiant…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                    {[
                        { value: 'all',     label: 'Tous' },
                        { value: 'valide',  label: 'Validés' },
                        { value: 'pending', label: 'En attente' },
                    ].map(f => (
                        <button
                            key={f.value}
                            onClick={() => { setStatut(f.value); applyFilters({ statut: f.value }); }}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                                statut === f.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <button onClick={() => applyFilters()} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                    Filtrer
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            {['ID', 'Étudiant', 'Email', 'Filière', 'Documents', 'Soumis le', 'Statut', ''].map(h => (
                                <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dossiers.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">
                                    Aucun dossier trouvé.
                                </td>
                            </tr>
                        ) : dossiers.map(dossier => {
                            const u = dossier.etudiant?.utilisateur;
                            return (
                                <tr key={dossier.id} className="border-t border-gray-50 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">{dossier.id}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        {u ? `${u.nom} ${u.prenom ?? ''}` : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{u?.email ?? '—'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{dossier.etudiant?.filiere ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                                            📄 {dossier.documents?.length ?? 0}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {dossier.date_soumission
                                            ? new Date(dossier.date_soumission).toLocaleDateString('fr-FR')
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge valide={dossier.est_valide} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => toggleDossier(dossier.id)}
                                            className={`px-2 py-1 text-xs rounded font-semibold transition ${
                                                dossier.est_valide
                                                    ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                                            }`}
                                        >
                                            {dossier.est_valide ? 'Invalider' : 'Valider'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

function StatusBadge({ valide }) {
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            valide ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
        }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${valide ? 'bg-green-500' : 'bg-amber-500'}`} />
            {valide ? 'Validé' : 'En attente'}
        </span>
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
