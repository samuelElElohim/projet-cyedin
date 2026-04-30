import InputError from '@/Components/UI/InputError';
import InputLabel from '@/Components/UI/InputLabel';
import Button from '@/Components/UI/Button';
import TextInput from '@/Components/UI/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        num_etu: '',
        nom: '',
        prenom: '',
        email: '',
        mot_de_passe: '',
        mot_de_passe_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('mot_de_passe', 'mot_de_passe_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="num_etu" value="Numéro Etudiant"/>
                    
                    <TextInput
                        id="num_etu"
                        name="num_etu"
                        type="number"
                        value={data.num_etu}
                        className="mt-1 block w-full"
                        autoComplete="num_etu"
                        isFocused={true}
                        onChange={(e) => setData('num_etu', e.target.value)}
                        required

                    />

                    <InputLabel htmlFor="name" value="Nom" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.nom}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('nom', e.target.value)}
                        required
                    />

                    <InputError message={errors.nom} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="prenom" value="Prénom" />

                    <TextInput
                        id="prenom"
                        name="prenom"
                        value={data.prenom}
                        className="mt-1 block w-full"
                        autoComplete="prenom"
                        isFocused={true}
                        onChange={(e) => setData('prenom', e.target.value)}
                        required
                    />

                    <InputError message={errors.prenom} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="mot_de_passe" value="Mot de Passe" />

                    <TextInput
                        id="mot_de_passe"
                        type="password"
                        name="mot_de_passe"
                        value={data.mot_de_passe}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('mot_de_passe', e.target.value)}
                        required
                    />

                    <InputError message={errors.mot_de_passe} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="mot_de_passe_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="mot_de_passe_confirmation"
                        type="password"
                        name="mot_de_passe_confirmation"
                        value={data.mot_de_passe_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('mot_de_passe_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.mot_de_passe_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <Button variant="primary" className="ms-4" disabled={processing}>
                        Register
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
