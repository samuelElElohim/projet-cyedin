import TuteurLayout from '@/Layouts/TuteurLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function TuteurEtudiant({ stage, documents = [], remarques = [] }) {
    const etudiant = stage?.etudiant?.utilisateur;
    const [showRemarque, setShowRemarque] = useState(false);
    const [showUpload, setShowUpload]     = useState(false);
    const fileInputRef = useRef();

    // ── Remarque ──────────────────────────────────────────────────────────────
    const remarqueForm = useForm({
        cible_type:       'stage',
        cible_id:         stage?.id ?? '',
        contenu:          '',
        visible_etudiant: true,
    });

    function submitRemarque(e) {
        e.preventDefault();
        remarqueForm.post(route('tuteur.remarques.store'), {
            onSuccess: () => { remarqueForm.reset('contenu'); setShowRemarque(false); },
        });
    }

    // ── Upload rapport ────────────────────────────────────────────────────────
    const uploadForm = useForm({ fichier: null, nom: '', type: 'rapport' });

    function handleUpload(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fichier', uploadForm.data.fichier);
        formData.append('nom', uploadForm.data.nom || 'Rapport tuteur');
        formData.append('type', 'rapport');

        router.post(route('documents.store'), formData, {
            forceFormData: true,
            onSuccess: () => { uploadForm.reset(); setShowUpload(false); },
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
                    <div className="text-xs text-slate-500">
                        {stage?.sujet} · {stage?.entreprise?.nom_entreprise} · {stage?.duree_en_semaine} sem.
                    </div>
                </div>
                <Link
                    href={route('tuteur.cahier', { etudiantId: stage?.etudiants_id })}
                    className="ml-auto px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl hover:bg-blue-100 transition"
                >
                    📓 Cahier de stage
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* ── Documents de l'étudiant ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">
                        Documents de l'étudiant
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
                                    <a
                                        href={route('documents.download', doc.id)}
                                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg hover:bg-blue-100 font-semibold transition"
                                    >
                                        ↓ Télécharger
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Dépôt rapport tuteur ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-700">Déposer un rapport</h2>
                        <button
                            onClick={() => setShowUpload(p => !p)}
                            className="px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-xl hover:bg-teal-700 transition"
                        >
                            {showUpload ? 'Annuler' : '+ Déposer'}
                        </button>
                    </div>

                    {showUpload && (
                        <form onSubmit={handleUpload} className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Fichier * (PDF, DOC, DOCX — max 10 Mo)
                                </label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept=".pdf,.doc,.docx"
                                    onChange={e => uploadForm.setData('fichier', e.target.files[0])}
                                    required
                                    className="w-full text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Intitulé</label>
                                <input
                                    type="text"
                                    value={uploadForm.data.nom}
                                    onChange={e => uploadForm.setData('nom', e.target.value)}
                                    placeholder="ex: Rapport d'évaluation tuteur"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={uploadForm.processing}
                                className="w-full py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition disabled:opacity-60"
                            >
                                {uploadForm.processing ? 'Envoi…' : 'Déposer le rapport'}
                            </button>
                        </form>
                    )}
                    <p className="text-xs text-slate-400 mt-3">
                        Le rapport sera enregistré dans vos documents personnels.
                    </p>
                </div>
            </div>

            {/* ── Remarques sur le stage ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-slate-700">
                        Remarques sur le stage
                        <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{remarques.length}</span>
                    </h2>
                    <button
                        onClick={() => setShowRemarque(p => !p)}
                        className="px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-xl hover:bg-amber-600 transition"
                    >
                        {showRemarque ? 'Annuler' : '+ Ajouter une remarque'}
                    </button>
                </div>

                {showRemarque && (
                    <form onSubmit={submitRemarque} className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                        <textarea
                            rows={4}
                            value={remarqueForm.data.contenu}
                            onChange={e => remarqueForm.setData('contenu', e.target.value)}
                            placeholder="Votre remarque sur l'avancement du stage…"
                            required
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-100 resize-none"
                        />
                        {remarqueForm.errors.contenu && (
                            <p className="text-xs text-red-600">{remarqueForm.errors.contenu}</p>
                        )}
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={remarqueForm.data.visible_etudiant}
                                onChange={e => remarqueForm.setData('visible_etudiant', e.target.checked)}
                                className="rounded border-slate-300 text-teal-600"
                            />
                            Visible par l'étudiant
                        </label>
                        <button
                            type="submit"
                            disabled={remarqueForm.processing}
                            className="w-full py-2 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition disabled:opacity-60"
                        >
                            {remarqueForm.processing ? 'Envoi…' : 'Enregistrer la remarque'}
                        </button>
                    </form>
                )}

                {remarques.length === 0 && !showRemarque ? (
                    <p className="text-sm text-slate-400 text-center py-4">Aucune remarque pour ce stage.</p>
                ) : (
                    <div className="space-y-2">
                        {remarques.map(r => (
                            <div key={r.id} className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                <p className="text-sm text-slate-700">{r.contenu}</p>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                    <span>{r.auteur?.nom} · {new Date(r.created_at).toLocaleDateString('fr-FR')}</span>
                                    {!r.est_visible_etudiant && (
                                        <span className="px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded text-[10px]">Privée</span>
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </TuteurLayout>
    );
}

function iconDoc(type) {
    const map = { rapport: '📄', resume: '📋', evaluation: '📊', cv: '👤', pdf: '📕' };
    return map[type] ?? '📄';
}