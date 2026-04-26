import EtudiantLayout from '@/Layouts/EtudiantLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function EtudiantCahier({ entrees = [] }) {
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId]     = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        date_entree:    new Date().toISOString().slice(0, 10),
        titre:          '',
        contenu:        '',
        visible_tuteur: true,
        visible_jury:   false,
    });

    function submit(e) {
        e.preventDefault();
        post(route('etudiant.cahier.store'), {
            onSuccess: () => { reset(); setShowForm(false); },
        });
    }

    function deleteEntree(id) {
        if (!confirm('Supprimer cette entrée ?')) return;
        router.delete(route('etudiant.cahier.destroy', id));
    }

    // Grouper par mois
    const parMois = entrees.reduce((acc, e) => {
        const mois = new Date(e.date_entree).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        acc[mois] = acc[mois] ?? [];
        acc[mois].push(e);
        return acc;
    }, {});

    return (
        <EtudiantLayout title="Cahier de stage">
            <Head title="Cahier — Étudiant" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-slate-500">{entrees.length} entrée{entrees.length !== 1 ? 's' : ''} au total</p>
                <button
                    onClick={() => setShowForm(p => !p)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
                >
                    {showForm ? 'Annuler' : '+ Nouvelle entrée'}
                </button>
            </div>

            {/* Formulaire */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">Ajouter une entrée</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Date *</label>
                                <input type="date" value={data.date_entree}
                                    onChange={e => setData('date_entree', e.target.value)}
                                    required
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
                                {errors.date_entree && <p className="mt-1 text-xs text-red-600">{errors.date_entree}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Titre</label>
                                <input type="text" value={data.titre}
                                    onChange={e => setData('titre', e.target.value)}
                                    placeholder="Titre de la journée (optionnel)"
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Contenu *</label>
                            <textarea rows={5} value={data.contenu}
                                onChange={e => setData('contenu', e.target.value)}
                                placeholder="Décrivez les activités, apprentissages, difficultés de la journée…"
                                required
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none" />
                            {errors.contenu && <p className="mt-1 text-xs text-red-600">{errors.contenu}</p>}
                        </div>

                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <input type="checkbox" checked={data.visible_tuteur}
                                    onChange={e => setData('visible_tuteur', e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600" />
                                Visible par mon tuteur
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <input type="checkbox" checked={data.visible_jury}
                                    onChange={e => setData('visible_jury', e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600" />
                                Visible par le jury
                            </label>
                        </div>

                        <button type="submit" disabled={processing}
                            className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
                            {processing ? 'Enregistrement…' : 'Enregistrer l\'entrée'}
                        </button>
                    </form>
                </div>
            )}

            {/* Entrées groupées par mois */}
            {entrees.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <p className="text-3xl mb-2">📓</p>
                    Le cahier est vide. Ajoutez votre première entrée !
                </div>
            ) : Object.entries(parMois).map(([mois, items]) => (
                <div key={mois} className="mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 capitalize">{mois}</h3>
                    <div className="space-y-3">
                        {items.map(entree => (
                            <div key={entree.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:border-blue-100 transition">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-bold text-slate-500">
                                                {new Date(entree.date_entree).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                            </span>
                                            {entree.titre && (
                                                <span className="font-semibold text-slate-800 text-sm">— {entree.titre}</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{entree.contenu}</p>
                                        <div className="flex gap-2 mt-3">
                                            {entree.visible_tuteur && (
                                                <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-semibold rounded-md">👨‍🏫 Tuteur</span>
                                            )}
                                            {entree.visible_jury && (
                                                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-semibold rounded-md">⚖️ Jury</span>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => deleteEntree(entree.id)}
                                        className="shrink-0 px-2 py-1 text-slate-300 hover:text-red-500 hover:bg-red-50 text-xs rounded-lg transition">
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </EtudiantLayout>
    );
}
