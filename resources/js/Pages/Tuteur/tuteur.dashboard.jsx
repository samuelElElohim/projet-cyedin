import TuteurLayout from '@/Layouts/TuteurLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function TuteurDashboard({ tuteur, stages = [], notifications = [], stats = {} }) {
    function signerConvention(stageId) {
        if (!confirm('Signer la convention de ce stage ?')) return;
        router.post(route('tuteur.signer.convention', stageId));
    }

    return (
        <TuteurLayout title="Tableau de bord">
            <Head title="Dashboard — Tuteur" />

            {/* Profil */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700 font-black text-lg">
                    {tuteur?.utilisateur?.prenom?.[0] ?? '👨‍🏫'}
                </div>
                <div>
                    <div className="font-semibold text-slate-900">
                        {tuteur?.utilisateur?.prenom} {tuteur?.utilisateur?.nom}
                    </div>
                    <div className="text-xs text-slate-500">
                        Département <span className="font-semibold text-teal-600">{tuteur?.departement ?? '—'}</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="Étudiants suivis"       value={stats.total_etudiants ?? 0}       color="teal" />
                <StatCard label="Conventions complètes"  value={stats.conventions_completes ?? 0}  color="green" />
                <StatCard label="Conventions en attente" value={stats.conventions_pending ?? 0}    color="amber" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* Étudiants / Stages */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-700">Mes étudiants</h2>
                        <Link href={route('tuteur.create.stage')}
                            className="px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-xl hover:bg-teal-700 transition">
                            + Affecter stage
                        </Link>
                    </div>

                    {stages.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-6">Aucun stage assigné.</p>
                    ) : (
                        <div className="space-y-3">
                            {stages.map(stage => {
                                const cv = stage.convention_status;
                                const etudiant = stage.etudiant?.utilisateur;
                                return (
                                    <div key={stage.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-100 transition">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div>
                                                <div className="font-semibold text-slate-900 text-sm">
                                                    {etudiant ? `${etudiant.prenom} ${etudiant.nom}` : '—'}
                                                </div>
                                                <div className="text-xs text-slate-500">{stage.sujet}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">
                                                    {stage.entreprise?.nom_entreprise} · {stage.duree_en_semaine} sem.
                                                </div>
                                            </div>
                                            <ConventionMini cv={cv} />
                                        </div>

                                        <div className="flex gap-2 mt-3 flex-wrap">
                                            {/* Signer convention */}
                                            {cv && !cv.tuteur && (
                                                <button
                                                    onClick={() => signerConvention(stage.id)}
                                                    className="px-2 py-1 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition"
                                                >
                                                    ✍ Signer convention
                                                </button>
                                            )}

                                            {/* Cahier */}
                                            <Link
                                                href={route('tuteur.cahier', { etudiantId: stage.etudiants_id })}
                                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100 transition"
                                            >
                                                📓 Cahier
                                            </Link>

                                            {/* Documents */}
                                            <Link
                                                href={route('tuteur.etudiant', { etudiantId: stage.etudiants_id })}
                                                className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200 transition"
                                            >
                                                📄 Documents & Remarques
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">
                        Notifications
                        {notifications.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full">
                                {notifications.length}
                            </span>
                        )}
                    </h2>
                    {notifications.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-4">Aucune notification non lue.</p>
                    ) : (
                        <div className="space-y-2">
                            {notifications.map(n => (
                                <div key={n.id} className="p-3 bg-teal-50 rounded-xl border border-teal-100">
                                    <p className="text-sm text-slate-700">{n.message}</p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {new Date(n.date_envoi).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </TuteurLayout>
    );
}

function ConventionMini({ cv }) {
    if (!cv) return <span className="text-xs text-slate-400">Pas de convention</span>;
    return (
        <div className="flex gap-1 shrink-0">
            {[
                { label: 'E', signed: cv.entreprise },
                { label: 'T', signed: cv.tuteur },
                { label: 'É', signed: cv.etudiant },
            ].map(p => (
                <span key={p.label} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                    p.signed ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-400'
                }`}>
                    {p.label}
                </span>
            ))}
        </div>
    );
}

function StatCard({ label, value, color }) {
    const colors = {
        teal:  'bg-teal-50 text-teal-700',
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
