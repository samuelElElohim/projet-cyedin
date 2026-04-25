import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function DemanderFormation({ demandes = [], filieres = [] }) {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        formation_demandee: '',
        justification: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('etudiant.demande.formation.store'), {
            onSuccess: () => reset(),
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Demander une filière
                </h2>
            }
        >
            <Head title="Demander une filière" />

            <div className="py-10">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8 space-y-6">

                    {/* Filières disponibles */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Filières actuellement disponibles</h3>
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

                    {/* Formulaire */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Soumettre une demande</h3>

                        {recentlySuccessful && (
                            <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
                                Demande envoyée avec succès. Un administrateur la traitera prochainement.
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom de la filière demandée *
                                </label>
                                <input
                                    type="text"
                                    value={data.formation_demandee}
                                    onChange={e => setData('formation_demandee', e.target.value)}
                                    placeholder="ex: ROBOTIQUE, BIO-INFO…"
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                                {errors.formation_demandee && (
                                    <p className="mt-1 text-xs text-red-600">{errors.formation_demandee}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Justification
                                </label>
                                <textarea
                                    rows={4}
                                    value={data.justification}
                                    onChange={e => setData('justification', e.target.value)}
                                    placeholder="Expliquez pourquoi cette filière devrait être ajoutée…"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                                />
                                {errors.justification && (
                                    <p className="mt-1 text-xs text-red-600">{errors.justification}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-60 text-sm"
                            >
                                {processing ? 'Envoi…' : 'Soumettre la demande'}
                            </button>
                        </form>
                    </div>

                    {/* Historique des demandes */}
                    {demandes.length > 0 && (
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Mes demandes</h3>
                            <div className="space-y-2">
                                {demandes.map(d => (
                                    <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                        <div>
                                            <span className="text-sm font-medium text-gray-800">{d.formation_demandee}</span>
                                            {d.commentaire_admin && (
                                                <p className="text-xs text-gray-500 mt-0.5">Admin : {d.commentaire_admin}</p>
                                            )}
                                        </div>
                                        <StatutBadge statut={d.statut} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
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
