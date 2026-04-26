import TuteurLayout from '@/Layouts/TuteurLayout';
import { Head, Link } from '@inertiajs/react';

export default function TuteurCahier({ stage, entrees = [] }) {
    const etudiant = stage?.etudiant?.utilisateur;

    const parMois = entrees.reduce((acc, e) => {
        const mois = new Date(e.date_entree).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        acc[mois] = acc[mois] ?? [];
        acc[mois].push(e);
        return acc;
    }, {});

    return (
        <TuteurLayout title={`Cahier — ${etudiant?.prenom ?? ''} ${etudiant?.nom ?? ''}`}>
            <Head title="Cahier de stage — Tuteur" />

            {/* Breadcrumb */}
            <Link href={route('tuteur.dashboard')} className="text-sm text-slate-500 hover:text-slate-800 mb-5 inline-flex items-center gap-1">
                ← Retour au tableau de bord
            </Link>

            {/* Infos stage */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-black">
                    {etudiant?.prenom?.[0] ?? '?'}
                </div>
                <div>
                    <div className="font-semibold text-slate-900 text-sm">
                        {etudiant?.prenom} {etudiant?.nom}
                    </div>
                    <div className="text-xs text-slate-500">
                        {stage?.sujet} · {stage?.entreprise?.nom_entreprise}
                    </div>
                </div>
                <span className="ml-auto px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                    {entrees.length} entrée{entrees.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Entrées */}
            {entrees.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <p className="text-3xl mb-2">📓</p>
                    Aucune entrée visible par le tuteur.
                </div>
            ) : Object.entries(parMois).map(([mois, items]) => (
                <div key={mois} className="mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 capitalize">{mois}</h3>
                    <div className="space-y-3">
                        {items.map(entree => (
                            <div key={entree.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs font-bold text-slate-500">
                                        {new Date(entree.date_entree).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </span>
                                    {entree.titre && (
                                        <span className="font-semibold text-slate-800 text-sm">— {entree.titre}</span>
                                    )}
                                    {entree.visible_jury && (
                                        <span className="ml-auto px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-semibold rounded-md">⚖️ Jury</span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{entree.contenu}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </TuteurLayout>
    );
}
