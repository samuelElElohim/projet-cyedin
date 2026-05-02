import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

const STATUT_STYLES = {
    en_attente: 'bg-amber-100 text-amber-800',
    approuve:   'bg-green-100 text-green-800',
    refuse:     'bg-red-100 text-red-800',
};
const STATUT_LABELS = { en_attente: 'En attente', approuve: 'Approuvée', refuse: 'Refusée' };

// ─── Modal approbation ────────────────────────────────────────────────────────
function ApprouverModal({ demande, filieres, onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        commentaire_admin: '',
        filiere_id: demande.filiere_id ?? '',
        secteur_id: demande.secteur_id ?? '',
    });

    const secteurs = filieres.flatMap(f => f.secteurs ?? []);

    function submit(e) {
        e.preventDefault();
        post(route('admin.demandes.approuver', demande.id), { onSuccess: onClose });
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-base font-bold text-gray-900 mb-1">Approuver la demande</h3>
                <p className="text-xs text-gray-400 mb-4">
                    Cela créera <strong>{demande.type === 'secteur' ? 'le secteur' : 'le tag'}</strong> « {demande.nom} » dans la hiérarchie.
                </p>

                <form onSubmit={submit} className="space-y-4">
                    {/* Confirmer/corriger le contexte */}
                    {demande.type === 'secteur' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Filière parente *</label>
                            <select value={data.filiere_id} onChange={e => setData('filiere_id', e.target.value)}
                                required className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-200">
                                <option value="">— Choisir —</option>
                                {filieres.map(f => <option key={f.id} value={f.id}>{f.filiere}</option>)}
                            </select>
                            {errors.filiere_id && <p className="text-xs text-red-500 mt-1">{errors.filiere_id}</p>}
                        </div>
                    )}
                    {demande.type === 'tag' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Secteur parent *</label>
                            <select value={data.secteur_id} onChange={e => setData('secteur_id', e.target.value)}
                                required className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-200">
                                <option value="">— Choisir —</option>
                                {filieres.map(f => (
                                    <optgroup key={f.id} label={f.filiere}>
                                        {f.secteurs?.map(s => <option key={s.id} value={s.id}>{s.secteur}</option>)}
                                    </optgroup>
                                ))}
                            </select>
                            {errors.secteur_id && <p className="text-xs text-red-500 mt-1">{errors.secteur_id}</p>}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire <span className="text-gray-400 font-normal">(optionnel)</span></label>
                        <textarea rows={2} value={data.commentaire_admin}
                            onChange={e => setData('commentaire_admin', e.target.value)}
                            placeholder="Message visible par l'auteur de la demande"
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-200" />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button type="submit" disabled={processing}
                            className="flex-1 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50">
                            {processing ? '…' : 'Approuver et créer'}
                        </button>
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50">
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Modal refus ──────────────────────────────────────────────────────────────
function RefuserModal({ demande, onClose }) {
    const { data, setData, post, processing } = useForm({ commentaire_admin: '' });

    function submit(e) {
        e.preventDefault();
        post(route('admin.demandes.refuser', demande.id), { onSuccess: onClose });
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-base font-bold text-gray-900 mb-4">Refuser « {demande.nom} »</h3>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Raison <span className="text-gray-400 font-normal">(optionnel)</span></label>
                        <textarea rows={3} value={data.commentaire_admin}
                            onChange={e => setData('commentaire_admin', e.target.value)}
                            placeholder="Expliquer le refus à l'auteur"
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-200" />
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" disabled={processing}
                            className="flex-1 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50">
                            {processing ? '…' : 'Refuser'}
                        </button>
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50">
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AdminDemandes({ demandes = [], filieres = [], counts = {}, filters = {} }) {
    const [modal, setModal] = useState(null); // { type: 'approuver'|'refuser', demande }
    const [statutFilter, setStatutFilter] = useState(filters.statut ?? 'all');
    const [typeFilter, setTypeFilter] = useState(filters.type ?? '');

    function applyFilter(statut, type) {
        router.get(route('admin.demandes'), { statut, type }, { preserveState: true, replace: true });
    }

    return (
        <AdminLayout title="Demandes de hiérarchie">
            <Head title="Demandes" />

            {/* Compteurs */}
            <div className="flex gap-3 mb-6 flex-wrap">
                {[
                    { label: 'En attente', key: 'en_attente', color: 'amber' },
                    { label: 'Approuvées', key: 'approuve',   color: 'green' },
                    { label: 'Refusées',   key: 'refuse',     color: 'red'   },
                ].map(c => (
                    <button
                        key={c.key}
                        onClick={() => { setStatutFilter(c.key); applyFilter(c.key, typeFilter); }}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                            statutFilter === c.key
                                ? `bg-${c.color}-100 text-${c.color}-800 border-${c.color}-200`
                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        {counts[c.key] ?? 0} {c.label}
                    </button>
                ))}
                <button
                    onClick={() => { setStatutFilter('all'); applyFilter('all', typeFilter); }}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                        statutFilter === 'all' ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}
                >
                    Toutes ({(counts.en_attente ?? 0) + (counts.approuve ?? 0) + (counts.refuse ?? 0)})
                </button>

                {/* Filtre par type */}
                <select value={typeFilter}
                    onChange={e => { setTypeFilter(e.target.value); applyFilter(statutFilter, e.target.value); }}
                    className="ml-auto border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none">
                    <option value="">Tous types</option>
                    <option value="secteur">Secteurs</option>
                    <option value="tag">Tags</option>
                </select>
            </div>

            {/* Liste */}
            <div className="space-y-3">
                {demandes.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center text-gray-400 text-sm">
                        Aucune demande.
                    </div>
                )}
                {demandes.map(d => (
                    <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
                        {/* Badge type */}
                        <div className={`shrink-0 px-2 py-1 rounded-lg text-xs font-bold uppercase ${
                            d.type === 'secteur' ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                            {d.type}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-bold text-gray-900">{d.nom}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUT_STYLES[d.statut]}`}>
                                    {STATUT_LABELS[d.statut]}
                                </span>
                            </div>

                            {/* Contexte demandé */}
                            <p className="text-xs text-gray-400">
                                {d.type === 'secteur'
                                    ? `dans la filière ${d.filiere?.filiere ?? '—'}`
                                    : `dans le secteur ${d.secteur?.secteur ?? '—'}`
                                }
                            </p>

                            {/* Auteur */}
                            <p className="text-xs text-gray-500 mt-1">
                                Par <strong>{d.auteur?.nom} {d.auteur?.prenom}</strong>
                                <span className="text-gray-300 mx-1">·</span>
                                <span className="text-gray-400">{new Date(d.created_at).toLocaleDateString('fr-FR')}</span>
                            </p>

                            {/* Justification */}
                            {d.justification && (
                                <p className="text-xs text-gray-500 mt-1.5 bg-gray-50 rounded-lg px-3 py-2 italic">
                                    {d.justification}
                                </p>
                            )}

                            {/* Commentaire admin si traité */}
                            {d.commentaire_admin && (
                                <p className="text-xs text-gray-400 mt-1">
                                    Retour : {d.commentaire_admin} — par {d.admin?.nom}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        {d.statut === 'en_attente' && (
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => setModal({ type: 'approuver', demande: d })}
                                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700"
                                >
                                    Approuver
                                </button>
                                <button
                                    onClick={() => setModal({ type: 'refuser', demande: d })}
                                    className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-100"
                                >
                                    Refuser
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modals */}
            {modal?.type === 'approuver' && (
                <ApprouverModal demande={modal.demande} filieres={filieres} onClose={() => setModal(null)} />
            )}
            {modal?.type === 'refuser' && (
                <RefuserModal demande={modal.demande} onClose={() => setModal(null)} />
            )}
        </AdminLayout>
    );
}
