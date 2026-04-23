import GuestLayout from '@/Layouts/GuestLayout';
import { Head} from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function AttenteActivation() {
    return (
        <GuestLayout>
            <Head title="Demande envoyée" />

            <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-lg text-center">
                <h1 className="text-xl font-semibold text-gray-800 mb-4">
                    Demande envoyée
                </h1>

                <p className="text-gray-600">
                    Votre demande de création de compte a réussi.
                    <br />
                    Vous recevrez un email lorsque votre compte sera activé.
                </p>

                <button
                    onClick={() => router.post(route('logout'))}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                >
                    Retour
                </button>
            </div>
        </GuestLayout>
    );
}