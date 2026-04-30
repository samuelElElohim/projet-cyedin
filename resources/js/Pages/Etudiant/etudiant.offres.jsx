import EtudiantLayout from '@/Layouts/EtudiantLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useRef } from 'react';

export default function EtudiantOffres({ offres = [], deja_candidature = {}, secteurs = [], filieres = [], filters = {} }) {
    const [search, setSearch]         = useState(filters.search ?? '');
    const [dureeMin, setDureeMin]     = useState(filters.duree_min ?? '');
    const [dureeMax, setDureeMax]     = useState(filters.duree_max ?? '');
    const [secteur, setSecteur]       = useState(filters.secteur ?? '');
    const [filiere, setFiliere]       = useState(filters.filiere ?? '');
    const [modalOffre, setModalOffre] = useState(null);

    function applyFilters(overrides = {}) {
        router.get(route('etudiant.offres'), {
            search:    overrides.search    ?? search,
            duree_min: overrides.duree_min ?? dureeMin,
            duree_max: overrides.duree_max ?? dureeMax,
            secteur:   overrides.secteur   ?? secteur,
            filiere:   overrides.filiere   ?? filiere,
        }, { preserveState: true, replace: true });
    }

    return (
        <EtudiantLayout title="Offres de stage">
            <Head title="Offres — Étudiant" />

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

                    {/* Filière — fix superposition texte/flèche */}
                    <div className="relative">
                        <select
                            value={filiere}
                            onChange={e => { setFiliere(e.target.value); applyFilters({ filiere: e.target.value }); }}
                            className="appearance-none border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                        >
                            <option value="">Toutes les filières</option>
                            {filieres.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</span>
                    </div>

                    {/* Secteur — même fix */}
                    <div className="relative">
                        <select
                            value={secteur}
                            onChange={e => { setSecteur(e.target.value); applyFilters({ secteur: e.target.value }); }}
                            className="appearance-none border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                        >
                            <option value="">Tous les secteurs</option>
                            {secteurs.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</span>
                    </div>

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
                        setSecteur(''); setFiliere('');
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

                            <div className="flex flex-wrap gap-2 mb-4">
                                {offre.entreprise?.secteur && (
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wide rounded-md">
                                        {offre.entreprise.secteur}
                                    </span>
                                )}
                                {offre.filiere_cible && (
                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wide rounded-md">
                                        🎓 {offre.filiere_cible}
                                    </span>
                                )}
                            </div>

                            {statut === 'acceptee' ? (
                                <span className="w-full py-2 bg-green-100 text-green-800 text-xs font-bold rounded-xl text-center">✓ Candidature acceptée</span>
                            ) : statut === 'refusee' ? (
                                <span className="w-full py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center">✗ Candidature refusée</span>
                            ) : statut === 'en_attente' ? (
                                <span className="w-full py-2 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl text-center">⏳ Candidature en attente</span>
                            ) : (
                                <button
                                    onClick={() => setModalOffre(offre)}
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
                <CandidatureModal offre={modalOffre} onClose={() => setModalOffre(null)} />
            )}
        </EtudiantLayout>
    );
}


function CandidatureModal({ offre, onClose }) {
    const cvRef      = useRef(null);
    const lettreRef  = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        offre_id:          offre.id,
        lettre_motivation: '',
        cv:                null,
        lettre_fichier:    null,
    });

    function handleFile(field, ref, e) {
        const file = e.target.files[0];
        if (!file) return;
        setData(field, file);
    }

    function removeFile(field, ref) {
        setData(field, null);
        if (ref.current) ref.current.value = '';
    }

    function submit(e) {
        e.preventDefault();
        post(route('etudiant.candidatures.store'), {
            forceFormData: true,
            onSuccess: () => { reset(); onClose(); },
        });
    }

    const ACCEPTED_CV     = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    const ACCEPTED_LETTRE = '.pdf,.doc,.docx';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 mx-4 max-h-[90vh] overflow-y-auto">

                <h2 className="text-base font-semibold text-slate-900 mb-1">Postuler</h2>
                <p className="text-sm text-slate-500 mb-5">
                    <strong>{offre.titre}</strong> — {offre.entreprise?.nom_entreprise}
                </p>

                <form onSubmit={submit} className="space-y-5">

                    {/* CV — obligatoire */}
                    <FileUploadBox
                        label="CV"
                        required
                        accept={ACCEPTED_CV}
                        hint="PDF, Word, JPG, PNG · 5 Mo max"
                        file={data.cv}
                        inputRef={cvRef}
                        error={errors.cv}
                        onChange={e => handleFile('cv', cvRef, e)}
                        onRemove={() => removeFile('cv', cvRef)}
                    />

                    {/* Lettre fichier — optionnel */}
                    <FileUploadBox
                        label="Lettre de motivation"
                        optional
                        accept={ACCEPTED_LETTRE}
                        hint="PDF ou Word · 5 Mo max"
                        file={data.lettre_fichier}
                        inputRef={lettreRef}
                        error={errors.lettre_fichier}
                        onChange={e => handleFile('lettre_fichier', lettreRef, e)}
                        onRemove={() => removeFile('lettre_fichier', lettreRef)}
                    />

                    {/* Lettre écrite — optionnel */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Lettre de motivation{' '}
                            <span className="text-slate-400 font-normal text-xs">(texte libre, optionnel)</span>
                        </label>
                        <textarea
                            rows={5}
                            value={data.lettre_motivation}
                            onChange={e => setData('lettre_motivation', e.target.value)}
                            placeholder="Présentez votre motivation pour ce stage…"
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none"
                        />
                        <div className="flex justify-between mt-1">
                            {errors.lettre_motivation
                                ? <p className="text-xs text-red-600">{errors.lettre_motivation}</p>
                                : <span />
                            }
                            <span className="text-xs text-slate-300">
                                {data.lettre_motivation.length} / 2000
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-1">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-xl hover:bg-slate-200 transition">
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !data.cv}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Envoi…' : 'Envoyer ma candidature'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Composant réutilisable upload ── */
function FileUploadBox({ label, required, optional, accept, hint, file, inputRef, error, onChange, onRemove }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                {label}{' '}
                {required && <span className="text-red-500">*</span>}
                {optional && <span className="text-slate-400 font-normal text-xs">(optionnel)</span>}
            </label>

            {!file ? (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition group">
                    <svg className="w-6 h-6 text-slate-300 group-hover:text-blue-400 transition mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-8m0 0-3 3m3-3 3 3M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1" />
                    </svg>
                    <span className="text-sm text-slate-400 group-hover:text-blue-500 transition">
                        Glisser ou <span className="font-semibold underline">parcourir</span>
                    </span>
                    <span className="text-xs text-slate-300 mt-0.5">{hint}</span>
                    <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={onChange} />
                </label>
            ) : (
                <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-blue-800 truncate">{file.name}</p>
                            <p className="text-xs text-blue-500">{(file.size / 1024).toFixed(0)} Ko</p>
                        </div>
                    </div>
                    <button type="button" onClick={onRemove}
                        className="ml-3 shrink-0 text-blue-400 hover:text-red-500 transition text-xl leading-none">
                        ×
                    </button>
                </div>
            )}

            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}