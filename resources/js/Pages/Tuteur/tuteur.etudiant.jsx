import TuteurLayout from '@/Layouts/TuteurLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function TuteurEtudiant({ stage, documents = [], remarques = [] }) {
    const etudiant = stage?.etudiant?.utilisateur;
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        cible_type:        'stage',
        cible_id:          stage?.id ?? '',
        contenu:           '',
        visible_etudiant:  true,
    });

    function submitRemarque(e) {
        e.preventDefault();
        post(route('tuteur.remarques.store'), {
            onSuccess: () => { reset('contenu'); setShowForm(false); },
        });
    }

    return (
        <TuteurLayout title={`Étudiant — ${etudiant?.prenom ?? ''} ${etudiant?.nom ?? ''}`}>
            <Head title="Étudiant — Tuteur" />

            <Link href={route('tuteur.dashboard')} className="text-sm text-slate-500 hover:text-slate-800 mb-5 inline-flex items-center gap-1">
                ← Retour
            </Link>

            {/* Infos stage */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-black">
                    {etudiant?.prenom?.[0] ?? '?'}
                </div>
                <div>
                    <div className="font-semibold text-slate-900 text-sm">{etudiant?.prenom} {etudiant?.nom}</div>
                    <div className="text-xs text-slate-500">{stage?.sujet} · {stage?.entreprise?.nom_entreprise} · {stage?.duree_en_semaine} sem.</div>
                </div>
                <Link
                    href={route('tuteur.cahier', { etudiantId: stage?.etudiants_id })}
                    className="ml-auto px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl hover:bg-blue-100 transition"
                >
                    📓 Voir cahier
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* Documents */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">
                        Documents déposés
                        <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{documents.length}</span>
                    </h2>
                    {documents.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-6">Aucun document déposé.</p>
                    ) : (
                        <div className="space-y-2">
                            {documents.map(doc => (
                                <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{iconDoc(doc.type)}</span>
                                        <div>
                                            <div className="text-sm font-medium text-slate-800">{doc.nom}</div>
                                            <div className="text-xs text-slate-400">
                                                {doc.type && <span className="capitalize">{doc.type} · </span>}
                                                {new Date(doc.date_depot ?? doc.created_at).toLocaleDateString('fr-FR')}
                                            </div>
                                        </div>
                                    </div>
                                    <a href={route('documents.download', doc.id)}
                                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg hover:bg-blue-100 font-semibold transition">
                                        ↓
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Remarques */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-700">
                            Remarques sur le stage
                            <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{remarques.length}</span>
                        </h2>
                        <button
                            onClick={() => setShowForm(p => !p)}
                            className="px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-xl hover:bg-teal-700 transition"
                        >
                            {showForm ? 'Annuler' : '+ Ajouter'}
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={submitRemarque} className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                            <textarea
                                rows={4}
                                value={data.contenu}
                                onChange={e => setData('contenu', e.target.value)}
                                placeholder="Votre remarque sur le stage…"
                                required
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 resize-none"
                            />
                            {errors.contenu && <p className="text-xs text-red-600">{errors.contenu}</p>}
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <input type="checkbox" checked={data.visible_etudiant}
                                    onChange={e => setData('visible_etudiant', e.target.checked)}
                                    className="rounded border-slate-300 text-teal-600" />
                                Visible par l'étudiant
                            </label>
                            <button type="submit" disabled={processing}
                                className="w-full py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition disabled:opacity-60">
                                {processing ? 'Envoi…' : 'Enregistrer'}
                            </button>
                        </form>
                    )}

                    {remarques.length === 0 && !showForm ? (
                        <p className="text-sm text-slate-400 text-center py-4">Aucune remarque.</p>
                    ) : (
                        <div className="space-y-2">
                            {remarques.map(r => (
                                <div key={r.id} className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                    <p className="text-sm text-slate-700">{r.contenu}</p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {r.auteur?.nom} · {new Date(r.created_at).toLocaleDateString('fr-FR')}
                                        {!r.est_visible_etudiant && (
                                            <span className="ml-2 px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded text-[10px]">Privée</span>
                                        )}
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

function iconDoc(type) {
    const map = { rapport: '📄', resume: '📋', evaluation: '📊', cv: '👤', pdf: '📕' };
    return map[type] ?? '📄';
}
