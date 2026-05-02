import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function AdminCreateEntreprise() {
    const { data, setData, post, processing, errors } = useForm({
        nom_entreprise:  '',
        addresse:        '',
        secteur:         '',
        utilisateur_id: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('admin.store.entreprise'));
    }

    return (
        <AdminLayout title="Ajouter une entreprise">
            <Head title="Ajouter une entreprise" />

            <div className="max-w-xl">
                <Link
                    href={route('admin.index.entreprise')}
                    className="text-sm text-gray-500 hover:text-gray-800 mb-6 inline-flex items-center gap-1"
                >
                    ← Retour à la liste
                </Link>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mt-4">
                    <h2 className="text-base font-semibold text-gray-900 mb-6">Informations entreprise</h2>

                    <form onSubmit={submit} className="space-y-4">
                        <Field label="ID utilisateur lié *" error={errors.utilisateur_id}>
                            <input
                                type="number"
                                value={data.utilisateur_id}
                                onChange={e => setData('utilisateur_id', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                placeholder="ID de l'utilisateur (role E)"
                                required
                            />
                        </Field>

                        <Field label="Nom de l'entreprise *" error={errors.nom_entreprise}>
                            <input
                                type="text"
                                value={data.nom_entreprise}
                                onChange={e => setData('nom_entreprise', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                placeholder="Nom de l'entreprise"
                                required
                            />
                        </Field>

                        <Field label="Adresse *" error={errors.addresse}>
                            <input
                                type="text"
                                value={data.addresse}
                                onChange={e => setData('addresse', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                placeholder="Adresse complète"
                                required
                            />
                        </Field>

                        <Field label="Secteur d'activité *" error={errors.secteur}>
                            <input
                                type="text"
                                value={data.secteur}
                                onChange={e => setData('secteur', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                placeholder="ex: Informatique, Industrie…"
                                required
                            />
                        </Field>

                        <div className="pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-60 text-sm"
                            >
                                {processing ? 'Création…' : 'Créer l\'entreprise'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}