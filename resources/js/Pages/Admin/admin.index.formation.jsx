import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminIndexFormation({ demandes = [], filieres = [], count = 0, filters = {} }) {
    const [statut, setStatut] = useState(filters.statut ?? 'all');
    const [modalId, setModalId] = useState(null);
    const [modalAction, setModalAction] = useState(null); // 'valider' | 'refuser'

    const { data, setData, post, processing, reset } = useForm({
        commentaire_admin: '',
        filiere_finale: '',
    });

    function applyFilter(val) {
        setStatut(val);
        router.get(route('admin.index.formation'), { statut: val }, { preserveState: true, replace: true });
    }

    function openModal(id, action) {
        setModalId(id);
        setModalAction(action);
        reset();
    }

    function closeModal() {
        setModalId(null);
        setModalAction(null);
        reset();
    }

    function submitValider(e) {
        e.preventDefault();
        post(route('admin.valider.formation', modalId), {
            onSuccess: closeModal,
        });
    }

    function submitRefuser(e) {
        e.preventDefault();
        post(route('admin.refuser.formation', modalId), {
            onSuccess: closeModal,
        });
    }

    const enAttente = demandes.filter(d => d.statut === 'en_attente').length;
    const approuves = demandes.filter(d => d.statut === 'approuve').length;
    const refuses   = demandes.filter(d => d.statut === 'refuse').length;

    const currentDemande = demandes.find(d => d.id === modalId);

    return (
        <AdminLayout title="Gestion des formations">
            <Head title="Formations — Admin" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="En attente"  value={enAttente} color="amber" />
                <StatCard label="Approuvées"  value={approuves} color="green" />
                <StatCard label="Refusées"    value={refuses}   color="red" />
            </div>

            {/* Filières existantes */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Filières actives en base
                </p>
                <div className="flex flex-wrap gap-2">
                    {filieres.length === 0
                        ? <span className="text-sm text-gray-400">Aucune filière enregistrée.</span>
                        : filieres.map(f => (
                            <span key={f} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                                {f}
                            </span>
                        ))
                    }
                </div>
            </div>

            {/* Filtres statut */}
            <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl w-fit">
                {[
                    { value: 'all',        label: 'Toutes' },
                    { value: 'en_attente', label: 'En attente' },
                    { value: 'approuve',   label: 'Approuvées' },
                    { value: 'refuse',     label: 'Refusées' },
                ].map(f => (
                    <button
                        key={f.value}
                        onClick={() => applyFilter(f.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            statut === f.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            {['Étudiant', 'Email', 'Formation demandée', 'Justification', 'Date', 'Statut', ''].map(h => (
                                <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {demandes.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                                    Aucune demande trouvée.
                                </td>
                            </tr>
                        ) : demandes.map(d => (
                            <tr key={d.id} className="border-t border-gray-50 hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                    {d.etudiant ? `${d.etudiant.nom} ${d.etudiant.prenom ?? ''}` : '—'}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">{d.etudiant?.email ?? '—'}</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
                                        {d.formation_demandee}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">
                                    {d.justification ?? '—'}
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-400">
                                    {new Date(d.created_at).toLocaleDateString('fr-FR')}
                                </td>
                                <td className="px-4 py-3">
                                    <StatutBadge statut={d.statut} />
                                </td>
                                <td className="px-4 py-3">
                                    {d.statut === 'en_attente' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openModal(d.id, 'valider')}
                                                className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded hover:bg-green-100 font-semibold"
                                            >
                                                Approuver
                                            </button>
                                            <button
                                                onClick={() => openModal(d.id, 'refuser')}
                                                className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded hover:bg-red-100 font-semibold"
                                            >
                                                Refuser
                                            </button>
                                        </div>
                                    )}
                                    {d.statut !== 'en_attente' && d.commentaire_admin && (
                                        <span className="text-xs text-gray-400 italic">{d.commentaire_admin}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalId && currentDemande && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">
                            {modalAction === 'valider' ? '✅ Approuver la demande' : '❌ Refuser la demande'}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Filière demandée : <strong>{currentDemande.formation_demandee}</strong>
                            {' '}par {currentDemande.etudiant?.nom}
                        </p>

                        <form onSubmit={modalAction === 'valider' ? submitValider : submitRefuser} className="space-y-4">
                            {modalAction === 'valider' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Filière finale (code court, max 10 car.) *
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={10}
                                        value={data.filiere_finale}
                                        onChange={e => setData('filiere_finale', e.target.value)}
                                        placeholder="ex: INFO, MECA…"
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Commentaire (optionnel)
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.commentaire_admin}
                                    onChange={e => setData('commentaire_admin', e.target.value)}
                                    placeholder="Remarque à communiquer à l'étudiant…"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`px-4 py-2 text-white text-sm font-semibold rounded-lg transition disabled:opacity-60 ${
                                        modalAction === 'valider'
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                >
                                    {processing ? 'Enregistrement…' : modalAction === 'valider' ? 'Approuver' : 'Refuser'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

function StatutBadge({ statut }) {
    const map = {
        en_attente: 'bg-amber-100 text-amber-800',
        approuve:   'bg-green-100 text-green-800',
        refuse:     'bg-red-100 text-red-800',
    };
    const labels = { en_attente: 'En attente', approuve: 'Approuvée', refuse: 'Refusée' };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[statut] ?? 'bg-gray-100 text-gray-600'}`}>
            {labels[statut] ?? statut}
        </span>
    );
}

function StatCard({ label, value, color }) {
    const colors = {
        amber: 'bg-amber-50 text-amber-700',
        green: 'bg-green-50 text-green-700',
        red:   'bg-red-50 text-red-700',
    };
    return (
        <div className={`rounded-xl p-4 ${colors[color]}`}>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-sm font-medium opacity-80 mt-1">{label}</div>
        </div>
    );
}
