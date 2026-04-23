import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useForm } from "@inertiajs/react"

export default function EtuMainFeed({ offres }) {


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
            <AuthenticatedLayout>
            <h1>Liste des offres actives :</h1>

            {(offres ?? []).map(o => (
                <div key={o.id}>
                    <strong>{o.titre}</strong>
                </div>
            ))}

            <hr/>
            </AuthenticatedLayout>


        </>
    )
}