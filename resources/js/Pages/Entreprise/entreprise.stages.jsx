import EntrepriseLayout from '@/Layouts/EntrepriseLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function EntrepriseStages({ stages = [] }) {
    function signerConvention(stageId) {
        if (!confirm('Signer la convention de ce stage ?')) return;
        router.post(route('entreprise.convention.signer', stageId));
    }

    const complets  = stages.filter(s => s.convention_status?.complete).length;
    const enCours   = stages.length - complets;

    return (
        <EntrepriseLayout title="Mes stages">
            <Head title="Stages — Entreprise" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="Total"              value={stages.length} color="blue" />
                <StatCard label="Convention signée"  value={complets}      color="green" />
                <StatCard label="En attente"         value={enCours}       color="amber" />
            </div>

            {/* Liste */}
            {stages.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <p className="text-3xl mb-2">🎓</p>
                    Aucun stage en cours.
                </div>
            ) : (
                <div className="space-y-4">
                    {stages.map(stage => {
                        const cv = stage.convention_status;
                        const etudiant = stage.etudiant?.utilisateur;

                        return (
                            <div key={stage.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div>
                                        <div className="font-semibold text-slate-900">{stage.sujet}</div>
                                        <div className="text-sm text-slate-500 mt-0.5">
                                            {etudiant ? `${etudiant.prenom} ${etudiant.nom}` : '—'}
                                            {stage.tuteur?.utilisateur && (
                                                <span className="ml-2 text-slate-400">· Tuteur : {stage.tuteur.utilisateur.nom}</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">{stage.duree_en_semaine} semaines</div>
                                    </div>

                                    <Link
                                        href={route('entreprise.stage.detail', stage.id)}
                                        className="shrink-0 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-xl hover:bg-amber-100 transition"
                                    >
                                        Voir le détail →
                                    </Link>
                                </div>

                                {/* Convention */}
                                {cv ? (
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Convention</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {[
                                                { label: 'Entreprise', signed: cv.entreprise },
                                                { label: 'Tuteur',     signed: cv.tuteur },
                                                { label: 'Étudiant',   signed: cv.etudiant },
                                            ].map(p => (
                                                <span key={p.label} className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                                                    p.signed ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {p.signed ? '✓' : '○'} {p.label}
                                                </span>
                                            ))}

                                            {!cv.entreprise && (
                                                <button
                                                    onClick={() => signerConvention(stage.id)}
                                                    className="px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-xl hover:bg-amber-600 transition"
                                                >
                                                    ✍ Signer la convention
                                                </button>
                                            )}

                                            {cv.complete && (
                                                <span className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-xl">
                                                    ✓ Convention complète
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">Pas encore de convention créée.</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </EntrepriseLayout>
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
