import EtudiantLayout from '@/Layouts/EtudiantLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useRef } from 'react';

export default function EtudiantOffres({ offres = [], deja_candidature = {}, secteurs = [], filieres = [], tags = [], filters = {}, etudiant = null, stash = [] }) {
    
    const [search, setSearch]       = useState(filters.search ?? '');
    const [dureeMin, setDureeMin]   = useState(filters.duree_min ?? '');
    const [dureeMax, setDureeMax]   = useState(filters.duree_max ?? '');
    const [filiereId, setFiliereId] = useState(filters.filiere_id ?? '');
    const [secteurId, setSecteurId] = useState(filters.secteur_id ?? '');
    const [tagId, setTagId]         = useState(filters.tag_id ?? '');
    const [modalOffre, setModalOffre]         = useState(null);
    const [showNoTuteurModal, setShowNoTuteurModal] = useState(false);

    const hasStage  = usePage().props.etudiant_flags?.has_stage ?? false;
    const hasTuteur = etudiant?.has_tuteur ?? true;

    // Tags filtrés selon le secteur sélectionné
    const tagsVisible = secteurId
        ? tags.filter(t => String(t.secteur_id) === String(secteurId))
        : tags;

  

    function applyFilters(overrides = {}) {
        router.get(route('etudiant.offres'), {
            search:     overrides.search     ?? search,
            duree_min:  overrides.duree_min  ?? dureeMin,
            duree_max:  overrides.duree_max  ?? dureeMax,
            filiere_id: overrides.filiere_id ?? filiereId,
            secteur_id: overrides.secteur_id ?? secteurId,
            tag_id:     overrides.tag_id     ?? tagId,
        }, { preserveState: true, replace: true });
    }

    return (
        <EtudiantLayout title="Offres de stage">
            <Head title="Offres — Étudiant" />



            {hasStage && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-2xl mb-5 text-sm">
                    Vous avez déjà un stage en cours — les nouvelles candidatures sont désactivées.
                </div>
            )}
 
            {/* Filtres */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
                <div className="flex flex-wrap gap-3">
                    <input
                        type="text"
                        placeholder="Rechercher une offre…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilters()}
                        className="flex-1 min-w-48 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                    />

                    {/* Filière */}
                    <select
                        value={filiereId}
                        onChange={e => { setFiliereId(e.target.value); applyFilters({ filiere_id: e.target.value }); }}
                        className="border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                    >
                        <option value="">Toutes les filières</option>
                        {filieres.map(f => <option key={f.id} value={f.id}>{f.filiere}</option>)}
                    </select>

                    {/* Secteur */}
                    <select
                        value={secteurId}
                        onChange={e => { setSecteurId(e.target.value); setTagId(''); applyFilters({ secteur_id: e.target.value, tag_id: '' }); }}
                        className="border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                    >
                        <option value="">Tous les secteurs</option>
                        {secteurs.map(s => <option key={s.id} value={s.id}>{s.filiere?.filiere} / {s.secteur}</option>)}
                    </select>

                    {/* Tag */}
                    <select
                        value={tagId}
                        onChange={e => { setTagId(e.target.value); applyFilters({ tag_id: e.target.value }); }}
                        className="border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                    >
                        <option value="">Tous les tags</option>
                        {tagsVisible.map(t => <option key={t.id} value={t.id}>{t.tag}</option>)}
                    </select>

                    <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-500 whitespace-nowrap">Durée (sem.)</label>
                        <input type="number" min="1" placeholder="min" value={dureeMin}
                            onChange={e => setDureeMin(e.target.value)}
                            className="w-16 border border-slate-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
                        <span className="text-slate-300">—</span>
                        <input type="number" min="1" placeholder="max" value={dureeMax}
                            onChange={e => setDureeMax(e.target.value)}
                            className="w-16 border border-slate-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
                    </div>

                    <button onClick={() => applyFilters()}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition">
                        Filtrer
                    </button>
                    <button onClick={() => {
                        setSearch(''); setDureeMin(''); setDureeMax('');
                        setSecteurId(''); setFiliereId(''); setTagId('');
                        router.get(route('etudiant.offres'), {}, { replace: true });
                    }} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-xl hover:bg-slate-200 transition">
                        Réinitialiser
                    </button>
                </div>
            </div>

            <p className="text-sm text-slate-500 mb-4">{offres.length} offre{offres.length !== 1 ? 's' : ''} disponible{offres.length !== 1 ? 's' : ''}</p>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {offres.length === 0 ? (
                    <div className="col-span-full text-center py-16 text-slate-400">
                        <p className="text-3xl mb-2">🔍</p>
                        Aucune offre ne correspond à votre recherche.
                    </div>
                ) : offres.map(offre => {
                    const statut = deja_candidature[offre.id];
                    return (
                        <div key={offre.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col hover:border-blue-200 hover:shadow-md transition">
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <div>
                                    <h3 className="font-semibold text-slate-900 text-sm">{offre.titre}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{offre.entreprise?.nom_entreprise}</p>
                                </div>
                                <span className="shrink-0 px-2 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg border border-slate-100">
                                    {offre.duree_semaines} sem.
                                </span>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed flex-1 line-clamp-3 mb-4">
                                {offre.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {offre.secteur && (
                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wide rounded-md">
                                        {offre.secteur.filiere?.filiere} / {offre.secteur.secteur}
                                    </span>
                                )}
                                {offre.tags?.map(t => (
                                    <span key={t.id} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-full">
                                        {t.tag}
                                    </span>
                                ))}
                            </div>

                            {statut === 'acceptee' ? (
                                <span className="w-full py-2 bg-green-100 text-green-800 text-xs font-bold rounded-xl text-center">✓ Candidature acceptée</span>
                            ) : statut === 'accepted_pending_choice' ? (
                                <span className="w-full py-2 bg-blue-100 text-blue-800 text-xs font-bold rounded-xl text-center">🎉 Acceptée — en attente de votre confirmation</span>
                            ) : statut === 'refusee' ? (
                                <span className="w-full py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center">✗ Candidature refusée</span>
                            ) : statut === 'en_attente' ? (
                                <span className="w-full py-2 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl text-center">⏳ Candidature en attente</span>
                            ) : hasStage ? (
                                // ✅ Ajout : cas où l'étudiant a déjà un stage
                                <span className="w-full py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl text-center block cursor-not-allowed">
                                    Candidature désactivée
                                </span>
                            ) : (
                                <button
                                    onClick={() => hasTuteur ? setModalOffre(offre) : setShowNoTuteurModal(true)}
                                    className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
                                >
                                    Postuler
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {modalOffre && (
                <CandidatureModal
                    offre={modalOffre}
                    etudiant={etudiant}
                    stash={stash}
                    onClose={() => setModalOffre(null)}
                />
            )}

            {showNoTuteurModal && (
                <NoTuteurModal onClose={() => setShowNoTuteurModal(false)} />
            )}
        </EtudiantLayout>
    );
}


function NoTuteurModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10 mx-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mx-auto mb-4">
                    🎓
                </div>
                <h2 className="text-base font-semibold text-slate-900 mb-2">Tuteur non assigné</h2>
                <p className="text-sm text-slate-500 mb-5">
                    Vous devez avoir un tuteur académique assigné avant de pouvoir postuler à une offre. Contactez votre administration.
                </p>
                <button
                    onClick={onClose}
                    className="w-full py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition"
                >
                    Compris
                </button>
            </div>
        </div>
    );
}

// Mode CV : 'main' | 'stash' | 'nouveau'
// Mode lettre : 'aucune' | 'stash' | 'fichier' | 'texte'
function CandidatureModal({ offre, etudiant, stash = [], onClose }) {
    const cvFileRef     = useRef(null);
    const lettreFileRef = useRef(null);
    const [cvMode, setCvMode]           = useState(etudiant?.chemin_cv ? 'main' : 'nouveau');
    const [cvDocId, setCvDocId]         = useState('');
    const [cvFile, setCvFile]           = useState(null);
    const [lettreMode, setLettreMode]   = useState('aucune');
    const [lettreDocId, setLettreDocId] = useState('');
    const [lettreFile, setLettreFile]   = useState(null);

    const { data, setData, processing, errors, reset } = useForm({
        offre_id:          offre.id,
        lettre_motivation: '',
    });

    const cvDocs  = stash.filter(d => d.categorie === 'cv');
    const allDocs = stash.filter(d => d.categorie !== 'cv');

    const canSubmit = cvMode === 'main'
        || (cvMode === 'stash' && cvDocId)
        || (cvMode === 'nouveau' && cvFile);

    function submit(e) {
        e.preventDefault();
        const fd = new FormData();
        fd.append('offre_id', offre.id);
        fd.append('lettre_motivation', data.lettre_motivation);

        if (cvMode === 'main')    { fd.append('use_main_cv', '1'); }
        else if (cvMode === 'stash')   { fd.append('cv_document_id', cvDocId); }
        else if (cvMode === 'nouveau' && cvFile) { fd.append('cv', cvFile); }

        if (lettreMode === 'stash' && lettreDocId) { fd.append('lettre_document_id', lettreDocId); }
        if (lettreMode === 'fichier' && lettreFile) { fd.append('lettre_fichier', lettreFile); }

        router.post(route('etudiant.candidatures.store'), fd, {
            forceFormData: true,
            onSuccess: () => { reset(); onClose(); },
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 mx-4 max-h-[90vh] overflow-y-auto">

                <h2 className="text-base font-semibold text-slate-900 mb-1">Postuler</h2>
                <p className="text-sm text-slate-500 mb-5">
                    <strong>{offre.titre}</strong> — {offre.entreprise?.nom_entreprise}
                </p>

                <form onSubmit={submit} className="space-y-5">

                    {/* ── CV (obligatoire) ─────────────────────────────────── */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">CV *</label>
                        <div className="space-y-2">
                            {/* Option : CV principal */}
                            {etudiant?.chemin_cv && (
                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                                    cvMode === 'main' ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                                }`}>
                                    <input type="radio" checked={cvMode === 'main'} onChange={() => setCvMode('main')} className="shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">CV principal</p>
                                        <p className="text-xs text-slate-400">{etudiant.nom_cv}</p>
                                    </div>
                                </label>
                            )}

                            {/* Option : depuis le stash */}
                            {cvDocs.length > 0 && (
                                <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                                    cvMode === 'stash' ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                                }`}>
                                    <input type="radio" checked={cvMode === 'stash'} onChange={() => setCvMode('stash')} className="shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-800 mb-1.5">Documents récents</p>
                                        {cvMode === 'stash' && (
                                            <select value={cvDocId} onChange={e => setCvDocId(e.target.value)}
                                                className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                                                <option value="">— Choisir un CV —</option>
                                                {cvDocs.map(d => (
                                                    <option key={d.id} value={d.id}>{d.nom}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </label>
                            )}

                            {/* Option : nouveau fichier */}
                            <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                                cvMode === 'nouveau' ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                            }`}>
                                <input type="radio" checked={cvMode === 'nouveau'} onChange={() => setCvMode('nouveau')} className="shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-800 mb-1.5">Nouveau fichier</p>
                                    {cvMode === 'nouveau' && (
                                        cvFile ? (
                                            <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg">
                                                <span className="text-xs text-slate-700 flex-1 truncate">{cvFile.name}</span>
                                                <button type="button" onClick={() => { setCvFile(null); cvFileRef.current.value = ''; }}
                                                    className="text-slate-400 hover:text-red-500 text-lg leading-none">×</button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center h-16 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-white transition">
                                                <span className="text-xs text-slate-400">PDF, Word, JPG · 5 Mo max</span>
                                                <input ref={cvFileRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden"
                                                    onChange={e => setCvFile(e.target.files[0])} />
                                            </label>
                                        )
                                    )}
                                </div>
                            </label>
                        </div>
                        {errors.cv && <p className="mt-1 text-xs text-red-600">{errors.cv}</p>}
                    </div>

                    {/* ── Lettre (optionnel) ────────────────────────────────── */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Lettre de motivation <span className="font-normal text-slate-400">(optionnel)</span>
                        </label>
                        <div className="space-y-2">

                            {/* Aucune */}
                            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                                lettreMode === 'aucune' ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                            }`}>
                                <input type="radio" checked={lettreMode === 'aucune'} onChange={() => setLettreMode('aucune')} />
                                <span className="text-sm text-slate-700">Aucune</span>
                            </label>

                            {/* Depuis mes documents enregistrés */}
                            {allDocs.length > 0 && (
                                <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                                    lettreMode === 'stash' ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                                }`}>
                                    <input type="radio" checked={lettreMode === 'stash'} onChange={() => setLettreMode('stash')} className="shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-800 mb-1.5">Depuis mes documents</p>
                                        {lettreMode === 'stash' && (
                                            <select value={lettreDocId} onChange={e => setLettreDocId(e.target.value)}
                                                className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                                                <option value="">— Choisir —</option>
                                                {allDocs.map(d => <option key={d.id} value={d.id}>{d.nom}</option>)}
                                            </select>
                                        )}
                                    </div>
                                </label>
                            )}

                            {/* Nouveau fichier */}
                            <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                                lettreMode === 'fichier' ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                            }`}>
                                <input type="radio" checked={lettreMode === 'fichier'} onChange={() => setLettreMode('fichier')} className="shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-800 mb-1.5">Déposer un fichier</p>
                                    {lettreMode === 'fichier' && (
                                        lettreFile ? (
                                            <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg">
                                                <span className="text-xs text-slate-700 flex-1 truncate">{lettreFile.name}</span>
                                                <button type="button" onClick={() => { setLettreFile(null); lettreFileRef.current.value = ''; }}
                                                    className="text-slate-400 hover:text-red-500 text-lg leading-none">×</button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center h-16 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-white transition">
                                                <span className="text-xs text-slate-400">PDF, Word · 5 Mo max</span>
                                                <input ref={lettreFileRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
                                                    onChange={e => setLettreFile(e.target.files[0])} />
                                            </label>
                                        )
                                    )}
                                </div>
                            </label>

                            {/* Texte libre */}
                            <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                                lettreMode === 'texte' ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                            }`}>
                                <input type="radio" checked={lettreMode === 'texte'} onChange={() => setLettreMode('texte')} className="shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-800 mb-1.5">Écrire un message</p>
                                    {lettreMode === 'texte' && (
                                        <>
                                            <textarea rows={4} value={data.lettre_motivation}
                                                onChange={e => setData('lettre_motivation', e.target.value)}
                                                placeholder="Présentez votre motivation…"
                                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none bg-white" />
                                            <p className="text-right text-xs text-slate-300 mt-0.5">{data.lettre_motivation.length}/2000</p>
                                        </>
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-1">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-xl hover:bg-slate-200 transition">
                            Annuler
                        </button>
                        <button type="submit" disabled={processing || !canSubmit}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                            {processing ? 'Envoi…' : 'Envoyer ma candidature'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

