import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminIndexStage({ stages = [], count = 0, filters = {} }) {
    const [search, setSearch]       = useState(filters.search ?? '');
    const [convention, setConvention] = useState(filters.convention ?? 'all');

    function applyFilters(overrides = {}) {
        router.get(route('admin.index.stage'), {
            search:     overrides.search     ?? search,
            convention: overrides.convention ?? convention,
        }, { preserveState: true, replace: true });
    }

    const complete  = stages.filter(s => s.convention_status?.complete).length;
    const enCours   = stages.filter(s => !s.convention_status?.complete).length;

    return (
        <AdminLayout title="Suivi des stages">
            <Head title="Stages — Admin" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="Total stages"          value={count}    color="blue" />
                <StatCard label="Convention complète"   value={complete} color="green" />
                <StatCard label="Convention incomplète" value={enCours}  color="amber" />
            </div>

            {/* Filtres */}
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Étudiant, entreprise, sujet…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                    {[
                        { value: 'all',      label: 'Tous' },
                        { value: 'complete', label: 'Convention OK' },
                        { value: 'pending',  label: 'En attente' },
                    ].map(f => (
                        <button
                            key={f.value}
                            onClick={() => { setConvention(f.value); applyFilters({ convention: f.value }); }}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                                convention === f.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
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
                            {['ID', 'Sujet', 'Étudiant', 'Entreprise', 'Tuteur', 'Durée', 'Convention', ''].map(h => (
                                <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {stages.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">Aucun stage trouvé.</td>
                            </tr>
                        ) : stages.map(stage => {
                            const cv = stage.convention_status;
                            return (
                                <tr key={stage.id} className="border-t border-gray-50 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">{stage.id}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-[160px] truncate">{stage.sujet}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        {stage.etudiant?.utilisateur
                                            ? `${stage.etudiant.utilisateur.nom} ${stage.etudiant.utilisateur.prenom ?? ''}`
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{stage.entreprise?.nom_entreprise ?? '—'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        {stage.tuteur?.utilisateur
                                            ? `${stage.tuteur.utilisateur.nom} ${stage.tuteur.utilisateur.prenom ?? ''}`
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 text-center">{stage.duree_en_semaine} sem.</td>
                                    <td className="px-4 py-3">
                                        {cv ? (
                                            <div className="flex gap-1">
                                                <Sign label="E" signed={cv.entreprise} />
                                                <Sign label="T" signed={cv.tuteur} />
                                                <Sign label="É" signed={cv.etudiant} />
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">Pas de convention</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {cv?.complete ? (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-semibold">✓ Complète</span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full font-semibold">En attente</span>
                                        )}
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

function Sign({ label, signed }) {
    return (
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
            signed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
        }`}>
            {label}
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
