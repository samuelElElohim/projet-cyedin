import JuryLayout from '@/Layouts/JuryLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function JuryDossierDetail({ dossier, stage, remarques = [], cahier = [], missions = [] }) {
    const etudiant = dossier?.etudiant?.utilisateur;
    const [showRemarque, setShowRemarque] = useState(false);
    const [activeTab, setActiveTab] = useState('documents');

    const { data, setData, post, processing, errors, reset } = useForm({
        cible_type:       'dossier_stage',
        cible_id:         dossier?.id ?? '',
        contenu:          '',
        visible_etudiant: true,
    });

    function submitRemarque(e) {
        e.preventDefault();
        post(route('jury.remarque.store'), {
            onSuccess: () => { reset('contenu'); setShowRemarque(false); },
        });
    }

    function valider() {
        if (!confirm('Valider définitivement ce dossier ?')) return;
        router.post(route('jury.dossier.valider', dossier.id));
    }

    function invalider() {
        if (!confirm('Retourner ce dossier à l\'étudiant ?')) return;
        router.post(route('jury.dossier.invalider', dossier.id));
    }

    const cahierParMois = cahier.reduce((acc, e) => {
        const mois = new Date(e.date_entree).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        acc[mois] = acc[mois] ?? [];
        acc[mois].push(e);
        return acc;
    }, {});

    return (
        <JuryLayout title={`Dossier — ${etudiant?.prenom ?? ''} ${etudiant?.nom ?? ''}`}>
            <Head title="Dossier — Jury" />

            <Link href={route('jury.index.dossiers')} className="text-sm text-slate-500 hover:text-slate-800 mb-5 inline-flex items-center gap-1">
                ← Retour aux dossiers
            </Link>

            {/* Header étudiant + statut */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 font-black text-lg">
                    {etudiant?.prenom?.[0] ?? '?'}
                </div>
                <div className="flex-1">
                    <div className="font-semibold text-slate-900">{etudiant?.prenom} {etudiant?.nom}</div>
                    <div className="text-xs text-slate-500">
                        {dossier?.etudiant?.filiere ?? '—'}
                        {stage && <span className="ml-2">· {stage.sujet} · {stage.entreprise?.nom_entreprise}</span>}
                        {stage?.tuteur?.utilisateur && (
                            <span className="ml-2 text-teal-600 font-medium">
                                · Tuteur : {stage.tuteur.utilisateur.prenom} {stage.tuteur.utilisateur.nom}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 shrink-0">
                    {dossier?.est_valide ? (
                        <>
                            <span className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-bold rounded-xl">✓ Validé</span>
                            <button onClick={invalider}
                                className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-xl hover:bg-red-100 transition">
                                Retourner
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-xl">⏳ En attente</span>
                            <button onClick={valider}
                                className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-xl hover:bg-green-700 transition">
                                ✓ Valider
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6 flex-wrap">
                {[
                    { id: 'documents', label: `Documents (${dossier?.documents?.length ?? 0})`,  icon: '📄' },
                    { id: 'missions',  label: `Missions tuteur (${missions.length})`,             icon: '📌' },
                    { id: 'cahier',    label: `Cahier (${cahier.length})`,                        icon: '📓' },
                    { id: 'remarques', label: `Remarques (${remarques.length})`,                  icon: '💬' },
                ].map(tab => (
                    <button key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
                            activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab: Documents */}
            {activeTab === 'documents' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    {(!dossier?.documents || dossier.documents.length === 0) ? (
                        <p className="text-sm text-slate-400 text-center py-8">Aucun document déposé.</p>
                    ) : (
                        <div className="space-y-2">
                            {dossier.documents.map(doc => (
                                <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{iconDoc(doc.type)}</span>
                                        <div>
                                            <div className="text-sm font-medium text-slate-800">{doc.nom}</div>
                                            <div className="text-xs text-slate-400 capitalize">{doc.type}</div>
                                        </div>
                                    </div>
                                    <a href={route('documents.download', doc.id)}
                                        className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-lg hover:bg-purple-100 font-semibold transition">
                                        ↓ Télécharger
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Tab: Missions tuteur */}
            {activeTab === 'missions' && (
                <div className="space-y-3">
                    {missions.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center text-slate-400">
                            <p className="text-3xl mb-2">📌</p>
                            Aucune mission affectée par le tuteur.
                        </div>
                    ) : (
                        <>
                            <p className="text-xs text-slate-400 mb-2">
                                Missions affectées par{' '}
                                <span className="font-semibold text-teal-600">
                                    {stage?.tuteur?.utilisateur?.prenom} {stage?.tuteur?.utilisateur?.nom}
                                </span>{' '}
                                à l'étudiant dans le cadre de ce stage.
                            </p>
                            {missions.map((m, i) => (
                                <div key={m.id} className="bg-white rounded-2xl border border-teal-100 shadow-sm p-5">
                                    <div className="flex items-start gap-3">
                                        <span className="shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-black flex items-center justify-center">
                                            {i + 1}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-700 leading-relaxed">{m.contenu}</p>
                                            <p className="text-xs text-slate-400 mt-2">
                                                Affectée le {new Date(m.created_at).toLocaleDateString('fr-FR', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}

            {/* Tab: Cahier */}
            {activeTab === 'cahier' && (
                <div className="space-y-6">
                    {cahier.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center text-slate-400">
                            <p className="text-3xl mb-2">📓</p>
                            Aucune entrée du cahier visible par le jury.
                        </div>
                    ) : Object.entries(cahierParMois).map(([mois, items]) => (
                        <div key={mois}>
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
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{entree.contenu}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tab: Remarques */}
            {activeTab === 'remarques' && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button onClick={() => setShowRemarque(p => !p)}
                            className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition">
                            {showRemarque ? 'Annuler' : '+ Ajouter une remarque'}
                        </button>
                    </div>

                    {showRemarque && (
                        <form onSubmit={submitRemarque} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                            <textarea
                                rows={4}
                                value={data.contenu}
                                onChange={e => setData('contenu', e.target.value)}
                                placeholder="Votre remarque sur le dossier…"
                                required
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none"
                            />
                            {errors.contenu && <p className="text-xs text-red-600">{errors.contenu}</p>}
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <input type="checkbox" checked={data.visible_etudiant}
                                    onChange={e => setData('visible_etudiant', e.target.checked)}
                                    className="rounded border-slate-300 text-purple-600" />
                                Visible par l'étudiant
                            </label>
                            <button type="submit" disabled={processing}
                                className="w-full py-2 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition disabled:opacity-60">
                                {processing ? 'Envoi…' : 'Enregistrer'}
                            </button>
                        </form>
                    )}

                    {remarques.length === 0 && !showRemarque ? (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center text-slate-400">
                            Aucune remarque pour ce dossier.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {remarques.map(r => (
                                <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                                    <p className="text-sm text-slate-700">{r.contenu}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs text-slate-400">
                                            {r.auteur?.nom} · {new Date(r.created_at).toLocaleDateString('fr-FR')}
                                        </span>
                                        {!r.est_visible_etudiant && (
                                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-semibold">Privée</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </JuryLayout>
    );
}

function iconDoc(type) {
    const map = { rapport: '📄', resume: '📋', evaluation: '📊', cv: '👤', pdf: '📕' };
    return map[type] ?? '📄';
}