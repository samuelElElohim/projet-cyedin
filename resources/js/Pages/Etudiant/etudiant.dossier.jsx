import EtudiantLayout from '@/Layouts/EtudiantLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function EtudiantDossier({ dossier, documents = [], stage, remarques = [] }) {
    const fileInputRef = useRef();
    const [showUpload, setShowUpload] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        fichier: null,
        nom: '',
        type: '',
    });

    function handleUpload(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fichier', data.fichier);
        if (data.nom) formData.append('nom', data.nom);
        if (data.type) formData.append('type', data.type);

        router.post(route('documents.store'), formData, {
            forceFormData: true,
            onSuccess: () => { reset(); setShowUpload(false); },
        });
    }

    function deleteDoc(id) {
        if (!confirm('Supprimer ce document ?')) return;
        router.delete(route('documents.destroy', id));
    }

    // Étapes de validation
    const etapes = [
        { label: 'Dossier créé',           done: !!dossier },
        { label: 'Documents déposés',       done: documents.length > 0 },
        { label: 'Convention signée',       done: stage?.convention
            ? stage.convention.signer_par_entreprise && stage.convention.signer_par_tuteur && stage.convention.signer_par_etudiant
            : false },
        { label: 'Dossier validé',          done: dossier?.est_valide ?? false },
    ];

    return (
        <EtudiantLayout title="Mon dossier de stage">
            <Head title="Dossier — Étudiant" />

            {/* Étapes */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
                <h2 className="text-sm font-semibold text-slate-700 mb-4">Suivi de validation</h2>
                <div className="flex items-center gap-2 flex-wrap">
                    {etapes.map((e, i) => (
                        <div key={e.label} className="flex items-center gap-2">
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${
                                e.done ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                                    e.done ? 'bg-green-500 text-white' : 'bg-slate-300 text-white'
                                }`}>
                                    {e.done ? '✓' : i + 1}
                                </span>
                                {e.label}
                            </div>
                            {i < etapes.length - 1 && (
                                <span className="text-slate-300 font-bold">→</span>
                            )}
                        </div>
                    ))}
                </div>

                {dossier?.est_valide && (
                    <div className="mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 font-medium">
                        🎉 Votre dossier a été validé !
                        {dossier.date_soumission && (
                            <span className="text-green-600 font-normal ml-2">
                                Soumis le {new Date(dossier.date_soumission).toLocaleDateString('fr-FR')}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Convention */}
            {stage?.convention && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
                    <h2 className="text-sm font-semibold text-slate-700 mb-3">Convention de stage</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Étudiant',   signed: stage.convention.signer_par_etudiant },
                            { label: 'Tuteur',     signed: stage.convention.signer_par_tuteur },
                            { label: 'Entreprise', signed: stage.convention.signer_par_entreprise },
                        ].map(p => (
                            <div key={p.label} className={`p-3 rounded-xl text-center text-sm font-semibold ${
                                p.signed ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                                <div className="text-xl mb-1">{p.signed ? '✅' : '⏳'}</div>
                                {p.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Documents */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-slate-700">
                        Documents déposés
                        <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{documents.length}</span>
                    </h2>
                    <button
                        onClick={() => setShowUpload(p => !p)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition"
                    >
                        {showUpload ? 'Annuler' : '+ Déposer'}
                    </button>
                </div>

                {/* Formulaire upload */}
                {showUpload && (
                    <form onSubmit={handleUpload} className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Fichier * (PDF, DOC, DOCX, JPG, PNG — max 10 Mo)</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={e => setData('fichier', e.target.files[0])}
                                required
                                className="w-full text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {errors.fichier && <p className="mt-1 text-xs text-red-600">{errors.fichier}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Nom du document</label>
                                <input type="text" value={data.nom} onChange={e => setData('nom', e.target.value)}
                                    placeholder="ex: Rapport de stage"
                                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                                <select value={data.type} onChange={e => setData('type', e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
                                    <option value="">— Choisir —</option>
                                    <option value="rapport">Rapport de stage</option>
                                    <option value="resume">Résumé</option>
                                    <option value="evaluation">Fiche d'évaluation</option>
                                    <option value="cv">CV</option>
                                    <option value="autre">Autre</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" disabled={processing}
                            className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
                            {processing ? 'Envoi…' : 'Déposer le document'}
                        </button>
                    </form>
                )}

                {documents.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">Aucun document déposé.</p>
                ) : (
                    <div className="space-y-2">
                        {documents.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{iconDoc(doc.type)}</span>
                                    <div>
                                        <div className="text-sm font-medium text-slate-800">{doc.nom}</div>
                                        <div className="text-xs text-slate-400">
                                            {doc.type && <span className="capitalize">{doc.type} · </span>}
                                            {new Date(doc.date_depot ?? doc.created_at).toLocaleDateString('fr-FR')}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <a href={route('documents.download', doc.id)}
                                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg hover:bg-blue-100 font-semibold transition">
                                        ↓
                                    </a>
                                    <button onClick={() => deleteDoc(doc.id)}
                                        className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-lg hover:bg-red-100 font-semibold transition">
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Remarques */}
            {remarques.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h2 className="text-sm font-semibold text-slate-700 mb-3">Remarques sur votre dossier</h2>
                    <div className="space-y-3">
                        {remarques.map(r => (
                            <div key={r.id} className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                <p className="text-sm text-slate-700">{r.contenu}</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {r.auteur?.nom} · {new Date(r.created_at).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </EtudiantLayout>
    );
}

function iconDoc(type) {
    const map = { rapport: '📄', resume: '📋', evaluation: '📊', cv: '👤', pdf: '📕' };
    return map[type] ?? '📄';
}
