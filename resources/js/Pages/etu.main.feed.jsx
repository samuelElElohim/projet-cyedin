import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useForm } from "@inertiajs/react"
import OffreFeed from "@/Components/OffreFeed"

export default function EtuMainFeed({ offres, dejasCandidatures, documents }) {
    return (
        <AuthenticatedLayout>
            <OffreFeed
                offres={offres}
                dejasCandidatures={dejasCandidatures}
                documents={documents}
            />
        </AuthenticatedLayout>
    )
}