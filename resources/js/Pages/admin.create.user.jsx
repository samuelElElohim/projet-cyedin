import { useForm } from "@inertiajs/react"
import { Link } from "@inertiajs/react";


const ROLES = [
    { value: 'A', label: 'Administrateur' },
    { value: 'E', label: 'Entreprise' },
    { value: 'T', label: 'Tuteur' },
    { value: 'S', label: 'Étudiant' },
]

export default function AdminCreateUser(){
    // useForm gère les données + erreurs + @csrf automatiquement
    const { data, setData, post, errors } = useForm({
        nom: '',
        prenom: '',
        email: '',
        role: '',
        psw : '',

        // Champs spécifiques étudiants : 
        filiere : '',
        niveau_etud: '',

        // Champs spécifiques entreprises :
        addresse : '',
        secteur:'',

        // Champs spécifiques tuteur : 

        departement : '',
        est_jury :'',

        // Champs spécifiques admin :
        //niveau

    })



    function handleSubmit(e) {
        e.preventDefault() //Empeche le formulaire de se déclencher par défaut
        post(route('admin.store.user'))  // envoie vers la route Laravel
    }

    function handleRoleChange(e) {
    setData({
        ...data,
        role: e.target.value,
        // Champs entreprise
        addresse: '',
        secteur: '',
        // Champs tuteur
        departement:'',
        est_jury:'',
        // Champs etudiant
        filiere:'',
        niveau_etud:'',
    })
    }
    
    return (

        <>
        <form onSubmit={handleSubmit}>


            {// Input communs à tous les utilisateurs : 
            }
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

            <select
                value={data.role}
                onChange={handleRoleChange}
            >
                <option value="">-- Choisir un rôle --</option>
                {ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                ))}
            </select>
            {errors.role && <span>{errors.role}</span>}

            {/*
            <input
                type="number"
                value={data.role}
                onChange={e => setData('role', e.target.value)}
                placeholder="Role Utilisateur"
            />
            */}

            {/* Champs dynamiques selon le rôle */}
            {/*data.role === 'admin' && (
                <input>
                </input>
            )*/}

            {data.role === 'E' && (
                <>
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
                </>
            )}

            {data.role === 'T' && (
                <>
                    <input type="text"
                    value={data.departement}
                    onChange={e=>setData('departement', e.target.value)}
                    placeholder="Departement (Bêta)"
                    />
                    <label>Est Jury</label>
                    <input type="checkbox"
                    checked={data.est_jury}
                    onChange={e=>setData('est_jury', e.target.checked)}
                    />
                </>
            )}

            {data.role === 'S' && (
                <>
                    <input type="text"
                    value={data.filiere}
                    onChange={e=>setData('filiere', e.target.value)}
                    placeholder="Filière (Bêta)"
                    />

                    <input type='number'
                    value={data.niveau_etud}
                    onChange={e=>setData('niveau_etud', e.target.value)}
                    placeholder="Niveau Etude (Bêta)" />
                </>
            )}


            <button type="submit">Ajouter Utilisateur</button>
        </form>
            <Link href={route("admin.dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded">
            Retour
        </Link>
        </>
    )

}
