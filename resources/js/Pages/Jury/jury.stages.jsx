import JuryLayout from '@/Layouts/JuryLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function JuryStages({ stages = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search ?? '');

    function applyFilters() {
        router.get(route('jury.index.stages'), { search }, { preserveState: true, replace: true });
    }

    return (
        <JuryLayout title="Stages">
            <Head title="Stages — Jury" />

            {/* Filtre */}
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Rechercher un étudiant ou un sujet…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
                <button onClick={applyFilters}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition">
                    Filtrer
                </button>
                {search && (
                    <button onClick={() => { setSearch(''); router.get(route('jury.index.stages'), {}, { replace: true }); }}
                        className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-xl hover:bg-slate-200 transition">
                        Réinitialiser
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            {['Étudiant', 'Sujet', 'Entreprise', 'Tuteur', 'Durée', 'Convention'].map(h => (
                                <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {stages.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">
                                    Aucun stage trouvé.
                                </td>
                            </tr>
                        ) : stages.map(stage => {
                            const etudiant = stage.etudiant?.utilisateur;
                            return (
                                <tr key={stage.id} className="border-t border-slate-50 hover:bg-slate-50 transition">
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium text-slate-900">
                                            {etudiant ? `${etudiant.prenom} ${etudiant.nom}` : '—'}
                                        </div>
                                        <div className="text-xs text-slate-400">{stage.etudiant?.filiere}</div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-700 max-w-[180px] truncate">{stage.sujet}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{stage.entreprise?.nom_entreprise ?? '—'}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {stage.tuteur?.utilisateur
                                            ? `${stage.tuteur.utilisateur.nom}`
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-500 text-center">{stage.duree_en_semaine} sem.</td>
                                    <td className="px-4 py-3">
                                        {stage.convention_complete ? (
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
        </JuryLayout>
    );
}
