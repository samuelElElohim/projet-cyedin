import { Link, Head } from '@inertiajs/react';

export default function Home() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
            <Head title="CYedin - Portail des Stages CY Tech" />

            {/* --- Bande accent top --- */}
            <div className="fixed top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-700 z-[100]" />

            {/* --- Header Navigation NOIR (page 2) --- */}
            <nav className="sticky top-0 z-50 w-full bg-slate-900/97 backdrop-blur-md border-b border-white/[0.07]">
                <div className="max-w-7xl mx-auto px-6 md:px-12 h-[72px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl rotate-3 shadow-lg absolute inset-0" />
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl -rotate-6 absolute inset-0 opacity-80 mix-blend-multiply" />
                            <span className="absolute inset-0 flex items-center justify-center text-white font-black text-xs">CY</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">
                            CY<span className="text-blue-400">edin</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#" className="text-sm font-bold text-white/55 hover:text-white transition">Offres</Link>
                        <Link href="#" className="text-sm font-bold text-white/55 hover:text-white transition">Aide</Link>
                        <Link
                            href="/login"
                            className="px-6 py-2.5 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-blue-600 hover:text-white hover:shadow-xl transition-all"
                        >
                            Accès Portail
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- Contenu principal scrollable --- */}
            <main className="relative max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-24">

                {/* Deco background */}
                <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-gradient-to-bl from-blue-50/40 via-transparent to-transparent -z-10 pointer-events-none" />

                {/* --- Hero Grid --- */}
                <div className="grid lg:grid-cols-12 gap-12 items-center mb-32">

                    {/* Hero Text */}
                    <div className="lg:col-span-7">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-md border border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest mb-8">
                            Plateforme Officielle CY Tech
                        </div>

                        <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[1.05] mb-8">
                            Propulsez votre <br />
                            <span className="relative inline-block">
                                <span className="relative z-10 text-blue-600">carrière</span>
                                <div className="absolute bottom-2 left-0 w-full h-4 bg-emerald-100 -z-10" />
                            </span> avec CYedin.
                        </h1>

                        <p className="text-xl text-slate-500 max-w-xl leading-relaxed mb-10">
                            La plateforme interne de CY Tech Pau dédiée aux stages, aux entreprises et aux tuteurs.
                            Centralisez vos documents, suivez vos validations et accédez à un écosystème pensé pour votre réussite professionnelle.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/login"
                                className="px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
                            >
                                Se connecter à l'espace
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>

                            <button className="px-10 py-5 bg-white text-slate-700 font-bold rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:text-emerald-600 transition-all">
                                Consulter les offres
                            </button>
                        </div>
                    </div>

                    {/* Dashboard Card */}
                    <div className="lg:col-span-5 relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-100 to-blue-100 rounded-[3rem] blur-2xl opacity-50 -z-10" />

                        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                </div>
                                <div className="h-4 w-32 bg-slate-100 rounded-full" />
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600 font-bold">📄</div>
                                    <div className="flex-1">
                                        <div className="h-3 w-24 bg-emerald-200 rounded-full mb-2" />
                                        <div className="h-2 w-16 bg-emerald-100 rounded-full" />
                                    </div>
                                    <div className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">VALIDÉ</div>
                                </div>

                                <div className="space-y-3">
                                    <div className="h-4 w-full bg-slate-50 rounded-full" />
                                    <div className="h-4 w-[90%] bg-slate-50 rounded-full" />
                                    <div className="h-4 w-[40%] bg-slate-100 rounded-full" />
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 border-2 border-white" />
                                    <div className="h-10 w-10 rounded-full bg-emerald-100 border-2 border-white -ml-3" />
                                    <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white -ml-3 flex items-center justify-center text-[10px] font-bold">+12</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Section Rôles --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
                    {[
                        { label: "Étudiants", desc: "Suivez vos stages, déposez vos documents et accédez à vos validations.", color: "text-blue-600" },
                        { label: "Entreprises", desc: "Publiez vos offres et gérez vos conventions en toute simplicité.", color: "text-emerald-600" },
                        { label: "Tuteurs", desc: "Accompagnez vos étudiants et validez leurs étapes clés.", color: "text-blue-600" },
                        { label: "Jurys", desc: "Consultez les dossiers et évaluez les parcours.", color: "text-emerald-600" }
                    ].map((role, i) => (
                        <div key={i} className="cursor-default">
                            <h4 className={`font-black text-sm uppercase tracking-widest mb-2 ${role.color}`}>{role.label}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">{role.desc}</p>
                        </div>
                    ))}
                </div>

                {/* --- Chiffres clés --- */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
                    {[
                        { number: "1 200+", label: "Étudiants actifs" },
                        { number: "350+", label: "Entreprises partenaires" },
                        { number: "900+", label: "Stages archivés" }
                    ].map((stat, i) => (
                        <div key={i}>
                            <div className="text-4xl font-black text-blue-600">{stat.number}</div>
                            <div className="text-sm font-bold text-slate-500 mt-2">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </main>

            {/* --- Footer --- */}
            <footer className="bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-12 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-sm font-bold text-white/35">
                        CYedin © 2026 — CY TECH Développement Web
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="text-xs font-bold text-white/35 hover:text-blue-400 uppercase tracking-widest transition">Mentions Légales</a>
                        <a href="#" className="text-xs font-bold text-white/35 hover:text-emerald-400 uppercase tracking-widest transition">Confidentialité</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}