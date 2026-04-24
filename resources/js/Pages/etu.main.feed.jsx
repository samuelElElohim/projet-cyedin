import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useForm } from "@inertiajs/react"
import OffreFeed from "@/Components/OffreFeed"

export default function EtuMainFeed({ offres }) {


    return (
        <>
            <AuthenticatedLayout>
            <OffreFeed offres={offres}/>
            </AuthenticatedLayout>


        </>
    )
}