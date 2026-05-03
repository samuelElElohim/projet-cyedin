import EntrepriseLayout from '@/Layouts/EntrepriseLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function EntrepriseOffres({ offres = [], secteurs = [], tags = [] }) {
    const [showForm, setShowForm] = useState(false);
    const [selectedSecteur, setSelectedSecteur] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        titre: '', description: '', duree_semaines: '',
        secteur_id: '', tags_ids: [], dateDebut: '',
    });

    // Tags filtrés selon le secteur sélectionné dans le form
    const tagsForSecteur = useMemo(
        () => selectedSecteur
            ? tags.filter(t => t.secteur_id === Number(selectedSecteur))
            : tags,
        [selectedSecteur, tags]
    );

    function handleSecteurChange(v) {
        setSelectedSecteur(v);
        setData(d => ({ ...d, secteur_id: v ? Number(v) : '', tags_ids: [] }));
    }

    function toggleTag(id) {
        setData('tags_ids', data.tags_ids.includes(id)
            ? data.tags_ids.filter(x => x !== id)
            : [...data.tags_ids, id]
        );
    }

    function supprimer(id) {
        if (!confirm('Supprimer cette offre définitivement ?')) return;
        router.delete(route('entreprise.destroy.offre', id));
    }

    function submit(e) {
        e.preventDefault();
        post(route('entreprise.store.offre'), {
            onSuccess: () => { reset(); setShowForm(false); setSelectedSecteur(''); },
        });
    }

    const actives = offres.filter(o => o.est_active).length;
    const attente = offres.filter(o => !o.est_active).length;


    return (
        <EntrepriseLayout title="Mes offres de stage">
            <Head title="Offres — Entreprise" />

            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-3">
                    <span className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-semibold rounded-xl">
                        {actives} active{actives !== 1 ? 's' : ''}
                    </span>
                    <span className="px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-xl">
                        {attente} en attente
                    </span>
                </div>
                <button
                    onClick={() => setShowForm(p => !p)}
                    className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition"
                >
                    {showForm ? 'Annuler' : '+ Nouvelle offre'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">Déposer une offre</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Titre *</label>
                            <input type="text" value={data.titre} onChange={e => setData('titre', e.target.value)}
                                placeholder="ex: Développeur web React" required
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-100" />
                            {errors.titre && <p className="mt-1 text-xs text-red-600">{errors.titre}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Description / Missions *</label>
                            <textarea rows={4} value={data.description} onChange={e => setData('description', e.target.value)}
                                placeholder="Décrivez les missions confiées au stagiaire…" required
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-100 resize-none" />
                            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Durée (semaines) *</label>
                                <input type="number" min="1" value={data.duree_semaines}
                                    onChange={e => setData('duree_semaines', e.target.value)} required
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-100" />
                                {errors.duree_semaines && <p className="mt-1 text-xs text-red-600">{errors.duree_semaines}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Date de début *</label>
                                <input type="date" value={data.dateDebut} onChange={e => setData('dateDebut', e.target.value)} required
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-100" />
                                {errors.dateDebut && <p className="mt-1 text-xs text-red-600">{errors.dateDebut}</p>}
                            </div>
                        </div>

                        {/* Secteur ciblé */}
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Secteur ciblé <span className="text-slate-400 font-normal">(optionnel)</span>
                            </label>
                            <select
                                value={selectedSecteur}
                                onChange={e => handleSecteurChange(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-100 bg-white"
                            >
                                <option value="">— Tous secteurs —</option>
                                {secteurs.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.filiere?.filiere} / {s.secteur}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tags (filtrés par secteur si sélectionné) */}
                        {tagsForSecteur.length > 0 && (
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-2">Tags compétences</label>
                                <div className="flex flex-wrap gap-2">
                                    {tagsForSecteur.map(tag => (
                                        <label key={tag.id} className="flex items-center gap-1.5 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.tags_ids.includes(tag.id)}
                                                onChange={() => toggleTag(tag.id)}
                                                className="rounded border-gray-300 text-amber-500"
                                            />
                                            <span className="text-sm text-slate-700">{tag.tag}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className="text-xs text-slate-400">
                            L'offre sera soumise à validation par un administrateur avant d'être visible.
                        </p>
                        <button type="submit" disabled={processing}
                            className="px-6 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition disabled:opacity-60 text-sm">
                            {processing ? 'Envoi…' : "Soumettre l'offre"}
                        </button>
                    </form>
                </div>
            )}

            {/* Liste des offres */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {offres.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <p className="text-3xl mb-2">📋</p>
                        Aucune offre déposée.
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                {['Titre', 'Secteur', 'Tags', 'Durée', 'Candidatures', 'Statut', ''].map(h => (
                                    <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {offres.map(o => (
                                <tr key={o.id} className="border-t border-slate-50 hover:bg-slate-50 transition">
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium text-slate-900">{o.titre}</div>
                                        <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{o.description}</div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-600">
                                        {o.secteur ? (
                                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-semibold">
                                                {o.secteur.filiere?.filiere} / {o.secteur.secteur}
                                            </span>
                                        ) : <span className="text-slate-300">—</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {o.tags?.map(t => (
                                                <span key={t.id} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">{t.tag}</span>
                                            ))}
                                            {(!o.tags || o.tags.length === 0) && <span className="text-slate-300 text-xs">—</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 text-center">{o.duree_semaines} sem.</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                                            {o.candidatures_count ?? 0}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                            o.est_active ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {o.est_active ? 'Active' : 'En attente'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => supprimer(o.id)}
                                            className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </EntrepriseLayout>
    );
}
