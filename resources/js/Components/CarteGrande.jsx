export default function CarteGrande({ offre }) {
    return (
        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-shadow">
            
            {/* Image */}
            <div className="relative h-40 bg-gray-100">
                <img
                    src={offre.image_url}
                    alt={offre.titre}
                    className="w-full h-full object-cover"
                />
                {/* Badge durée sur l'image */}
                <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {offre.duree_semaines} semaines
                </span>
            </div>

            {/* Contenu */}
            <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <p className="font-bold text-gray-900 text-base leading-tight">{offre.titre}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {offre.entreprise?.nom_entreprise} · {offre.ville ?? 'Lieu non précisé'}
                        </p>
                    </div>
                    {offre.remuneration && (
                        <span className="text-sm font-semibold text-green-600 flex-shrink-0">
                            {offre.remuneration} €/mois
                        </span>
                    )}
                </div>

                {/* Description tronquée */}
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {offre.description}
                </p>

                {/* Footer — tags + date */}
                <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-2">
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
                    {offre.date_limite_candidature && (
                        <p className="text-xs text-red-400">
                            Limite : {new Date(offre.date_limite_candidature).toLocaleDateString('fr-FR')}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}