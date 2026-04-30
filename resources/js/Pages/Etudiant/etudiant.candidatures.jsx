import EtudiantLayout from '@/Layouts/EtudiantLayout';
import { Head, router } from '@inertiajs/react';

const STATUT = {
    en_attente: { label: 'En attente', cls: 'bg-amber-100 text-amber-800' },
    acceptee:   { label: 'Acceptée',   cls: 'bg-green-100 text-green-800' },
    refusee:    { label: 'Refusée',    cls: 'bg-red-100 text-red-800' },
};

export default function EtudiantCandidatures({ candidatures = [] }) {
    function retirer(id) {
        if (!confirm('Retirer cette candidature ?')) return;
        router.delete(route('candidatures.destroy', id));
    }

    const enAttente = candidatures.filter(c => c.statut === 'en_attente').length;
    const acceptees = candidatures.filter(c => c.statut === 'acceptee').length;
    const refusees  = candidatures.filter(c => c.statut === 'refusee').length;

    return (
        <EtudiantLayout title="Mes candidatures">
            <Head title="Candidatures — Étudiant" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="En attente" value={enAttente} color="amber" />
                <StatCard label="Acceptées"  value={acceptees} color="green" />
                <StatCard label="Refusées"   value={refusees}  color="red" />
            </div>

            {/* Liste */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {candidatures.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <p className="text-3xl mb-2">📨</p>
                        Aucune candidature pour l'instant.
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                {['Offre', 'Entreprise', 'Secteur', 'Durée', 'Date', 'Statut', ''].map(h => (
                                    <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {candidatures.map(c => {
                                const s = STATUT[c.statut] ?? STATUT.en_attente;
                                return (
                                    <tr key={c.id} className="border-t border-slate-50 hover:bg-slate-50 transition">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{c.offre?.titre ?? '—'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{c.offre?.entreprise?.nom_entreprise ?? '—'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-500">{c.offre?.entreprise?.secteur ?? '—'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-500 text-center">{c.offre?.duree_semaines ?? '—'} sem.</td>
                                        <td className="px-4 py-3 text-xs text-slate-400">
                                            {new Date(c.created_at).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.cls}`}>
                                                {s.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {c.statut === 'en_attente' && (
                                                <button onClick={() => retirer(c.id)}
                                                    className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg hover:bg-red-50 hover:text-red-700 transition font-semibold">
                                                    Retirer
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </EtudiantLayout>
    );
}

function StatCard({ label, value, color }) {
    const colors = {
        amber: 'bg-amber-50 text-amber-700',
        green: 'bg-green-50 text-green-700',
        red:   'bg-red-50 text-red-700',
    };
    return (
        <div className={`rounded-xl p-4 ${colors[color]}`}>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-sm font-medium opacity-80 mt-1">{label}</div>
        </div>
    );
}
