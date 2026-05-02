import JuryLayout from '@/Layouts/JuryLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function JuryDossiers({ dossiers = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [statut, setStatut] = useState(filters.statut ?? 'all');

    function applyFilters(overrides = {}) {
        router.get(route('jury.index.dossiers'), {
            search: overrides.search ?? search,
            statut: overrides.statut ?? statut,
        }, { preserveState: true, replace: true });
    }

    const valides   = dossiers.filter(d => d.est_valide).length;
    const enAttente = dossiers.filter(d => !d.est_valide).length;

    return (
        <JuryLayout title="Dossiers de stage">
            <Head title="Dossiers — Jury" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="Total"      value={dossiers.length} color="purple" />
                <StatCard label="Validés"    value={valides}         color="green" />
                <StatCard label="En attente" value={enAttente}       color="amber" />
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Rechercher un étudiant…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                    {[
                        { value: 'all',     label: 'Tous' },
                        { value: 'valide',  label: 'Validés' },
                        { value: 'pending', label: 'En attente' },
                    ].map(f => (
                        <button key={f.value}
                            onClick={() => { setStatut(f.value); applyFilters({ statut: f.value }); }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                                statut === f.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <button onClick={() => applyFilters()}
                    className="px-4 py-2 bg-purple-600 text-white text-sm rounded-xl hover:bg-purple-700 transition">
                    Filtrer
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            {['Étudiant', 'Filière', 'Documents', 'Soumis le', 'Statut', ''].map(h => (
                                <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dossiers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">
                                    Aucun dossier trouvé.
                                </td>
                            </tr>
                        ) : dossiers.map(d => {
                            const u = d.etudiant?.utilisateur;
                            return (
                                <tr key={d.id} className="border-t border-slate-50 hover:bg-slate-50 transition">
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium text-slate-900">{u?.nom} {u?.prenom}</div>
                                        <div className="text-xs text-slate-400">{u?.email}</div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{d.etudiant?.filiere ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                                            📄 {d.documents?.length ?? 0}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500">
                                        {d.date_soumission
                                            ? new Date(d.date_soumission).toLocaleDateString('fr-FR')
                                            : <span className="italic text-slate-300">Non soumis</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge valide={d.est_valide} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link
                                                href={route('jury.dossier.detail', d.id)}
                                                className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-lg hover:bg-purple-100 font-semibold"
                                            >
                                                Évaluer
                                            </Link>
                                            {!d.est_valide && d.date_soumission && (
                                                <button
                                                    onClick={() => router.post(route('jury.dossier.valider', d.id))}
                                                    className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-lg hover:bg-green-100 font-semibold"
                                                >
                                                    Valider
                                                </button>
                                            )}
                                            {d.est_valide && (
                                                <button
                                                    onClick={() => router.post(route('jury.dossier.invalider', d.id))}
                                                    className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-lg hover:bg-red-100 font-semibold"
                                                >
                                                    Retourner
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </JuryLayout>
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
    const colors = {
        purple: 'bg-purple-50 text-purple-700',
        green:  'bg-green-50 text-green-700',
        amber:  'bg-amber-50 text-amber-700',
    };
    return (
        <div className={`rounded-xl p-4 ${colors[color]}`}>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-sm font-medium opacity-80 mt-1">{label}</div>
        </div>
    );
}
