import InputError from '@/Components/UI/InputError';
import InputLabel from '@/Components/UI/InputLabel';
import TextInput from '@/Components/UI/TextInput';
import Button from '@/Components/UI/Button';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function PremierMotDePasse() {
    const { data, setData, post, processing, errors, reset } = useForm({
        mot_de_passe: '',
        mot_de_passe_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.premier.store'), {
            onFinish: () => reset('mot_de_passe', 'mot_de_passe_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Choisir votre mot de passe" />

            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Bienvenue sur CYedin</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Votre compte a été créé par un administrateur. Veuillez définir votre propre mot de passe avant de continuer.
                </p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="mot_de_passe" value="Nouveau mot de passe" />
                    <TextInput
                        id="mot_de_passe"
                        type="password"
                        name="mot_de_passe"
                        value={data.mot_de_passe}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('mot_de_passe', e.target.value)}
                    />
                    <InputError message={errors.mot_de_passe} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="mot_de_passe_confirmation" value="Confirmer le mot de passe" />
                    <TextInput
                        id="mot_de_passe_confirmation"
                        type="password"
                        name="mot_de_passe_confirmation"
                        value={data.mot_de_passe_confirmation}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('mot_de_passe_confirmation', e.target.value)}
                    />
                    <InputError message={errors.mot_de_passe_confirmation} className="mt-2" />
                </div>

                <div className="mt-6 flex items-center justify-end">
                    <Button variant="primary" type="submit" disabled={processing}>
                        Enregistrer mon mot de passe
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}