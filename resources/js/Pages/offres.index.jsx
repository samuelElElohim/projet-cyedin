export default function OffreIndex({ offres }) {
    // offres est passé automatiquement par Inertia
    // depuis le controller via ['offres' => $offres]

    return (
        <div>
            <h1>Liste des offres</h1>
            {offres.map(offre => (
                <div key={offre.id}>
                    <h2>{offre.titre}</h2>
                    <p>{offre.entreprise}</p>
                </div>
            ))}
        </div>
    )
}