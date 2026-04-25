import { useForm, router } from '@inertiajs/react'
import { useState } from 'react'

const TYPE_OPTIONS = ['CV', 'Lettre de motivation', 'Relevé de notes', 'Autre']

export default function EtuDocuments({ documents }) {
    const [showForm, setShowForm] = useState(false)

    const { data, setData, post, errors, processing, reset } = useForm({
        nom: '',
        type: 'CV',
        fichier: null,
    })

    function handleSubmit(e) {
        e.preventDefault()
        post(route('etu.documents.store'), {
            forceFormData: true, // obligatoire pour les fichiers
            onSuccess: () => {
                reset()
                setShowForm(false)
            }
        })
    }

    function handleDelete(id) {
        if (confirm('Supprimer ce document ?')) {
            router.delete(route('etu.documents.destroy', { id }))
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Mes Documents</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                    {showForm ? 'Annuler' : '+ Ajouter'}
                </button>
            </div>

            {/* Formulaire upload */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50 flex flex-col gap-3"
                >
                    <input
                        type="text"
                        value={data.nom}
                        onChange={e => setData('nom', e.target.value)}
                        placeholder="Nom du document (ex: CV Juin 2025)"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                    />
                    {errors.nom && <span className="text-red-500 text-xs">{errors.nom}</span>}

                    <select
                        value={data.type}
                        onChange={e => setData('type', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                    >
                        {TYPE_OPTIONS.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>

                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => setData('fichier', e.target.files[0])}
                        className="text-sm"
                    />
                    {errors.fichier && <span className="text-red-500 text-xs">{errors.fichier}</span>}

                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                        {processing ? 'Upload...' : 'Uploader'}
                    </button>
                </form>
            )}

            {/* Liste documents */}
            {documents.length === 0 ? (
                <p className="text-center text-gray-400 py-16">Aucun document uploadé.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {documents.map(doc => (
                        <div
                            key={doc.id}
                            className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl"
                        >
                            {/* Icône + infos */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold">
                                    {doc.type?.slice(0, 3).toUpperCase() ?? 'DOC'}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{doc.nom}</p>
                                    <p className="text-xs text-gray-400">
                                        {doc.type} · {new Date(doc.date_depot).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <a
                                    href={`/storage/${doc.chemin_fichier}`}
                                    target="_blank"
                                    className="text-xs text-indigo-600 hover:underline"
                                >
                                    Voir
                                </a>
                                <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="text-xs text-red-400 hover:text-red-600"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}