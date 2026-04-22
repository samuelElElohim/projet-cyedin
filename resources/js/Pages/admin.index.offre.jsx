import { useForm } from "@inertiajs/react"

export default function OffreIndex({ entreprises }) {

    const { post } = useForm()

    function toggleActive(id) {
        post(route('admin.toggle.offre', id))
    }

    return (
        <>
            <h1>Liste des offres par entreprise</h1>

           {entreprises.map(entreprise => {

            const offres = Array.isArray(entreprise.offres)
                ? entreprise.offres
                : []

            const actives = offres.filter(o => o.est_active)
            const inactives = offres.filter(o => !o.est_active)

            return (
                <div key={entreprise.id} style={{ marginBottom: 40 }}>

                    <h2>🏢 {entreprise.nom_entreprise}</h2>

                    <h3>🟢 Offres actives</h3>
                    {actives.length === 0 && <p>Aucune offre active</p>}

                    {actives.map(o => (
                        <div key={o.id}>
                            {o.titre}
                            <button onClick={() => toggleActive(o.id)}>Désactiver</button>
                        </div>
                    ))}

                    <h3>🔴 Offres inactives</h3>
                    {inactives.length === 0 && <p>Aucune offre inactive</p>}

                    {inactives.map(o => (
                        <div key={o.id}>
                            {o.titre}
                            <button onClick={() => toggleActive(o.id)}>Activer</button>
                        </div>
                    ))}

                </div>
            )
        })}
        </>
    )
}