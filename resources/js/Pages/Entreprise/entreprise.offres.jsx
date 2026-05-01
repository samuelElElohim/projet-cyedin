import EntrepriseLayout from '@/Layouts/EntrepriseLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function EntrepriseOffres({ offres = [], filieres = [] }) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        titre:          '',
        description:    '',
        duree_semaines: '',
        filiere_cible:  '',
        dateDebut:      '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('entreprise.store.offre'), {
            onSuccess: () => { reset(); setShowForm(false); },
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

            {/* Formulaire */}
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

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Durée (semaines) *</label>
                                <input type="number" min="1" value={data.duree_semaines}
                                    onChange={e => setData('duree_semaines', e.target.value)} required
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-100" />
                                {errors.duree_semaines && <p className="mt-1 text-xs text-red-600">{errors.duree_semaines}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Date de début *</label>
                                <input type="date" value={data.dateDebut}
                                    onChange={e => setData('dateDebut', e.target.value)} required
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-100" />
                                {errors.dateDebut && <p className="mt-1 text-xs text-red-600">{errors.dateDebut}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Filière ciblée
                                    <span className="text-slate-400 font-normal ml-1">(optionnel)</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={data.filiere_cible}
                                        onChange={e => setData('filiere_cible', e.target.value)}
                                        className="appearance-none w-full border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-100 bg-white"
                                    >
                                        <option value="">Toutes filières</option>
                                        {filieres.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</span>
                                </div>
                                {errors.filiere_cible && <p className="mt-1 text-xs text-red-600">{errors.filiere_cible}</p>}
                            </div>
                        </div>

                        <p className="text-xs text-slate-400">
                            L'offre sera soumise à validation par un administrateur avant d'être visible par les étudiants.
                        </p>
                        <button type="submit" disabled={processing}
                            className="px-6 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition disabled:opacity-60 text-sm">
                            {processing ? 'Envoi…' : "Soumettre l'offre"}
                        </button>
                    </form>
                </div>
            )}

            {/* Liste */}
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
                                {['Titre', 'Filière ciblée', 'Durée', 'Candidatures', 'Statut'].map(h => (
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
                                    <td className="px-4 py-3">
                                        {o.filiere_cible
                                            ? <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md">{o.filiere_cible}</span>
                                            : <span className="text-xs text-slate-300">—</span>
                                        }
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </EntrepriseLayout>
    );
}