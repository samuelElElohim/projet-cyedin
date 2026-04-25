import { router } from '@inertiajs/react'
import { useState } from 'react'

export default function CarteCompacte({ offre, dejaCandidate, documents }) {
    const [showSelect, setShowSelect] = useState(false)
    const [selectedDoc, setSelectedDoc] = useState('')

    function handleCandidater() {
        if (!selectedDoc) return
        router.post(route('etu.candidater', { offre_id: offre.id }), {
            document_id: selectedDoc
        })
        setShowSelect(false)
    }

    return (
        <div className="flex flex-col gap-2 px-5 py-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {offre.entreprise?.nom_entreprise?.[0] ?? '?'}
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{offre.titre}</p>
                        <p className="text-sm text-gray-500 truncate">
                            {offre.entreprise?.nom_entreprise} · {offre.ville ?? 'Lieu non précisé'}
                        </p>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                    {offre.filiere && (
                        <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600">
                            {offre.filiere}
                        </span>
                    )}
                    {offre.type_stage && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                            {offre.type_stage}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">{offre.duree_semaines} sem.</p>
                        <p className="text-xs text-gray-400">
                            {offre.remuneration ? `${offre.remuneration} €/mois` : 'Non rémunéré'}
                        </p>
                    </div>

                    {dejaCandidate ? (
                        <span className="px-3 py-1.5 text-xs rounded-lg bg-green-50 text-green-600 font-medium">
                            ✓ Candidaté
                        </span>
                    ) : (
                        <button
                            onClick={() => setShowSelect(!showSelect)}
                            className="px-3 py-1.5 text-xs rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                        >
                            Candidater
                        </button>
                    )}
                </div>
            </div>

            {showSelect && (
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <select
                        value={selectedDoc}
                        onChange={e => setSelectedDoc(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                    >
                        <option value="">-- Choisir un document --</option>
                        {documents.map(doc => (
                            <option key={doc.id} value={doc.id}>
                                {doc.nom} ({doc.type})
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleCandidater}
                        disabled={!selectedDoc}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg disabled:opacity-40"
                    >
                        Envoyer
                    </button>
                </div>
            )}
        </div>
    )
}