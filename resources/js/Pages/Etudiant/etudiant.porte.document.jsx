import EtudiantLayout from '@/Layouts/EtudiantLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useRef, useState } from 'react';

const CAT_LABELS = { cv: 'CV', lettre: 'Lettre de motivation', autre: 'Autre' };
const CAT_COLORS = {
    cv:     'bg-blue-50 text-blue-700',
    lettre: 'bg-violet-50 text-violet-700',
    autre:  'bg-gray-100 text-gray-600',
};

// ─── Upload zone ──────────────────────────────────────────────────────────────
function UploadZone({ onFile, accept = '.pdf,.doc,.docx', hint = 'PDF, Word · 10 Mo max' }) {
    const ref = useRef();
    return (
        <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition group">
            <span className="text-sm text-slate-400 group-hover:text-blue-500">
                Glisser ou <span className="font-semibold underline">parcourir</span>
            </span>
            <span className="text-xs text-slate-300 mt-0.5">{hint}</span>
            <input ref={ref} type="file" accept={accept} className="hidden"
                onChange={e => { onFile(e.target.files[0]); ref.current.value = ''; }} />
        </label>
    );
}

// ─── Section CV principal ──────────────────────────────────────────────────────
function MainCvSection({ etudiant }) {
    const { data, setData, post, processing, errors } = useForm({ fichier: null });
    const fileRef = useRef();

    function submit(e) {
        e.preventDefault();
        post(route('documents.store-main-cv'), { forceFormData: true });
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-1">CV principal</h2>
            <p className="text-xs text-slate-400 mb-4">
                Ce CV est utilisé par défaut lors d'une candidature. Vous pouvez aussi définir n'importe quel doc du stash comme CV principal.
            </p>

            {etudiant?.chemin_cv ? (
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl mb-4">
                    <span className="text-2xl">📄</span>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-blue-800 truncate">{etudiant.nom_cv}</p>
                        <p className="text-xs text-blue-500">CV actuel</p>
                    </div>
                    <a href={route('documents.download', { document: 'main' })}
                        className="text-xs text-blue-600 hover:underline hidden">Télécharger</a>
                </div>
            ) : (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-4">
                    Aucun CV principal défini. Ajoutez-en un ci-dessous ou depuis votre stash.
                </p>
            )}

            <form onSubmit={submit} className="space-y-3">
                {data.fichier ? (
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-700 flex-1 truncate">{data.fichier.name}</span>
                        <button type="button" onClick={() => setData('fichier', null)}
                            className="text-slate-400 hover:text-red-500 text-lg leading-none">×</button>
                    </div>
                ) : (
                    <UploadZone onFile={f => setData('fichier', f)} hint="PDF ou Word · 10 Mo max" />
                )}
                {errors.fichier && <p className="text-xs text-red-500">{errors.fichier}</p>}
                <button type="submit" disabled={processing || !data.fichier}
                    className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 transition">
                    {processing ? 'Envoi…' : etudiant?.chemin_cv ? 'Remplacer le CV principal' : 'Définir comme CV principal'}
                </button>
            </form>
        </div>
    );
}

// ─── Section stash ────────────────────────────────────────────────────────────
function StashSection({ stash, maxDocs }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        fichier: null, nom: '', categorie: 'cv',
    });
    const [showForm, setShowForm] = useState(false);
    const remaining = maxDocs - stash.length;

    function submit(e) {
        e.preventDefault();
        post(route('documents.store'), {
            forceFormData: true,
            onSuccess: () => { reset(); setShowForm(false); },
        });
    }

    function deleteDoc(id) {
        if (!confirm('Supprimer ce document ?')) return;
        router.delete(route('documents.destroy', id));
    }

    function setMain(id) {
        router.post(route('documents.set-main-cv', id));
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-800">Stash de documents</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {stash.length}/{maxDocs} document{stash.length !== 1 ? 's' : ''}
                    </p>
                </div>
                {remaining > 0 && (
                    <button onClick={() => setShowForm(p => !p)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition">
                        {showForm ? 'Annuler' : '+ Ajouter'}
                    </button>
                )}
            </div>

            {/* Formulaire upload stash */}
            {showForm && (
                <form onSubmit={submit} className="space-y-3 mb-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex gap-2">
                        {[['cv', 'CV'], ['lettre', 'Lettre'], ['autre', 'Autre']].map(([v, l]) => (
                            <label key={v} className={`flex-1 text-center cursor-pointer py-1.5 rounded-lg text-xs font-semibold border transition ${
                                data.categorie === v ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}>
                                <input type="radio" value={v} checked={data.categorie === v}
                                    onChange={() => setData('categorie', v)} className="hidden" />
                                {l}
                            </label>
                        ))}
                    </div>
                    <input type="text" value={data.nom} onChange={e => setData('nom', e.target.value)}
                        placeholder="Nom du document (optionnel)"
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    {data.fichier ? (
                        <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg">
                            <span className="text-sm text-slate-700 flex-1 truncate">{data.fichier.name}</span>
                            <button type="button" onClick={() => setData('fichier', null)}
                                className="text-slate-400 hover:text-red-500 text-lg">×</button>
                        </div>
                    ) : (
                        <UploadZone onFile={f => setData('fichier', f)} />
                    )}
                    {errors.fichier && <p className="text-xs text-red-500">{errors.fichier}</p>}
                    <button type="submit" disabled={processing || !data.fichier}
                        className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 transition">
                        {processing ? 'Envoi…' : 'Ajouter au stash'}
                    </button>
                </form>
            )}

            {/* Liste des docs */}
            {stash.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-8">Votre stash est vide.</p>
            ) : (
                <div className="space-y-2">
                    {stash.map(doc => (
                        <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xl shrink-0">
                                {doc.categorie === 'cv' ? '👤' : doc.categorie === 'lettre' ? '✉️' : '📄'}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-800 truncate">{doc.nom}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${CAT_COLORS[doc.categorie] ?? CAT_COLORS.autre}`}>
                                        {CAT_LABELS[doc.categorie] ?? doc.categorie}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        {new Date(doc.date_depot).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                                <a href={route('documents.download', doc.id)}
                                    className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg hover:bg-slate-200 transition">
                                    ↓
                                </a>
                                {doc.categorie === 'cv' && (
                                    <button onClick={() => setMain(doc.id)}
                                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg hover:bg-blue-100 transition whitespace-nowrap">
                                        → Principal
                                    </button>
                                )}
                                <button onClick={() => deleteDoc(doc.id)}
                                    className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-lg hover:bg-red-100 transition">
                                    🗑
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {remaining === 0 && (
                <p className="text-center text-xs text-amber-600 mt-4 bg-amber-50 rounded-lg py-2">
                    Limite atteinte ({maxDocs} docs). Supprimez-en un pour en ajouter un nouveau.
                </p>
            )}
        </div>
    );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function EtudiantPorteDocument({ etudiant, stash = [], max_docs = 4 }) {
    return (
        <EtudiantLayout title="Porte-document">
            <Head title="Porte-document" />
            <div className="max-w-2xl space-y-6">
                <MainCvSection etudiant={etudiant} />
                <StashSection stash={stash} maxDocs={max_docs} />
            </div>
        </EtudiantLayout>
    );
}
