import EtudiantLayout from '@/Layouts/EtudiantLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function MonStage({ stage, cahier = [], missions = [] }) {
    const [tab, setTab] = useState('infos');

    const entrepriseMissions = missions.filter(m => m.auteur_role === 'E');
    const tuteurRemarques    = missions.filter(m => m.auteur_role === 'T');

    return (
        <EtudiantLayout title="Mon Stage">
            <Head title="Mon Stage" />

            {/* En-tête stage */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{stage.sujet}</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {stage.entreprise?.nom_entreprise} · {stage.duree_en_semaine} semaines
                            {stage.dateDebut && <> · Début {stage.dateDebut}</>}
                        </p>
                    </div>
                    <span className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-bold rounded-xl">
                        ✅ Stage actif
                    </span>
                </div>

                {/* Convention */}
                {stage.convention && (
                    <div className="mt-4 flex gap-2 flex-wrap">
                        {[
                            { label: 'Étudiant',   signed: stage.convention.signer_par_etudiant },
                            { label: 'Tuteur',     signed: stage.convention.signer_par_tuteur },
                            { label: 'Entreprise', signed: stage.convention.signer_par_entreprise },
                        ].map(p => (
                            <span key={p.label} className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                p.signed ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                                {p.signed ? '✓' : '○'} {p.label}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Onglets */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
                {[
                    { key: 'infos',    label: 'Infos',   icon: 'ℹ️' },
                    { key: 'cahier',   label: 'Cahier',  icon: '📓' },
                    { key: 'missions', label: 'Missions & Remarques', icon: '📋' },
                ].map(t => (
                    <button key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                            tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {tab === 'infos'    && <TabInfos stage={stage} />}
            {tab === 'cahier'   && <TabCahier cahier={cahier} />}
            {tab === 'missions' && <TabMissions entrepriseMissions={entrepriseMissions} tuteurRemarques={tuteurRemarques} />}
        </EtudiantLayout>
    );
}

// ── Infos ────────────────────────────────────────────────────────────────────

function TabInfos({ stage }) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <InfoCard title="Stage">
                <Row label="Sujet"  value={stage.sujet} />
                <Row label="Durée"  value={`${stage.duree_en_semaine} semaines`} />
                <Row label="Début"  value={stage.dateDebut ?? '—'} />
                <Row label="Statut" value="Actif" />
            </InfoCard>

            <InfoCard title="Entreprise">
                <Row label="Nom"     value={stage.entreprise?.nom_entreprise ?? '—'} />
                <Row label="Adresse" value={stage.entreprise?.addresse ?? '—'} />
            </InfoCard>

            {stage.tuteur?.utilisateur && (
                <InfoCard title="Tuteur">
                    <Row label="Nom"   value={`${stage.tuteur.utilisateur.prenom ?? ''} ${stage.tuteur.utilisateur.nom}`} />
                    <Row label="Email" value={stage.tuteur.utilisateur.email} />
                </InfoCard>
            )}
        </div>
    );
}

// ── Cahier ───────────────────────────────────────────────────────────────────

function TabCahier({ cahier }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        date_entree:    new Date().toISOString().split('T')[0],
        titre:          '',
        contenu:        '',
        visible_tuteur: true,
        visible_jury:   false,
    });

    function submit(e) {
        e.preventDefault();
        post(route('etudiant.cahier.store'), {
            onSuccess: () => reset(),
        });
    }

    function destroy(id) {
        if (!confirm('Supprimer cette entrée ?')) return;
        router.delete(route('etudiant.cahier.destroy', id));
    }

    return (
        <div className="space-y-6">
            {/* Formulaire */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-slate-700 mb-4">Nouvelle entrée</h2>
                <form onSubmit={submit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-slate-600">Date</label>
                            <input type="date" value={data.date_entree}
                                onChange={e => setData('date_entree', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600">Titre</label>
                            <input type="text" value={data.titre} placeholder="Titre optionnel"
                                onChange={e => setData('titre', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-600">Contenu *</label>
                        <textarea rows={4} value={data.contenu}
                            onChange={e => setData('contenu', e.target.value)}
                            placeholder="Ce que j'ai fait aujourd'hui…"
                            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
                        {errors.contenu && <p className="text-xs text-red-600 mt-1">{errors.contenu}</p>}
                    </div>
                    <div className="flex gap-4 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={data.visible_tuteur}
                                onChange={e => setData('visible_tuteur', e.target.checked)}
                                className="rounded" />
                            <span className="text-slate-600">Visible tuteur</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={data.visible_jury}
                                onChange={e => setData('visible_jury', e.target.checked)}
                                className="rounded" />
                            <span className="text-slate-600">Visible jury</span>
                        </label>
                    </div>
                    <button type="submit" disabled={processing}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
                        {processing ? 'Ajout…' : '+ Ajouter'}
                    </button>
                </form>
            </div>

            {/* Entrées */}
            {cahier.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">Aucune entrée pour l'instant.</p>
            ) : (
                <div className="space-y-3">
                    {cahier.map(entry => (
                        <div key={entry.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold text-slate-400">{entry.date_entree}</span>
                                        {entry.titre && <span className="text-sm font-semibold text-slate-800">{entry.titre}</span>}
                                        {entry.visible_tuteur && <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">tuteur</span>}
                                        {entry.visible_jury   && <span className="text-[10px] px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded">jury</span>}
                                    </div>
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{entry.contenu}</p>
                                </div>
                                <button onClick={() => destroy(entry.id)}
                                    className="text-slate-300 hover:text-red-500 text-lg transition shrink-0">✕</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Missions & Remarques ─────────────────────────────────────────────────────

function TabMissions({ entrepriseMissions, tuteurRemarques }) {
    return (
        <div className="space-y-6">
            {/* Missions entreprise */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-slate-700 mb-4">
                    Missions assignées par l'entreprise
                    <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                        {entrepriseMissions.length}
                    </span>
                </h2>
                {entrepriseMissions.length === 0 ? (
                    <p className="text-sm text-slate-400">Aucune mission pour l'instant.</p>
                ) : (
                    <div className="space-y-3">
                        {entrepriseMissions.map(m => (
                            <RemarqueCard key={m.id} item={m} couleur="amber" />
                        ))}
                    </div>
                )}
            </div>

            {/* Remarques tuteur */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-slate-700 mb-4">
                    Remarques du tuteur
                    <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                        {tuteurRemarques.length}
                    </span>
                </h2>
                {tuteurRemarques.length === 0 ? (
                    <p className="text-sm text-slate-400">Aucune remarque pour l'instant.</p>
                ) : (
                    <div className="space-y-3">
                        {tuteurRemarques.map(m => (
                            <RemarqueCard key={m.id} item={m} couleur="indigo" />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Composants utilitaires ───────────────────────────────────────────────────

function RemarqueCard({ item, couleur }) {
    const colors = {
        amber:  'bg-amber-50 border-amber-100',
        indigo: 'bg-indigo-50 border-indigo-100',
    };
    return (
        <div className={`p-4 rounded-xl border ${colors[couleur]}`}>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{item.contenu}</p>
            <p className="text-xs text-slate-400 mt-2">
                {item.auteur_nom} · {item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR') : ''}
            </p>
        </div>
    );
}

function InfoCard({ title, children }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{title}</h2>
            <dl className="space-y-2">{children}</dl>
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex gap-2 text-sm">
            <dt className="text-slate-400 w-20 shrink-0">{label}</dt>
            <dd className="font-medium text-slate-800">{value}</dd>
        </div>
    );
}
