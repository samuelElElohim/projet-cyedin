import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import NotifDropdown from '@/Components/Shared/NotifDropdown';

const ALL_NAV_ITEMS = [
    { label: 'Tableau de bord',  href: 'etudiant.dashboard',         icon: '▦',  always: true },
    { label: 'Offres de stage',  href: 'etudiant.offres',            icon: '🔍', always: true },
    { label: 'Mes candidatures', href: 'etudiant.candidatures',      icon: '📨', always: true },
    { label: 'Mon dossier',      href: 'etudiant.dossier',           icon: '📁', needsStage: true },
    { label: 'Cahier de stage',  href: 'etudiant.cahier',            icon: '📓', needsCahier: true },
    { label: 'Demander filière', href: 'etudiant.demande.formation', icon: '🔖', always: true },
];

export default function EtudiantLayout({ children, title = 'Espace Étudiant' }) {
    const { auth, etudiant_flags } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const hasStage           = etudiant_flags?.has_stage           ?? false;
    const conventionComplete = etudiant_flags?.convention_complete ?? false;
    const dossierValide      = etudiant_flags?.dossier_valide      ?? false;

    // "Mon dossier" → visible dès qu'un stage existe
    // "Cahier de stage" → visible seulement quand convention complète ET dossier validé
    const visibleNavItems = ALL_NAV_ITEMS.filter(item => {
        if (item.always)      return true;
        if (item.needsStage)  return hasStage;
        if (item.needsCahier) return conventionComplete && dossierValide;
        return true;
    });

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-100 flex flex-col transition-all duration-300 shrink-0 shadow-sm`}>

                {/* Logo & Toggle */}
                <div className="h-16 flex items-center px-4 border-b border-slate-100">
                    {sidebarOpen && (
                        <Link href={route('etudiant.dashboard')} className="text-xl font-black tracking-tighter text-slate-900">
                            CY<span className="text-blue-600">edin</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`text-slate-400 hover:text-blue-600 transition-colors ${sidebarOpen ? 'ml-auto' : 'mx-auto'}`}
                    >
                        {sidebarOpen ? '⇠' : '⇢'}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 space-y-1 px-3">
                    {visibleNavItems.map(item => {
                        const isActive = route().current(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={route(item.href)}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {sidebarOpen && <span className="truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-slate-50 bg-slate-50/50">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                            {user?.nom?.charAt(0)}
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">{user?.prenom} {user?.nom}</p>
                                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => router.post(route('logout'))}
                        className="mt-4 flex items-center gap-3 w-full px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <span>⏻</span>
                        {sidebarOpen && <span>Déconnexion</span>}
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-lg font-bold text-slate-800 truncate">{title}</h2>
                    <div className="flex items-center gap-4">
                        <NotifDropdown />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto text-slate-700">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}