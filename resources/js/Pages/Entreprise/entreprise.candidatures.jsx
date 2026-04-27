import EntrepriseLayout from '@/Layouts/EntrepriseLayout';
import { Head, router } from '@inertiajs/react';

const STATUT = {
    en_attente: { label: 'En attente', cls: 'bg-amber-100 text-amber-800' },
    acceptee:   { label: 'Acceptée',   cls: 'bg-green-100 text-green-800' },
    refusee:    { label: 'Refusée',    cls: 'bg-red-100 text-red-800' },
};

export default function EntrepriseCandidatures({ candidatures_par_offre = {}, offres = {} }) {
    function accepter(id) { router.post(route('entreprise.candidatures.accepter', id)); }
    function refuser(id)  { router.post(route('entreprise.candidatures.refuser',  id)); }

    const offreIds = Object.keys(candidatures_par_offre);

    return (
        <EntrepriseLayout title="Candidatures reçues">
            <Head title="Candidatures — Entreprise" />

            {offreIds.length === 0 ? (
                <div className="text-center py-24 text-slate-400">
                    <p className="text-4xl mb-3">📨</p>
                    Aucune candidature reçue pour le moment.
                </div>
            ) : (
                <div className="space-y-6">
                    {offreIds.map(offreId => {
                        const offre = offres[offreId];
                        const cands = candidatures_par_offre[offreId] ?? [];
                        const enAttente = cands.filter(c => c.statut === 'en_attente').length;

                        return (
                            <div key={offreId} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                {/* Header offre */}
                                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                    <div>
                                        <span className="font-semibold text-slate-800">{offre?.titre ?? `Offre #${offreId}`}</span>
                                        <span className="ml-2 text-xs text-slate-500">{offre?.duree_semaines} sem.</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {enAttente > 0 && (
                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full font-semibold">
                                                {enAttente} en attente
                                            </span>
                                        )}
                                        <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs rounded-full font-semibold">
                                            {cands.length} total
                                        </span>
                                    </div>
                                </div>

                                {/* Liste candidats */}
                                <table className="w-full text-left">
                                    <thead className="border-b border-slate-50">
                                        <tr>
                                            {['Candidat', 'Date', 'Lettre de motivation', 'Statut', ''].map(h => (
                                                <th key={h} className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cands.map(c => {
                                            const s = STATUT[c.statut] ?? STATUT.en_attente;
                                            return (
                                                <tr key={c.id} className="border-t border-slate-50 hover:bg-slate-50 transition">
                                                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                                        {c.etudiant?.nom} {c.etudiant?.prenom}
                                                        <div className="text-xs text-slate-400">{c.etudiant?.email}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-slate-400">
                                                        {new Date(c.created_at).toLocaleDateString('fr-FR')}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-500 max-w-xs">
                                                        {c.lettre_motivation
                                                            ? <span className="line-clamp-2">{c.lettre_motivation}</span>
                                                            : <span className="italic text-slate-300">—</span>
                                                        }
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.cls}`}>
                                                            {s.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {c.statut === 'en_attente' && (
                                                            <div className="flex gap-2">
                                                                <button onClick={() => accepter(c.id)}
                                                                    className="px-2 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 font-semibold">
                                                                    Accepter
                                                                </button>
                                                                <button onClick={() => refuser(c.id)}
                                                                    className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 font-semibold">
                                                                    Refuser
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        );
                    })}
                </div>
            )}
        </EntrepriseLayout>
    );
}
