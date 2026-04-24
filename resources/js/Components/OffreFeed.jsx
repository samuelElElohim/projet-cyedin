import CarteCompacte from './CarteCompacte'
import CarteGrande from './CarteGrande'

export default function OffreFeed({ offres }) {
    return (
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-3">

            {/* Header feed */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900">
                    {offres.length} offre{offres.length > 1 ? 's' : ''} disponible{offres.length > 1 ? 's' : ''}
                </h2>
            </div>

            {/* Cartes */}
            {offres.map(offre =>
                offre.image_url
                    ? <CarteGrande key={offre.id} offre={offre} />
                    : <CarteCompacte key={offre.id} offre={offre} />
            )}

            {offres.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    Aucune offre disponible pour le moment.
                </div>
            )}
        </div>
    )
}