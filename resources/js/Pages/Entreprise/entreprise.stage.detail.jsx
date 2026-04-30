import EntrepriseLayout from '@/Layouts/EntrepriseLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function EntrepriseStageDetail({ stage, convention_status, missions = [], remarques = [] }) {
    const etudiant = stage?.etudiant?.utilisateur;
    const [showMission, setShowMission] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({ contenu: '' });

    function submitMission(e) {
        e.preventDefault();
        post(route('entreprise.stage.mission', stage.id), {
            onSuccess: () => { reset(); setShowMission(false); },
        });
    }

    function signerConvention() {
        if (!confirm('Signer la convention de ce stage ?')) return;
        router.post(route('entreprise.convention.signer', stage.id));
    }

    return (
        <EntrepriseLayout title={`Stage — ${etudiant?.prenom ?? ''} ${etudiant?.nom ?? ''}`}>
            <Head title="Détail stage — Entreprise" />

            <Link href={route('entreprise.index.stage')} className="text-sm text-slate-500 hover:text-slate-800 mb-5 inline-flex items-center gap-1">
                ← Retour aux stages
            </Link>

            {/* Infos stage */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-black">
                        {etudiant?.prenom?.[0] ?? '?'}
                    </div>
                    <div>
                        <div className="font-semibold text-slate-900">{etudiant?.prenom} {etudiant?.nom}</div>
                        <div className="text-xs text-slate-500">{stage.sujet} · {stage.duree_en_semaine} semaines</div>
                        {stage.tuteur?.utilisateur && (
                            <div className="text-xs text-slate-400">Tuteur : {stage.tuteur.utilisateur.nom}</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* Convention */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">Convention de stage</h2>
                    {convention_status ? (
                        <>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {[
                                    { label: 'Entreprise', signed: convention_status.entreprise },
                                    { label: 'Tuteur',     signed: convention_status.tuteur },
                                    { label: 'Étudiant',   signed: convention_status.etudiant },
                                ].map(p => (
                                    <div key={p.label} className={`p-3 rounded-xl text-center text-xs font-semibold ${
                                        p.signed ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        <div className="text-lg mb-1">{p.signed ? '✅' : '⏳'}</div>
                                        {p.label}
                                    </div>
                                ))}
                            </div>
                            {!convention_status.entreprise && (
                                <button onClick={signerConvention}
                                    className="w-full py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition text-sm">
                                    ✍ Signer la convention
                                </button>
                            )}
                            {convention_status.complete && (
                                <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 font-medium text-center">
                                    ✓ Convention entièrement signée
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-sm text-slate-400">Pas encore de convention créée pour ce stage.</p>
                    )}
                </div>

                {/* Missions attribuées */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-700">
                            Missions attribuées
                            <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{missions.length}</span>
                        </h2>
                        <button onClick={() => setShowMission(p => !p)}
                            className="px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-xl hover:bg-amber-600 transition">
                            {showMission ? 'Annuler' : '+ Mission'}
                        </button>
                    </div>

                    {showMission && (
                        <form onSubmit={submitMission} className="mb-4 space-y-3">
                            <textarea
                                rows={3}
                                value={data.contenu}
                                onChange={e => setData('contenu', e.target.value)}
                                placeholder="Décrivez la mission à attribuer à l'étudiant…"
                                required
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-100 resize-none"
                            />
                            {errors.contenu && <p className="text-xs text-red-600">{errors.contenu}</p>}
                            <button type="submit" disabled={processing}
                                className="w-full py-2 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition disabled:opacity-60">
                                {processing ? 'Envoi…' : 'Attribuer la mission'}
                            </button>
                        </form>
                    )}

                    {missions.length === 0 && !showMission ? (
                        <p className="text-sm text-slate-400 text-center py-4">Aucune mission attribuée.</p>
                    ) : (
                        <div className="space-y-2">
                            {missions.map(m => (
                                <div key={m.id} className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                    <p className="text-sm text-slate-700">{m.contenu}</p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {new Date(m.created_at).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Remarques visibles par l'entreprise */}
            {remarques.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mt-6">
                    <h2 className="text-sm font-semibold text-slate-700 mb-3">Remarques sur ce stage</h2>
                    <div className="space-y-2">
                        {remarques.map(r => (
                            <div key={r.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                <p className="text-sm text-slate-700">{r.contenu}</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {r.auteur?.nom} · {new Date(r.created_at).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </EntrepriseLayout>
    );
}
