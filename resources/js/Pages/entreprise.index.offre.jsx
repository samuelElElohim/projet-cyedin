import { useForm } from "@inertiajs/react"

export default function OffreIndex({ offres }) {

    const { data, setData, post, reset, errors } = useForm({
        titre: '',
        description: '',
        duree_semaines: '',
    })

    function handleSubmit(e) {
        e.preventDefault()

        post(route('entreprise.store.offre'), {
            onSuccess: () => reset()
        })
    }

    return (
        <>
            <h1>Liste des offres actives :</h1>

            {(offres ?? []).map(o => (
                <div key={o.id}>
                    <strong>{o.titre}</strong>
                </div>
            ))}

            <hr />

            <h2>Créer une nouvelle offre</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    value={data.titre}
                    onChange={e => setData('titre', e.target.value)}
                    placeholder="Titre de l'offre"
                />
                {errors.titre && <span>{errors.titre}</span>}

                <textarea
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    placeholder="Description"
                />
                {errors.description && <span>{errors.description}</span>}

                <input
                    type="number"
                    value={data.duree_semaines}
                    onChange={e => setData('duree_semaines', e.target.value)}
                    placeholder="Durée en semaines"
                />
                {errors.duree_semaines && <span>{errors.duree_semaines}</span>}

                <button type="submit">
                    Ajouter l'offre
                </button>

            </form>

            <button
                onClick={() => router.get(route('entreprise.dashboard'))}
                className="px-4 py-2 bg-red-600 text-white rounded"
            >
                Retour
            </button>
        </>
    )
}