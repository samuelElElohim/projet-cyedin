import { useForm } from "@inertiajs/react"

/* OBSLOETE */


export default function AdminCreateEntreprise(){
    // useForm gère les données + erreurs + @csrf automatiquement
    const { data, setData, post, errors } = useForm({
        nom_entreprise: '',
        addresse: '',
        secteur: '',
        utilisateurs_id : '',
    })

    function handleSubmit(e) {
        e.preventDefault() //Empeche le formulaire de se déclencher par défaut
        post(route('admin.store.entreprise'))  // envoie vers la route Laravel
    }

    return (
        <form onSubmit={handleSubmit}>

            <input
                type="number"
                value={data.utilisateurs_id}
                onChange={e => setData('utilisateurs_id', e.target.value)}
                placeholder="ID utilisateurs"
            />

            <input
                type="text"
                value={data.nom_entreprise}
                onChange={e => setData('nom_entreprise', e.target.value)}
                placeholder="Nom Enterprise"
            />
            {errors.nom_entreprise && <span>{errors.nom_entreprise}</span>}

            <input
                type="text"
                value={data.addresse}
                onChange={e => setData('addresse', e.target.value)}
                placeholder="Addresse"
            />

            <input
                type="text"
                value={data.secteur}
                onChange={e => setData('secteur', e.target.value)}
                placeholder="Secteur (Béta)"
            />


            <button type="submit">Ajouter Enterprise</button>
        </form>
    )

}
