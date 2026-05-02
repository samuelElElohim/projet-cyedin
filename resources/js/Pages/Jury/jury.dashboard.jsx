import JuryLayout from '@/Layouts/JuryLayout';
import { Head, Link } from '@inertiajs/react';

export default function JuryDashboard({ stats = {}, dossiers_pending = [], notifications = [] }) {
    return (
        <JuryLayout title="Tableau de bord">
            <Head title="Dashboard — Jury" />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Dossiers total',    value: stats.dossiers_total   ?? 0, icon: '📁', color: 'blue' },
                    { label: 'Validés',           value: stats.dossiers_valides ?? 0, icon: '✅', color: 'green' },
                    { label: 'En attente',        value: stats.dossiers_pending ?? 0, icon: '⏳', color: 'amber' },
                    { label: 'Stages suivis',     value: stats.stages_total     ?? 0, icon: '🎓', color: 'purple' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                        <div className="text-2xl mb-1">{s.icon}</div>
                        <div className="text-xl font-black text-slate-900">{s.value}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* Dossiers en attente */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-700">
                            Dossiers soumis en attente
                            {dossiers_pending.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                                    {dossiers_pending.length}
                                </span>
                            )}
                        </h2>
                        <Link href={route('jury.index.dossiers')} className="text-xs text-purple-600 hover:text-purple-800 font-semibold">
                            Voir tout →
                        </Link>
                    </div>

                    {dossiers_pending.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-4">Aucun dossier en attente.</p>
                    ) : (
                        <div className="space-y-2">
                            {dossiers_pending.map(d => (
                                <Link
                                    key={d.id}
                                    href={route('jury.dossier.detail', d.id)}
                                    className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100 hover:border-purple-200 transition"
                                >
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">
                                            {d.etudiant?.utilisateur?.nom} {d.etudiant?.utilisateur?.prenom}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Soumis le {d.date_soumission
                                                ? new Date(d.date_soumission).toLocaleDateString('fr-FR')
                                                : '—'}
                                        </div>
                                    </div>
                                    <span className="text-xs text-purple-600 font-semibold">Évaluer →</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">
                        Notifications
                        {notifications.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                                {notifications.length}
                            </span>
                        )}
                    </h2>
                    {notifications.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-4">Aucune notification non lue.</p>
                    ) : (
                        <div className="space-y-2">
                            {notifications.map(n => (
                                <div key={n.id} className="p-3 bg-purple-50 rounded-xl border border-purple-100">
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

            {/* Accès rapides */}
            <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                    { label: 'Consulter les dossiers', href: 'jury.index.dossiers', icon: '📁' },
                    { label: 'Consulter les stages',   href: 'jury.index.stages',   icon: '🎓' },
                ].map(item => (
                    <Link
                        key={item.href}
                        href={route(item.href)}
                        className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-purple-200 hover:shadow-md transition text-sm font-medium text-slate-700"
                    >
                        <span className="text-xl">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </div>
        </JuryLayout>
    );
}
