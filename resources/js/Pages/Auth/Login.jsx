import Checkbox from '@/Components/UI/Checkbox';
import InputError from '@/Components/UI/InputError';
import InputLabel from '@/Components/UI/InputLabel';
import TextInput from '@/Components/UI/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        mot_de_passe: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('mot_de_passe'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-900 flex font-sans">
            <Head title="Connexion — CYedin" />

            {/* Bande accent top */}
            <div className="fixed top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-700 z-50" />

            {/* --- Panneau gauche décoratif --- */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-16">
                {/* Fond animé */}
                <div className="absolute inset-0 bg-slate-900" />
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/15 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-800/10 rounded-full blur-[80px]" />

                {/* Grille décorative */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
                        backgroundSize: '48px 48px'
                    }}
                />

                {/* Logo */}
                <div className="relative flex items-center gap-3 z-10">
                    <div className="relative w-10 h-10">
                        <div className="absolute inset-0 bg-blue-600 rounded-xl rotate-3 shadow-lg" />
                        <div className="absolute inset-0 bg-emerald-500 rounded-xl -rotate-6 opacity-80 mix-blend-multiply" />
                        <span className="absolute inset-0 flex items-center justify-center text-white font-black text-xs">CY</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">
                        CY<span className="text-blue-400">edin</span>
                    </span>
                </div>

                {/* Citation centrale */}
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.06] border border-white/10 rounded-md text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-8">
                        Plateforme Officielle CY Tech
                    </div>
                    <h2 className="text-5xl font-black text-white leading-[1.1] mb-6">
                        Votre espace<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            professionnel
                        </span><br />
                        vous attend.
                    </h2>
                    <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                        Centralisez vos stages, suivez vos validations et accédez à l'ensemble de vos documents depuis un seul endroit.
                    </p>
                </div>

                {/* Stats bas */}
                <div className="relative z-10 flex gap-10">
                    {[
                        { n: '1 200+', l: 'Étudiants' },
                        { n: '350+', l: 'Entreprises' },
                        { n: '900+', l: 'Stages archivés' },
                    ].map((s, i) => (
                        <div key={i}>
                            <div className="text-2xl font-black text-white">{s.n}</div>
                            <div className="text-xs font-bold text-slate-500 mt-1">{s.l}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Panneau droit : formulaire --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20 relative">
                <div className="absolute inset-0 bg-white" />

                <div className="relative w-full max-w-md">

                    {/* Logo mobile uniquement */}
                    <div className="flex lg:hidden items-center gap-3 mb-10">
                        <div className="relative w-9 h-9">
                            <div className="absolute inset-0 bg-blue-600 rounded-xl rotate-3" />
                            <div className="absolute inset-0 bg-emerald-500 rounded-xl -rotate-6 opacity-80 mix-blend-multiply" />
                            <span className="absolute inset-0 flex items-center justify-center text-white font-black text-[10px]">CY</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-900">
                            CY<span className="text-blue-600">edin</span>
                        </span>
                    </div>

                    {/* En-tête formulaire */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Connexion</h1>
                        <p className="text-slate-500 text-sm font-medium">
                            Accédez à votre espace CY Tech
                        </p>
                    </div>

                    {/* Message status */}
                    {status && (
                        <div className="mb-6 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-700">
                            {status}
                        </div>
                    )}

<<<<<<< HEAD
                    
                    {/* Section Première connexion */}
                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>
                            Première connexion ?{' '}
                            <Link
                                href={route('register')}
                                className="underline text-gray-700 hover:text-gray-900"
                            >
                                Créer un compte
                            </Link>
                        </p>
                    </div>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
=======
                    <form onSubmit={submit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Adresse e-mail"
                                className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2"
                            />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                autoComplete="username"
                                isFocused={true}
                                placeholder="prenom.nom@cytech.fr"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2 text-xs text-red-500" />
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <InputLabel
                                    htmlFor="password"
                                    value="Mot de passe"
                                    className="text-xs font-black uppercase tracking-widest text-slate-500"
                                />
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                                    >
                                        Mot de passe oublié ?
                                    </Link>
                                )}
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="mot_de_passe"
                                value={data.mot_de_passe}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('mot_de_passe', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2 text-xs text-red-500" />
                        </div>

                        {/* Se souvenir */}
                        <div className="flex items-center gap-2.5">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="remember" className="text-sm font-medium text-slate-500 cursor-pointer select-none">
                                Se souvenir de moi
                            </label>
                        </div>

                        {/* Bouton */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-3 group text-sm"
                        >
                            {processing ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                    </svg>
                                    Connexion en cours…
                                </>
                            ) : (
                                <>
                                    Se connecter
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Retour accueil */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/"
                            className="text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition"
                        >
                            ← Retour à l'accueil
                        </Link>
                    </div>

                    {/* Footer */}
                    <div className="mt-16 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        CYedin © 2026 — CY Tech Développement Web
                    </div>
>>>>>>> origin/franck
                </div>
            </div>
        </div>
    );
}