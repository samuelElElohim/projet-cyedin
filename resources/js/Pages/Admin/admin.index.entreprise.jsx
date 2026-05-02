import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminIndexEntreprise({ entreprise = [], count = 0 }) {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData]   = useState({});
    const [search, setSearch]       = useState('');

    function startEdit(ent) {
        setEditingId(ent.utilisateur_id);
        setEditData({
            nom:            ent.utilisateur?.nom ?? ent.nom_entreprise,
            nom_entreprise: ent.nom_entreprise,
            addresse:       ent.addresse,
            secteur:        ent.secteur,
        });
    }

    function save(ent) {
        router.post(route('admin.edit.user', { id: ent.utilisateur_id }), {
            ...editData,
            role: 'E',
        }, { onSuccess: () => setEditingId(null) });
    }

    function toggleActive(userId) {
        router.post(route('admin.toggle.user', { id: userId }));
    }

    const filtered = entreprise.filter(e =>
        `${e.nom_entreprise} ${e.secteur} ${e.addresse} ${e.utilisateur?.email ?? ''}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Gestion des entreprises">
            <Head title="Entreprises — Admin" />

            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">{count} entreprise{count > 1 ? 's' : ''} enregistrée{count > 1 ? 's' : ''}</p>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Rechercher…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <Link
                        href={route('admin.create.entreprise')}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                        + Ajouter
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            {['ID', 'Nom entreprise', 'Email', 'Secteur', 'Adresse', 'Statut', ''].map(h => (
                                <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                                    Aucune entreprise trouvée.
                                </td>
                            </tr>
                        ) : filtered.map(ent => {
                            const isEditing = editingId === ent.utilisateur_id;
                            return (
                                <tr key={ent.utilisateur_id} className="border-t border-gray-50 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">{ent.utilisateur_id}</td>

                                    <td className="px-4 py-3">
                                        {isEditing
                                            ? <InlineInput value={editData.nom_entreprise} onChange={v => setEditData(d => ({ ...d, nom_entreprise: v, nom: v }))} />
                                            : <span className="text-sm font-medium text-gray-900">{ent.nom_entreprise}</span>
                                        }
                                    </td>

                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {ent.utilisateur?.email ?? '—'}
                                    </td>

                                    <td className="px-4 py-3">
                                        {isEditing
                                            ? <InlineInput value={editData.secteur} onChange={v => setEditData(d => ({ ...d, secteur: v }))} />
                                            : <span className="text-sm text-gray-700">{ent.secteur}</span>
                                        }
                                    </td>

                                    <td className="px-4 py-3">
                                        {isEditing
                                            ? <InlineInput value={editData.addresse} onChange={v => setEditData(d => ({ ...d, addresse: v }))} />
                                            : <span className="text-sm text-gray-600">{ent.addresse}</span>
                                        }
                                    </td>

                                    <td className="px-4 py-3">
                                        <StatusBadge active={ent.utilisateur?.est_active} />
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => save(ent)}
                                                        className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                                    >
                                                        Sauvegarder
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                                                    >
                                                        Annuler
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEdit(ent)}
                                                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded hover:bg-blue-100"
                                                    >
                                                        Modifier
                                                    </button>
                                                    <button
                                                        onClick={() => toggleActive(ent.utilisateur_id)}
                                                        className={`px-2 py-1 text-xs rounded ${
                                                            ent.utilisateur?.est_active
                                                                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                                                        }`}
                                                    >
                                                        {ent.utilisateur?.est_active ? 'Désactiver' : 'Activer'}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

function InlineInput({ value, onChange }) {
    return (
        <input
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
        />
    );
}

function StatusBadge({ active }) {
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-red-500'}`} />
            {active ? 'Actif' : 'Inactif'}
        </span>
    );
}