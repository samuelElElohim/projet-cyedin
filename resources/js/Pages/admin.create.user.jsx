import { useForm } from "@inertiajs/react"

export default function AdminCreateUser(){
    // useForm gère les données + erreurs + @csrf automatiquement
    const { data, setData, post, errors } = useForm({
        nom: '',
        prenom: '',
        email: '',
        role: '',
        psw : '',
    })

    function handleSubmit(e) {
        e.preventDefault() //Empeche le formulaire de se déclencher par défaut
        post(route('admin.store.user'))  // envoie vers la route Laravel
    }

    return (
        <form onSubmit={handleSubmit}>

            <input
                type="text"
                value={data.nom}
                onChange={e => setData('nom', e.target.value)}
                placeholder="Nom Utilisateur"
            />
            {errors.nom && <span>{errors.nom}</span>}

            <input
                type="text"
                value={data.prenom}
                onChange={e => setData('prenom', e.target.value)}
                placeholder="Prenom Utilisateur"
            />

            <input
                type="text"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                placeholder="Email Utilisateur"
            />

            <input
                type="number"
                value={data.role}
                onChange={e => setData('role', e.target.value)}
                placeholder="Role Utilisateur"
            />


            <button type="submit">Ajouter Utilisateur</button>
        </form>
    )

}
