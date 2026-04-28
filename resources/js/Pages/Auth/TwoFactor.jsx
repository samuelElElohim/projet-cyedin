import InputError from '@/Components/UI/InputError';
import TextInput from '@/Components/UI/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function TwoFactor({ email }) {
    const { status } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({ code: '' });

    function submit(e) {
        e.preventDefault();
        post(route('2fa.store'));
    }

    return (
        <GuestLayout>
            <Head title="Vérification — CYedin" />

            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Vérification en deux étapes</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Un code à 6 chiffres a été envoyé à{' '}
                    <span className="font-medium text-gray-800">{email}</span>.
                    Saisissez-le ci-dessous pour accéder à votre espace.
                </p>
            </div>

            {status && (
                <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                        Code de vérification
                    </label>
                    <TextInput
                        id="code"
                        type="text"
                        name="code"
                        value={data.code}
                        className="w-full px-4 py-3.5 text-center text-2xl font-bold tracking-[0.5em] bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        maxLength={6}
                        placeholder="000000"
                        isFocused={true}
                        onChange={e => setData('code', e.target.value.replace(/\D/g, ''))}
                    />
                    <InputError message={errors.code} className="mt-2 text-xs text-red-500" />
                </div>

                <button
                    type="submit"
                    disabled={processing || data.code.length !== 6}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    {processing ? 'Vérification…' : 'Valider le code'}
                </button>
            </form>

            <div className="mt-6 flex flex-col items-center gap-3 text-xs">
                <Link
                    href={route('2fa.resend')}
                    method="post"
                    as="button"
                    className="text-blue-600 hover:text-blue-800 font-semibold transition"
                >
                    Renvoyer un code
                </Link>
                <Link
                    href={route('login')}
                    className="text-slate-400 hover:text-slate-600 transition"
                >
                    ← Retour à la connexion
                </Link>
            </div>
        </GuestLayout>
    );
}
