import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import NotifDropdown from '@/Components/Shared/NotifDropdown';

const NAV_ITEMS = [
    { label: 'Tableau de bord',    href: 'tuteur.dashboard',     icon: '▦' },
    { label: 'Offres de stage',    href: 'tuteur.offres',        icon: '🔍' },  // ← AJOUTER
    { label: 'Affecter un stage',  href: 'tuteur.create.stage',  icon: '➕' },
];

export default function TuteurLayout({ children, title = 'Espace Tuteur' }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-56' : 'w-14'} bg-white border-r border-slate-100 flex flex-col transition-all duration-200 shrink-0 shadow-sm`}>
                <div className="h-16 flex items-center px-4 border-b border-slate-100">
                    {sidebarOpen && (
                        <span className="text-lg font-black tracking-tight text-slate-900">
                            CY<span className="text-teal-600">edin</span>
                            <span className="text-xs font-normal text-slate-400 ml-2">Tuteur</span>
                        </span>
                    )}
                    <button
                        onClick={() => setSidebarOpen(p => !p)}
                        className="ml-auto text-slate-300 hover:text-slate-600 text-xl transition"
                    >
                        {sidebarOpen ? '←' : '→'}
                    </button>
                </div>

                <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
                    {NAV_ITEMS.map(item => {
                        const isActive = route().current(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={route(item.href)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                                    isActive
                                        ? 'bg-teal-50 text-teal-700'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                            >
                                <span className="text-base shrink-0">{item.icon}</span>
                                {sidebarOpen && <span className="truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-slate-100 p-4">
                    {sidebarOpen && (
                        <div className="text-xs text-slate-400 mb-2">
                            <div className="font-semibold text-slate-700">{user?.prenom} {user?.nom}</div>
                            <div className="truncate">{user?.email}</div>
                        </div>
                    )}
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-xs text-red-400 hover:text-red-600 transition"
                    >
                        {sidebarOpen ? 'Déconnexion' : '⏻'}
                    </Link>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 shrink-0 shadow-sm">
                    <h1 className="text-base font-semibold text-slate-800">{title}</h1>
                    <NotifDropdown />
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}