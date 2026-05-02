import InputError from '@/Components/UI/InputError';
import InputLabel from '@/Components/UI/InputLabel';
import TextInput from '@/Components/UI/TextInput';
import Button from '@/Components/UI/Button';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function RegisterEntreprise() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nom_entreprise: '',
        email: '',
        mot_de_passe: '',
        mot_de_passe_confirmation: '',
        addresse: '',
        secteur: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register.entreprise'), {
            onFinish: () => reset('mot_de_passe', 'mot_de_passe_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Inscription Entreprise" />

            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Inscription Entreprise</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Votre compte sera activé après validation par un administrateur CY Tech.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="nom_entreprise" value="Nom de l'entreprise" />
                    <TextInput
                        id="nom_entreprise"
                        name="nom_entreprise"
                        value={data.nom_entreprise}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('nom_entreprise', e.target.value)}
                        required
                    />
                    <InputError message={errors.nom_entreprise} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email professionnel" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="addresse" value="Adresse" />
                    <TextInput
                        id="addresse"
                        name="addresse"
                        value={data.addresse}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('addresse', e.target.value)}
                        required
                    />
                    <InputError message={errors.addresse} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="secteur" value="Secteur d'activité" />
                    <TextInput
                        id="secteur"
                        name="secteur"
                        value={data.secteur}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('secteur', e.target.value)}
                        required
                    />
                    <InputError message={errors.secteur} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="mot_de_passe" value="Mot de passe" />
                    <TextInput
                        id="mot_de_passe"
                        type="password"
                        name="mot_de_passe"
                        value={data.mot_de_passe}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('mot_de_passe', e.target.value)}
                        required
                    />
                    <InputError message={errors.mot_de_passe} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="mot_de_passe_confirmation" value="Confirmer le mot de passe" />
                    <TextInput
                        id="mot_de_passe_confirmation"
                        type="password"
                        name="mot_de_passe_confirmation"
                        value={data.mot_de_passe_confirmation}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('mot_de_passe_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.mot_de_passe_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <Link href={route('login')} className="text-sm text-gray-600 underline hover:text-gray-900">
                        Déjà un compte ?
                    </Link>
                    <Button variant="primary" disabled={processing}>
                        Soumettre la demande
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}