import EntrepriseLayout from '@/Layouts/EntrepriseLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function EntrepriseDashboard({
    entreprise,
    offres = [],
    stages = [],
    candidatures_pending = [],
    notifications = [],
    stats = {},
}) {
    return (
        <EntrepriseLayout title="Tableau de bord">
            <Head title="Dashboard — Entreprise" />

            {/* Profil */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 font-black text-lg">
                    {entreprise?.nom_entreprise?.[0] ?? '🏢'}
                </div>
                <div>
                    <div className="font-semibold text-slate-900">{entreprise?.nom_entreprise}</div>
                    <div className="text-xs text-slate-500">
                        {entreprise?.secteur} · {entreprise?.addresse}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Offres actives',   value: stats.offres_actives ?? 0,  icon: '✅', color: 'green' },
                    { label: 'Offres en attente',value: stats.offres_pending ?? 0,  icon: '⏳', color: 'amber' },
                    { label: 'Stages en cours',  value: stats.stages ?? 0,          icon: '🎓', color: 'blue' },
                    { label: 'Candidatures',     value: stats.candidatures ?? 0,    icon: '📨', color: 'indigo' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                        <div className="text-2xl mb-1">{s.icon}</div>
                        <div className="text-xl font-black text-slate-900">{s.value}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* Candidatures en attente */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-700">
                            Candidatures en attente
                            {candidatures_pending.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                                    {candidatures_pending.length}
                                </span>
                            )}
                        </h2>
                        <Link href={route('entreprise.candidatures')} className="text-xs text-amber-600 hover:text-amber-800 font-semibold">
                            Voir tout →
                        </Link>
                    </div>

                    {candidatures_pending.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-4">Aucune candidature en attente.</p>
                    ) : (
                        <div className="space-y-2">
                            {candidatures_pending.map(c => (
                                <div key={c.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">
                                            {c.etudiant?.nom} {c.etudiant?.prenom}
                                        </div>
                                        <div className="text-xs text-slate-500">{c.offre?.titre}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => router.post(route('entreprise.candidatures.accepter', c.id))}
                                            className="px-2 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 font-semibold"
                                        >
                                            ✓
                                        </button>
                                        <button
                                            onClick={() => router.post(route('entreprise.candidatures.refuser', c.id))}
                                            className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 font-semibold"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stages avec statut convention */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-700">Stages en cours</h2>
                        <Link href={route('entreprise.index.stage')} className="text-xs text-amber-600 hover:text-amber-800 font-semibold">
                            Voir tout →
                        </Link>
                    </div>

                    {stages.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-4">Aucun stage en cours.</p>
                    ) : (
                        <div className="space-y-2">
                            {stages.slice(0, 4).map(stage => {
                                const cv = stage.convention_status;
                                return (
                                    <div key={stage.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div>
                                            <div className="text-sm font-medium text-slate-900">
                                                {stage.etudiant?.utilisateur?.prenom} {stage.etudiant?.utilisateur?.nom}
                                            </div>
                                            <div className="text-xs text-slate-500">{stage.sujet}</div>
                                        </div>
                                        {cv && (
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                cv.complete ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {cv.complete ? '✓ Convention' : '⏳ Convention'}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:col-span-2">
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">
                        Notifications récentes
                        {notifications.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {notifications.length}
                            </span>
                        )}
                    </h2>
                    {notifications.length === 0 ? (
                        <p className="text-sm text-slate-400">Aucune notification non lue.</p>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-2">
                            {notifications.map(n => (
                                <div key={n.id} className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-sm text-slate-700">{n.message}</p>
                                    <p className="text-xs text-slate-400 mt-1">{new Date(n.date_envoi).toLocaleDateString('fr-FR')}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Accès rapides */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Déposer une offre',   href: 'entreprise.index.offre',  icon: '➕' },
                    { label: 'Candidatures',         href: 'entreprise.candidatures', icon: '📨' },
                    { label: 'Mes stages',           href: 'entreprise.index.stage',  icon: '🎓' },
                    { label: 'Mes offres',           href: 'entreprise.index.offre',  icon: '📋' },
                ].map(item => (
                    <Link
                        key={item.href + item.label}
                        href={route(item.href)}
                        className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-amber-200 hover:shadow-md transition text-sm font-medium text-slate-700"
                    >
                        <span className="text-xl">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </div>
        </EntrepriseLayout>
    );
}
