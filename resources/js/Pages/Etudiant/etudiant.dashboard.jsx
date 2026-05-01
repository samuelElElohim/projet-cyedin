import EtudiantLayout from '@/Layouts/EtudiantLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function EtudiantDashboard({
    etudiant,
    stage_en_cours,
    convention_status,
    dossier,
    notifications = [],
    stats = {},
}) {
    const { etudiant_flags } = usePage().props;
    const hasStage           = etudiant_flags?.has_stage           ?? false;
    const conventionComplete = etudiant_flags?.convention_complete ?? false;
    const dossierValide      = etudiant_flags?.dossier_valide      ?? false;

    // Accès rapides conditionnels
    const quickLinks = [
        { label: 'Parcourir les offres',  href: 'etudiant.offres',           icon: '🔍', show: true },
        { label: 'Mes candidatures',      href: 'etudiant.candidatures',      icon: '📨', show: true },
        { label: 'Suggérer un secteur/tag', href: 'demande.hierarchie', icon: '💡', show: true },
        { label: 'Mon dossier complet',   href: 'etudiant.dossier',           icon: '📁', show: hasStage },
        { label: 'Cahier de stage',       href: 'etudiant.cahier',            icon: '📓', show: conventionComplete && dossierValide },
    ].filter(item => item.show);

    return (
        <EtudiantLayout title="Tableau de bord">
            <Head title="Dashboard — Étudiant" />

            {/* Profil rapide */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-black text-lg">
                    {etudiant?.utilisateur?.prenom?.[0] ?? '?'}
                </div>
                <div>
                    <div className="font-semibold text-slate-900">
                        {etudiant?.utilisateur?.prenom} {etudiant?.utilisateur?.nom}
                    </div>
                    <div className="text-xs text-slate-500">
                        Filière <span className="font-semibold text-blue-600">{etudiant?.filiere ?? '—'}</span>
                        {' · '}Niveau {etudiant?.niveau_etud ?? '—'}
                    </div>
                </div>
                {dossierValide && (
                    <span className="ml-auto px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                        ✓ Dossier validé
                    </span>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Candidatures',   value: stats.candidatures ?? 0,                             icon: '📨', href: 'etudiant.candidatures', color: 'blue' },
                    { label: 'Documents',      value: stats.documents ?? 0,                                icon: '📄', href: 'etudiant.dossier',      color: 'indigo', show: hasStage },
                    { label: 'Entrées cahier', value: stats.cahier ?? 0,                                   icon: '📓', href: 'etudiant.cahier',       color: 'violet', show: conventionComplete && dossierValide },
                    { label: 'Dossier',        value: dossierValide ? 'Validé' : 'En attente',             icon: '📁', href: 'etudiant.dossier',      color: dossierValide ? 'green' : 'amber', show: hasStage },
                ]
                    .filter(s => s.show !== false)
                    .map(s => (
                        <Link key={s.label} href={route(s.href)} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:border-blue-200 hover:shadow-md transition">
                            <div className="text-2xl mb-1">{s.icon}</div>
                            <div className="text-xl font-black text-slate-900">{s.value}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                        </Link>
                    ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* Stage en cours */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">Stage en cours</h2>
                    {!stage_en_cours ? (
                        <div className="text-sm text-slate-400 text-center py-4">
                            <p className="text-2xl mb-2">🎓</p>
                            Aucun stage enregistré.{' '}
                            <Link href={route('etudiant.offres')} className="text-blue-600 underline">
                                Consulter les offres
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div>
                                <div className="font-semibold text-slate-900">{stage_en_cours.sujet}</div>
                                <div className="text-sm text-slate-500">{stage_en_cours.entreprise?.nom_entreprise}</div>
                                <div className="text-xs text-slate-400 mt-1">
                                    Tuteur : {stage_en_cours.tuteur?.utilisateur?.nom ?? '—'} · {stage_en_cours.duree_en_semaine} semaines
                                </div>
                            </div>

                            {convention_status && (
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Convention</p>
                                    <div className="flex gap-2">
                                        {[
                                            { label: 'Entreprise', signed: convention_status.entreprise },
                                            { label: 'Tuteur',     signed: convention_status.tuteur },
                                            { label: 'Étudiant',   signed: convention_status.etudiant },
                                        ].map(p => (
                                            <span key={p.label} className={`flex-1 py-1.5 rounded-lg text-center text-xs font-semibold ${
                                                p.signed ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                {p.signed ? '✓' : '○'} {p.label}
                                            </span>
                                        ))}
                                    </div>
                                    {convention_status.complete && (
                                        <p className="mt-2 text-xs text-green-700 font-semibold">✓ Convention complète</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">
                        Notifications
                        {notifications.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {notifications.length}
                            </span>
                        )}
                    </h2>
                    {notifications.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-4">Aucune notification non lue.</p>
                    ) : (
                        <div className="space-y-2">
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
            {quickLinks.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {quickLinks.map(item => (
                        <Link
                            key={item.href + item.label}
                            href={route(item.href)}
                            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition text-sm font-medium text-slate-700"
                        >
                            <span className="text-xl">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </EtudiantLayout>
    );
}