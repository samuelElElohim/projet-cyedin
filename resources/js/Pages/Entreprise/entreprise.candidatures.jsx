import EntrepriseLayout from '@/Layouts/EntrepriseLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const STATUT = {
    en_attente: { label: 'En attente', cls: 'bg-amber-100 text-amber-800' },
    acceptee:   { label: 'Acceptée',   cls: 'bg-green-100 text-green-800' },
    refusee:    { label: 'Refusée',    cls: 'bg-red-100 text-red-800' },
    accepted_pending_choice: { label: 'En attente confirmation', cls: 'bg-blue-100 text-blue-800' },
};

const TYPE_ICONE = {
    rapport:    '📄',
    resume:     '📋',
    evaluation: '📊',
    cv:         '👤',
    pdf:        '📕',
};

export default function EntrepriseCandidatures({ candidatures_par_offre = {}, offres = {} }) {
    const [openDocs, setOpenDocs] = useState({});

    function toggleDocs(candidatureId) {
        setOpenDocs(prev => ({ ...prev, [candidatureId]: !prev[candidatureId] }));
    }

    function accepter(id) { router.post(route('entreprise.candidatures.accepter', id)); }
    function refuser(id)  { router.post(route('entreprise.candidatures.refuser',  id)); }

    function signerConvention(stageId) {
        if (!confirm('Signer la convention de ce stage ?')) return;
        router.post(route('entreprise.convention.signer', stageId));
    }

    const offreIds = Object.keys(candidatures_par_offre);

    return (
        <EntrepriseLayout title="Candidatures reçues">
            <Head title="Candidatures — Entreprise" />

            {offreIds.length === 0 ? (
                <div className="text-center py-24 text-slate-400">
                    <p className="text-4xl mb-3">📨</p>
                    Aucune candidature reçue pour le moment.
                </div>
            ) : (
                <div className="space-y-6">
                    {offreIds.map(offreId => {
                        const offre = offres[offreId];
                        const cands = candidatures_par_offre[offreId] ?? [];
                        const enAttente = cands.filter(c => c.statut === 'en_attente').length;

                        return (
                            <div key={offreId} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                {/* Header offre */}
                                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                    <div>
                                        <span className="font-semibold text-slate-800">{offre?.titre ?? `Offre #${offreId}`}</span>
                                        <span className="ml-2 text-xs text-slate-500">{offre?.duree_semaines} sem.</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {enAttente > 0 && (
                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full font-semibold">
                                                {enAttente} en attente
                                            </span>
                                        )}
                                        <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs rounded-full font-semibold">
                                            {cands.length} total
                                        </span>
                                    </div>
                                </div>

                                {/* Liste candidats */}
                                <div className="divide-y divide-slate-50">
                                    {cands.map(c => {
                                        const s = STATUT[c.statut] ?? STATUT.en_attente;
                                        const docs = c.documents_etudiant ?? [];
                                        const showDocs = openDocs[c.id];
                                        const cv = c.convention_status;

                                        return (
                                            <div key={c.id} className="hover:bg-slate-50 transition">
                                                {/* Ligne principale */}
                                                <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
                                                    {/* Avatar */}
                                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-black text-xs shrink-0">
                                                        {c.etudiant?.nom?.[0] ?? '?'}
                                                    </div>

                                                    {/* Infos candidat */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium text-slate-900">
                                                            {c.etudiant?.nom} {c.etudiant?.prenom}
                                                        </div>
                                                        <div className="text-xs text-slate-400">{c.etudiant?.email}</div>
                                                    </div>

                                                    {/* Téléchargements CV + Lettre */}
                                                    <div className="flex gap-2 shrink-0">
                                                        {c.chemin_cv && (
                                                            <a
                                                                href={route('entreprise.candidatures.download', { candidature: c.id, type: 'cv' })}
                                                                className="flex items-center gap-1 px-2 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-blue-50 hover:text-blue-700 transition"
                                                            >
                                                                📎 CV
                                                            </a>
                                                        )}
                                                        {c.chemin_lettre && (
                                                            <a
                                                                href={route('entreprise.candidatures.download', { candidature: c.id, type: 'lettre' })}
                                                                className="flex items-center gap-1 px-2 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-blue-50 hover:text-blue-700 transition"
                                                            >
                                                                📝 Lettre
                                                            </a>
                                                        )}
                                                    </div>

                                                    {/* Date */}
                                                    <div className="text-xs text-slate-400 hidden sm:block shrink-0">
                                                        {new Date(c.created_at).toLocaleDateString('fr-FR')}
                                                    </div>

                                                    {/* Statut */}
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${s.cls}`}>
                                                        {s.label}
                                                    </span>

                                                    {/* Bouton docs */}
                                                    <button
                                                        onClick={() => toggleDocs(c.id)}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition shrink-0 ${
                                                            showDocs
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                                                        }`}
                                                    >
                                                        📄 {docs.length} doc{docs.length !== 1 ? 's' : ''}
                                                        <span className="text-[10px]">{showDocs ? '▲' : '▼'}</span>
                                                    </button>

                                                    {/* Actions accepter/refuser */}
                                                    {c.statut === 'en_attente' && (
                                                        <div className="flex gap-2 shrink-0">
                                                            <button onClick={() => accepter(c.id)}
                                                                className="px-2 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 font-semibold">
                                                                Accepter
                                                            </button>
                                                            <button onClick={() => refuser(c.id)}
                                                                className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 font-semibold">
                                                                Refuser
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Lettre de motivation */}
                                                {c.lettre_motivation && (
                                                    <div className="px-4 pb-2">
                                                        <p className="text-xs text-slate-500 italic line-clamp-2 pl-11">
                                                            "{c.lettre_motivation}"
                                                        </p>
                                                    </div>
                                                )}

                                                {/* ── BLOC CONVENTION (si stage créé) ── */}
                                                {cv && c.stage_id && (
                                                    <div className="mx-4 mb-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                                                            Convention de stage
                                                        </p>
                                                        <div className="flex gap-2 flex-wrap items-center">
                                                            {[
                                                                { label: 'Entreprise', signed: cv.entreprise },
                                                                { label: 'Tuteur',     signed: cv.tuteur },
                                                                { label: 'Étudiant',   signed: cv.etudiant },
                                                            ].map(p => (
                                                                <span key={p.label} className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                                                                    p.signed ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'
                                                                }`}>
                                                                    {p.signed ? '✓' : '○'} {p.label}
                                                                </span>
                                                            ))}

                                                            {!cv.entreprise && (
                                                                <button
                                                                    onClick={() => signerConvention(c.stage_id)}
                                                                    className="px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-xl hover:bg-amber-600 transition"
                                                                >
                                                                    ✍ Signer la convention
                                                                </button>
                                                            )}

                                                            {cv.complete && (
                                                                <span className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-xl">
                                                                    ✓ Convention complète
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Documents — panneau dépliable */}
                                                {showDocs && (
                                                    <div className="px-4 pb-4 pl-11">
                                                        {docs.length === 0 ? (
                                                            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-sm text-slate-400 border border-slate-100">
                                                                <span>📭</span>
                                                                Aucun document déposé par ce candidat.
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                                                    Documents du candidat
                                                                </p>
                                                                {docs.map(doc => (
                                                                    <div key={doc.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="text-lg">
                                                                                {TYPE_ICONE[doc.type] ?? '📄'}
                                                                            </span>
                                                                            <div>
                                                                                <div className="text-sm font-medium text-slate-800">{doc.nom}</div>
                                                                                <div className="text-xs text-slate-400 capitalize">
                                                                                    {doc.type ?? 'document'}
                                                                                    {doc.date_depot && ` · ${new Date(doc.date_depot).toLocaleDateString('fr-FR')}`}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <a
                                                                            href={route('documents.download', doc.id)}
                                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                                                                        >
                                                                            ↓ Télécharger
                                                                        </a>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </EntrepriseLayout>
    );
}