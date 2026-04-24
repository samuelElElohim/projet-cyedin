export default function CarteCompacte({ offre }) {
    return (
        <div className="flex items-center justify-between gap-4 px-5 py-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
            
            {/* Gauche — infos principales */}
            <div className="flex items-center gap-4 min-w-0">
                {/* Avatar entreprise — initiale */}
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

            {/* Centre — tags */}
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

            {/* Droite — durée + rémunération */}
            <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium text-gray-800">{offre.duree_semaines} sem.</p>
                <p className="text-xs text-gray-400">
                    {offre.remuneration ? `${offre.remuneration} €/mois` : 'Non rémunéré'}
                </p>
            </div>
        </div>
    )
}