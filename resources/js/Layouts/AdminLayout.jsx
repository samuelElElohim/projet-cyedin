import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const NAV_ITEMS = [
    { label: "Vue d'ensemble",  href: 'admin.dashboard',       icon: '▦' },
    { label: 'Utilisateurs',    href: 'admin.main.user',       icon: '👤' },
    { label: 'Entreprises',     href: 'admin.main.entreprise', icon: '🏢' },
    { label: 'Offres de stage', href: 'admin.index.offre',     icon: '📋' },
    { label: 'Stages',          href: 'admin.index.stage',     icon: '🎓' },
    { label: 'Dossiers',        href: 'admin.index.dossier',   icon: '📁' },
    { label: 'Formations',      href: 'admin.index.formation', icon: '🔖' },
    { label: 'Fichier trace',   href: 'admin.trace',           icon: '📜' },
];

export default function AdminLayout({ children, title = 'Administration' }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`${
                    sidebarOpen ? 'w-56' : 'w-14'
                } bg-slate-900 text-white flex flex-col transition-all duration-200 shrink-0`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-4 border-b border-white/10">
                    {sidebarOpen && (
                        <span className="text-lg font-black tracking-tight">
                            CY<span className="text-blue-400">edin</span>
                            <span className="text-xs font-normal text-white/40 ml-2">Admin</span>
                        </span>
                    )}
                    <button
                        onClick={() => setSidebarOpen((p) => !p)}
                        className="ml-auto text-white/40 hover:text-white text-xl"
                    >
                        {sidebarOpen ? '←' : '→'}
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={route(item.href)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition"
                        >
                            <span className="text-base shrink-0">{item.icon}</span>
                            {sidebarOpen && <span className="truncate">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* User info */}
                <div className="border-t border-white/10 p-4">
                    {sidebarOpen && (
                        <div className="text-xs text-white/40 mb-2">
                            <div className="font-medium text-white/70">{auth?.user?.nom}</div>
                            <div>{auth?.user?.email}</div>
                        </div>
                    )}
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-xs text-red-400 hover:text-red-300"
                    >
                        {sidebarOpen ? 'Déconnexion' : '⏻'}
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shrink-0">
                    <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
                    <NotifBadge />
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

function NotifBadge() {
    const { notifications } = usePage().props;
    const count = notifications?.length ?? 0;

    return (
        <div className="ml-auto relative">
            <button className="relative p-2 text-gray-500 hover:text-gray-800">
                <span className="text-xl">🔔</span>
                {count > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </button>
        </div>
    );
}
