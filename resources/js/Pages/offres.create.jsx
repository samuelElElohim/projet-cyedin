import { useForm } from "@inertiajs/react"

export default function OffresCreate(){
    // useForm gère les données + erreurs + @csrf automatiquement
    const { data, setData, post, errors } = useForm({
        titre: '',
        description: '',
        entreprise: '',
        duree_semaines: '',
    })

    function handleSubmit(e) {
        e.preventDefault() //Empeche le formulaire de se déclencher par défaut
        post(route('offres.store'))  // envoie vers la route Laravel
    }

    return (
        <form onSubmit={handleSubmit}>

            <input
                type="text"
                value={data.titre}
                onChange={e => setData('titre', e.target.value)}
                placeholder="Titre du stage"
            />
            {errors.titre && <span>{errors.titre}</span>}

            <textarea
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                placeholder="Description"
            />

            <input
                type="text"
                value={data.entreprise}
                onChange={e => setData('entreprise', e.target.value)}
                placeholder="Nom de l'entreprise"
            />

            <input
                type="number"
                value={data.duree_semaines}
                onChange={e => setData('duree_semaines', e.target.value)}
                placeholder="Durée (semaines)"
            />

            <button type="submit">Ajouter l'offre</button>
        </form>
    )

}
